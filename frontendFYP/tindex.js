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
          $(str).append(
                `<option>${data[i]['subject']}</option> `
                );
          }
  
}

$(document).ready(function () {

//populate subject and topic list in page
//populate subject list in addtopics modal

$.ajax({
  type: "GET",
  url: "http://127.0.0.1:8000/allSubjects/",
  success: function (data) {
    console.log(data);
    loop(data,'#subselect');
  },
  error: function (response) {
    alert(response["statusText"]);
  },
});

});

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
        },
        error: function (response) {
          alert(response["statusText"]);
        },
      });

    });

});

