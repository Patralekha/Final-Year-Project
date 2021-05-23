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


   
  /*                               MCQ AND SUBJECTTIVE TEST                     */



  function getSubject(id){
    var token = "Token ";
  var token1 = sessionStorage.getItem("auth");
  var authorization = token.concat(token1);
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:8000/"+id+"/getSubject/",
      headers: { Authorization: authorization },
      success: function (data) {
        //subject=data['subject'];
        localStorage.setItem("subject",data['subject']);
      },
      error: function (response) {
        alert(response["statusText"]);
      },
    });
    //return subject;
  }
  
  function mcqtest(subject_id){
     getSubject(subject_id);
     localStorage.setItem("testType","mcq");
     localStorage.setItem("subjectId",subject_id);
   //  localStorage.removeItem("subject");
   //  localStorage.setItem("subject",k);
   //  console.log(localStorage.getItem('subject'));
     window.location.href="test.html";
  }
  

  function subtest(subject_id){
    getSubject(subject_id);
    localStorage.setItem("testType","subjective");
    localStorage.setItem("subjectId",subject_id);
   // localStorage.removeItem("subject");
  //  localStorage.setItem("subject",k);
   // localStorage.setItem("subject",subj);
    window.location.href="test.html";
 }
 


 function report(subject_id){
  getSubject(subject_id);
  localStorage.setItem("subjectId",subject_id);
  //localStorage.setItem("subject",subject);
  //localStorage.setItem("subject",subj);
  window.location.href="report.html";
}


/*                     MAIN FUNCTIONS                  */

function loop1(data,str){
  var i;
  for (i = 0; i < data.length; i++) { 
    var id='sub'+data[i]['sub_id'];
    var sub=""+data[i]['subject'];
    console.log(sub);
          $(str).append(
                `<li class="list-group-item" id="${id}"><h3>${sub}&nbsp;<h3>
                <a class="btn btn-info" type="button" onclick="mcqtest(${data[i]['sub_id']})">Take Objective Test</a>
                <button class="btn btn-danger" type="button" onclick="subtest(${data[i]['sub_id']})">Take Subjective Test</button>
                <button class="btn btn-success" type="button" onclick="report(${data[i]['sub_id']})">Report</button>
                <p><br/><b>Topics</b></p>
                </li>          
                <br/>`
                );
          }
  
}



$(document).ready(function () {

  //populate subject and topic list in page
  //populate subject list in addtopics modal
  var token = "Token ";
  var token1 = sessionStorage.getItem("auth");
  var authorization = token.concat(token1);
  var subjects=0;
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/allSubjects/",
    headers: { Authorization: authorization },
    success: function (data) {
      console.log(data);
      //loop(data,'#subselect');
      loop1(data,'#subtop');
      call();
    },
    error: function (response) {
      alert(response["statusText"]);
    },
  });
  
  });
  
  
  
  function call(){
    var token = "Token ";
    var token1 = sessionStorage.getItem("auth");
    var authorization = token.concat(token1);
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:8000/allTopics/",
      headers: { Authorization: authorization },
      success: function (data) {
        console.log(data);
        var i;
        for (i = 0; i < data.length; i++) { 
          var str='#sub'+data[i]['subject_id'];
          $(str).append(
            `
            <li class="list-group-item" id="" style='height:50px;align-items:center'>${data[i]['topic']}
              <!--span class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:70%">
            70% Complete
             </span-->
            </li><br/>`
            );
         }
      
        
      },
      error: function (response) {
        alert(response["statusText"]);
      },
    });
  }
  
  
 