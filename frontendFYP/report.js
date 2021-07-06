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

  
/* #############################################  MAIN FUNCTIONS ############################################  */
function load(){
    var url="http://127.0.0.1:8000/fetch_scores";
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
          //console.log(data);
          process(data);
        },
        error: function (response) {
          alert(response["statusText"]);
        },
      });
     
}


function process(data){
  var mscores=data['mscores'];
  var subscores=data['subscores'];
  console.log(mscores);
  console.log(subscores);
  var mdates=[];
  var score1=[];
  var sdates=[];
  var score2=[];
  var i;
  for(i=0;i<mscores.length;i++){
      mdates.push(mscores[i]['date']);
      score1.push(mscores[i]['score']);
  }

  for(i=0;i<subscores.length;i++){
    sdates.push(subscores[i]['date']);
    var score = 0.0;
    var j;
    for(j=0;j<subscores[i]['score'].length;j++){
        score+=subscores[i]['score'][j];
    }
    score2.push(score);
}

console.log(score2);
  var trace1 = {
    name:"MCQ scores",
    x: mdates,
    y: score1,
    type: 'scatter'
  };
  
  var trace2 = {
    name:"Subjective scores",
    x: sdates,
    y: score2,
    type: 'scatter'
  };
  
  var data1 = [trace1,trace2];

  var layout = {
    title: {
      text:'Score vs Examination date',
      font: {
        family: 'Courier New, monospace',
        size: 24
      },
      xref: 'paper',
      x: 0.05,
    },
    xaxis: {
      title: {
        text: 'x Axis',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },
    },
    yaxis: {
      title: {
        text: 'y Axis',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      }
    }
  };
 
  
  Plotly.newPlot('performance-graph1', data1, layout);
  var data = [{
    values: [19, 26, 55],
    labels: ['Optics', 'Non-Electromagnetism', 'Mechanics'],
    type: 'pie'
  }];
  
  var layout = {
    height: 400,
    width: 500
  };
  
  Plotly.newPlot('performance-graph-2', data, layout);
 
}