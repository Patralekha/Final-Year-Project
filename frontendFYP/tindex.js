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
      //sessionStorage.removeItem("name");
      //sessionStorage.removeItem("adminPrivilege");
      //sessionStorage.removeItem("auth", "");
      window.location.href = "login.html";
    },
    error: function (response) {
      alert(response["statusText"]);
    },
  });
}


/*                                    MAIN FUNCTIONS                                    */

function loop(data,str){
  var i;
  for (i = 0; i < data.length; i++) { 
          $(str).append(
                `<option>${data[i]['subject']}</option> `
                );
          }
  
}


function loop1(data,str){
  var i;
  for (i = 0; i < data.length; i++) { 
    var id='sub'+data[i]['sub_id'];
          $(str).append(
                `<li class="list-group-item" id="${id}"><h3>${data[i]['subject']}<h3></li><br/>`
                );
          }
  
}




$(document).ready(function () {

//populate subject and topic list in page
//populate subject list in addtopics modal
var subjects=0;
$.ajax({
  type: "GET",
  url: "http://127.0.0.1:8000/allSubjects/",
  success: function (data) {
    console.log(data);
    loop(data,'#subselect');
    loop1(data,'#subtop');
    call();
  },
  error: function (response) {
    alert(response["statusText"]);
  },
});

});



function call(){
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/allTopics/",
    success: function (data) {
      console.log(data);
      var i;
      for (i = 0; i < data.length; i++) { 
        var str='#sub'+data[i]['subject_id'];
        $(str).append(
          `<li class="list-group-item" id="" style='height:50px;align-items:center'>${data[i]['topic']}
          <a class="btn btn-success" style='float:right;' onclick="addQ1(${data[i]['topic_id']},${data[i]['subject_id']})" type="button">Add MCQ</a>
          <a class="btn btn-info" style='float:right;margin-right:2px;' onclick="addQ2(${data[i]['topic_id']},${data[i]['subject_id']})" type="button">Add Subjective Question</a>
          <br/>
          </li><br/>`
          );
       }
    
      
    },
    error: function (response) {
      alert(response["statusText"]);
    },
  });
}


function addQ1(topicid,subjectid){
  document.getElementById('my-modal').style.display='block';

  $("#addQ").submit(function (event) {
    event.preventDefault();      
  var q = document.getElementById('question').value;
  var o1 = $("input[name=opt1]").val();
  var o2 = $("input[name=opt2]").val();
  var o3 = $("input[name=opt3]").val();
  var o4 = $("input[name=opt4]").val();
  var ans = $("input[name=ans]").val();
  var level =document.querySelector('#level').value;
  var body={"subjectid":subjectid,"level":level,"topicid":topicid,"question":q,"o1":o1,"o2":o2,"o3":o3,"o4":o4,"ans":ans};
  console.log(body);
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8000/addQuestion/",
    data:body,
    success: function (data) {
     // location.reload();
    },
    error: function (response) {
      alert(response["statusText"]);
    },
  });
});


}
  



function addQ2(topicid,subjectid){
  document.getElementById('my-modal-sub').style.display='block';


  
  $("#addQSub").submit(function (event) {
    event.preventDefault();      
  var q = document.getElementById('question-sub').value;
  var ansKeys = document.getElementById('keywords').value;//.value.split(',');

 
  var level =document.querySelector('#level-sub').value;
  var body={"subjectid":subjectid,"level":level,"topicid":topicid,"question":q,"answer":ansKeys};
  console.log(body);

  
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8000/addQuestionSubjective/",
    data:body,
    success: function (data) {
     // location.reload();
    },
    error: function (response) {
      alert(response["statusText"]);
    },
  });
});


}
  







$(document).ready(function () {
    $("#addsub").submit(function (event) {
      /* stop form from submitting normally */
      event.preventDefault();      
      var sub = $("input[name=sub]").val();
      document.getElementsByName("addsub")[0].reset();
      var body={"subject":sub};
      
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8000/addSubject/",
        data:body,
        success: function (data) {
          location.reload();
        },
        error: function (response) {
          alert(response["statusText"]);
        },
      });


    });

});




$(document).ready(function () {
$("#addtopic").submit(function (event) {

    event.preventDefault();      
    var topic = $("input[name=topicadd]").val();
    var sub = document.querySelector('#subselect').value;
    console.log(sub);
    var body={"subject":sub,"topic":topic};
    console.log(body);
    document.getElementsByName("addtopic")[0].reset();
   $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8000/addTopic/",
        data:body,
        success: function (data) {
          location.reload();
        },
        error: function (response) {
          alert(response["statusText"]);
        },
      });

    });

});

