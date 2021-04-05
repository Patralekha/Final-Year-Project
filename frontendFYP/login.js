var auth_token;
  $(document).ready(function () {
    $("#registerForm").submit(function (event) {
      /* stop form from submitting normally */
      event.preventDefault();
      var name = $("input[name=rname]").val();
      var email = $("input[name=remail]").val();
      var pass1 = $("input[name=rpassword]").val();
      var pass2 = $("input[name=rpassword1]").val();
     
      if (pass1 != pass2) {
        alert("Passwords do not match");
        //document.getElementsByName("filterByDateForm")[0].reset();
      } else {
        
        document.getElementsByName("registerForm")[0].reset();
        fetch(
          "http://127.0.0.1:8000/register/",
          {
            method: "POST",
            body: JSON.stringify({
              name: name,
              email: email,
              password:pass1,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        )
          .then(function (response) {
            console.log(response);
            if (!response.ok) {
              alert(response.statusText);
              document.getElementById("failure").innerHTML="Try registering againg later!";
              return {};
            }
            return response.json();
          })
          .then(function (responseData) {
            if (responseData.length == 0) {
              console.log("Bad response from server.");
              document.getElementById("failure").innerHTML="Try registering againg later!";
            } else {
                console.log(responseData);
                document.getElementById("success").innerHTML="Successfully registered!";
               
            }
          });
      }
    });
  });



  $(document).ready(function () {
    $("#loginForm").submit(function (event) {
      /* stop form from submitting normally */
      event.preventDefault();
      
      var email = $("input[name=email]").val();
      var pass = $("input[name=psw]").val();
      var ts = $("input[type='radio'][name='re']:checked").val();

      console.log(ts);
      
     
    
        
        document.getElementsByName("loginForm")[0].reset();
        fetch(
          "http://127.0.0.1:8000/login/",
          {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password:pass,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        )
          .then(function (response) {
            console.log(response);
            if (!response.ok) {
              alert(response.statusText);
              document.getElementById("failure").innerHTML=response.statusText;
              console.log(response.json());
              return null;
            }else{
            return response.json();}
          })
          .then(function (responseData) {
            if (responseData == null) {
              console.log("Bad response from server.");
              document.getElementById("failure").innerHTML="Try logging in again later!";
            } else {
                console.log(responseData);
                //set name ,adminPrivilege  in windows.sessionStorage()
                auth_token = responseData["auth_token"];
                sessionStorage.setItem('auth',auth_token);
                sessionStorage.setItem('name',responseData['name']);
                sessionStorage.setItem('adminPrivilege',responseData['adminPrivilege']);
               window.location.href="index.html";
            }
          });
      
    });
  });



var allRadios = document.getElementsByName('re');
var booRadio;
var x = 0;
for(x = 0; x < allRadios.length; x++){

        allRadios[x].onclick = function(){

            if(booRadio == this){
                this.checked = false;
        booRadio = null;
            }else{
            booRadio = this;
        }
        };

}


/*     ADD EMAIL AND PASSWORD VALIDATIONS    */