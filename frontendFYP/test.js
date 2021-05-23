var offLine=false;

window.addEventListener("online", connectionUpdate);
window.addEventListener("offline", connectionUpdate);

function connectionUpdate(event) {
  if (navigator.onLine) {
    if (offLine) {
     
      document.getElementById("connectionStatus").innerHTML =
        "<br><span class='btn btn-outline-success' id='statusOnline'>You are back online...</span>";
      setTimeout(function () {
        $("#statusOnline").fadeOut("slow");
      }, 2000);
      offLine = !offLine;
    }
  } else {
    
    document.getElementById("connectionStatus").innerHTML =
      "<br><span class='btn btn-outline-danger'> <i class='fas fa-cloud'></i>Oops!! You are offline!You cannot make any request to the server now!</span>";
      offLine = !offLine;
  }
}





$(document).ready(function () {
  if (sessionStorage.getItem("adminPrivilege") == "true") {
    document.getElementById("admin").style.display = "block";
  }
});

$(document).ready(function () {
  if (sessionStorage.getItem("ts") == "Student") {
    document.getElementById("report").style.display = "block";
  }
});

function logout() {
  console.log("Logout");
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8000/logout/",
    success: function (data) {
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("adminPrivilege");
      sessionStorage.removeItem("auth", "");
      window.location.href = "login.html";
    },
    error: function (response) {
      alert(response["statusText"]);
    },
  });
}


function load(){
  //document.getElementById('subject').innerHTML=localStorage.getItem('subject');
   var type=localStorage.getItem('testType');
   
}

/*                                   TEST TIMERS                                       */
function startTimer(){
  var count = 60;
 interval = setInterval(function(){
  document.getElementById('examEnd').innerHTML="<h1>"+count+"</h1>";
  count--;
  if (count === 0){
    clearInterval(interval);
    document.getElementById('examEnd').innerHTML='<h1>Exam Ended.<br/><small>Your answers have been autosubmitted.</small></h1>';
    document.getElementById('submitbtn').disabled=true;
    document.getElementById('end').disabled=true;
    evaluate1();
  }
}, 5000);
}

function finish(){
  // auto submit... call evaluate1()
  console.log("End examination clicked!");
  var type=localStorage.getItem('testType');
  if(type==='mcq'){
  evaluate1();
  }else{
    evaluate2();
  }
}


function stop(){
  document.getElementById('submitbtn').disabled=true;
  if(localStorage.getItem('testType')==='mcq'){
    evaluate1();
  }else{
    evaluate2();
  }
}


/*     #############################################################################################    */





/*                                    MAIN FUNCTIONS OBJECTIVE TEST                                */

var ansKeys={};
var interval;

function loop1(data,str){
  var i;
  for (i = 0; i < data.length; i++) { 
    //change name and id of radio button
    var choice="question"+data[i]['qid'];
          $(str).append(
                `<li class="list-group-item" id="${data[i]['qid']}"><h3>${data[i]['question']}&nbsp;<h3>
                <ol>
                 <li><input type="radio" class='radio-button form-check-input' name="${choice}" id="${choice}" value="1">
                 <label>&nbsp;&nbsp;&nbsp;&nbsp;${data[i]['option_1']}</label>
                 </li>
                
                 <li><input type="radio" class='radio-button form-check-input' name="${choice}" id="${choice}" value="2">
                 <label>&nbsp;&nbsp;&nbsp;&nbsp;${data[i]['option_2']}</label>
                 </li>
                 <li><input type="radio" class='radio-button form-check-input' name="${choice}" id="${choice}" value="3">
                 <label>&nbsp;&nbsp;&nbsp;&nbsp;${data[i]['option_3']}</label>
                 </li>
                 <li><input type="radio" class='radio-button form-check-input' name="${choice}" id="${choice}" value="4">
                 <label>&nbsp;&nbsp;&nbsp;&nbsp;${data[i]['option_4']}</label>
                 </li>
                 </ol>
                </li><br/>`
                );
          }
  
}

/*

$(document).ready(function () {
 // document.getElementById('testtype').innerHTML=localStorage.getItem('testType');
  document.getElementById('subject').innerHTML=localStorage.getItem('subject');
   var type=localStorage.getItem('testType');
   

});*/





function test(){
   document.getElementById('end').disabled=false;
   document.getElementById('start').disabled=true;
   var token = "Token ";
   var token1 = sessionStorage.getItem("auth");
   var authorization = token.concat(token1);
   var id=localStorage.getItem('subjectId');
  var url="http://127.0.0.1:8000/"+id+"/mcq/";


  if(localStorage.getItem('testType')==='subjective'){
    url="http://127.0.0.1:8000/"+id+"/subjective/";
    getSubectiveQuestions(url);
    return ;
  }

  
  $.ajax({
    type: "GET",
    url: url,
    headers: { Authorization: authorization },
    success: function (data) {
      console.log(data);
      loop1(data,'#questions');
      storeAnswers(data);
      startTimer();
      document.getElementById('submitbtn').style.display="block";
    },
    error: function (response) {
      alert(response["statusText"]);
    },
  });

}




function storeAnswers(data){
  var i;
  for (i = 0; i < data.length; i++) { 
       ansKeys[(data[i]['qid']).toString()]=data[i]['ans_key'];
  }
  console.log(ansKeys);

}


function evaluate1() {
 //stop timer
 clearInterval(interval);
 document.getElementById('submitbtn').disabled=true;
  var answersList=$("#myForm").serializeArray();
  console.log(answersList);
  var score=0;
  var i;
  for (i = 0; i < answersList.length; i++) { 
    var qid=(answersList[i]['name'].substring(8));
    if(answersList[i]["value"]==="" || answersList[i]["value"].length==0){
      score+=0;
    }else if((answersList[i]["value"])=== (ansKeys[qid]).toString()){
      score+=2;
    }else{
      score+=-1;
    }
   }
  // console.log(score);
   sendExamScore(score,ansKeys,answersList);
  
}


function sendExamScore(score,anskeys,ansList1){
  //make ajax POST to backend API and send options selected for question set and total score
  //to be stored in database

  var subid=parseInt(localStorage.getItem('subjectId'));
  var qid = [];
  var anschosen = [];
  var i=0;
  for(;i<ansList1.length;i++){
    var q=(ansList1[i]['name'].substring(8));
    qid.push(parseInt(q));
    anschosen.push(parseInt(ansList1[i]["value"]));
  }

  var body={'subjectId':subid,'anschosen':anschosen,'score':score,'q':qid};
  console.log(body);

  var token = "Token ";
  var token1 = sessionStorage.getItem("auth");
  var authorization = token.concat(token1);
  var url="http://127.0.0.1:8000/mcq_score/";
  //var body={};
  $.ajax({
    type: "POST",
    url: url,
    data:body,
    headers: { Authorization: authorization },
    success: function (data) {
     // console.log(data);
     
     // document.getElementById('submitbtn').style.display="block";
    },
    error: function (response) {
      alert(response["statusText"]);
    },
  });
}


/*     #############################################################################################    */


/*                               MAIN FUNCTIONS  SUBJECTIVE TEST                                      */


function loop2(data,str){
  var i;
  for (i = 0; i < data.length; i++) { 
   
    var ansid="question-sub"+data[i]['qid'];
          $(str).append(
                `<li class="list-group-item" id="${data[i]['qid']}"><h3>${data[i]['question']}&nbsp;[5 marks]<h3>
                <p>
                <p class="text-muted">Type in your answer in the text box provided below.</p>
                <textarea id='${ansid}' name='${ansid}' class="form-control" rows="6" placeholder='Your answer'></textarea>
                </li><br/>`
                );
          }
  
}

function getSubectiveQuestions(url){
    console.log(url);
    startTimer();
    document.getElementById('submitbtn').style.display="block";
    var token = "Token ";
    var token1 = sessionStorage.getItem("auth");
    var authorization = token.concat(token1);
    $.ajax({
      type: "GET",
      url: url,
      headers: { Authorization: authorization },
      success: function (data) {
        console.log(data);
        loop2(data,'#questions');
       // storeAnswers(data);
      //  startTimer();
        //document.getElementById('submitbtn').style.display="block";
      },
      error: function (response) {
        alert(response["statusText"]);
      },
    });
}

function storeSubAnswers(){

}

function evaluate2(){
  clearInterval(interval);
  document.getElementById('submitbtn').disabled=true;
  var answersList=$("#myForm").serializeArray();
  console.log(answersList);

  var subid=parseInt(localStorage.getItem('subjectId'));
  var qid = [];
  var answers = [];
  var i=0;
  for(;i<answersList.length;i++){
    var q=(answersList[i]['name'].substring(12));
    qid.push(parseInt(q));
    answers.push(answersList[i]["value"]);
  }

  var body={'subjectId':subid,'answers':answers,'q':qid};
  console.log(body);

  var token = "Token ";
  var token1 = sessionStorage.getItem("auth");
  var authorization = token.concat(token1);

  var url="http://127.0.0.1:8000/subjective_score/";
  //var body={};
  $.ajax({
    type: "POST",
    url: url,
    data:body,
    headers: { Authorization: authorization },
    success: function (data) {
     console.log(data);
     
     // document.getElementById('submitbtn').style.display="block";
    },
    error: function (response) {
      alert(response["statusText"]);
    },
  });

}



function sendgetExamScore(){

}