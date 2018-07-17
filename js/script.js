var pulseHigh = 200;
var pulseLow = -200;
var angleHigh = 1;
var angleLow = -1;
var myLineChart = null;
var func = 0;

function checkGraphParam(paramName){
  var allCookies = decodeURIComponent(document.cookie);
  var searchName = paramName+"="

  allCookies = allCookies.split(';')

  for (i = 0; i <allCookies.length; i++){
    if (allCookies[i].split("=")[0].replace(/\s+/, "") == paramName){
      return allCookies[i].split("=")[1]
    }
  }
}

function range(start, edge, step) {

  //Case for page load
  if  (start == 0 || stop == 0){
    return []
  }

  //Reversed start and stop..
  if (start > edge){
      tmp = start;
      start = edge;
      edge = tmp;
  }

  // Validate the edge and step numbers.
  edge = edge || 0;
  step = step || 1;
  edge = parseInt(edge);
  start = parseInt(start);

  // Create the array of numbers, stopping at the edge.
  for (var ret = []; 0 <= (edge - start) * step; start += step) {
    ret.push(start);
  }
  return ret;

}

//TODO: remove unused m param or implement...
function getOrderColor(m){
  return "rgba("+Math.floor((Math.random() * 255) + 1)+','+100+','+Math.floor((Math.random() * 255) + 1) +",1)"
}

function drawDiffractionChart() {

  var labels = [];
  var orders = [];
  var resMult = 4;

  if (myLineChart != null){
    myLineChart.destroy();
  }

  for (i = 0; i <=90*resMult; i++) {
    labels.push((i/resMult).toFixed(2))
  }

  var ctx = document.getElementById("myChart");

  oDMax = $('#ordersSelectMax').val();
  oDMin = $('#ordersSelectMin').val();
  orders = range(oDMin,oDMax,1);

  var wavelength = $('#wavelength').val();
  var lnMM =  $('#lnmm').val();
  var data = {
    labels: labels,
    datasets: [
    ],
  };

  //iterate over each selected order
  orders.forEach(function (element) {

    var calcd = [];
    var n = parseInt(element);

    for (var thetaStep=0; thetaStep <= 90*resMult; thetaStep++) {

      theta = thetaStep/resMult;

      if (1e6/(wavelength*lnMM) >= -n/2.0 && 1e6/(wavelength*lnMM) >= n){

        if (  n <= 0  && Math.sin(theta*Math.PI/180) + n * wavelength * lnMM * 1.0e-6 < n/Math.abs(n)){

          var calc = 1000*(n/Math.abs(n));

        } else if ( n > 0 && Math.sin(theta*Math.PI/180) + n * wavelength * lnMM * 1.0e-6 > n/Math.abs(n) ) {

          var calc = 1000*(n/Math.abs(n));

        } else {

          var calc = 180.0/Math.PI *Math.asin(Math.sin(theta*Math.PI/180.0)+n*wavelength*lnMM*1e-6) ;

        }

        //calcd.push(calc);
        calcd.push({
          x: theta,
          y: calc,
        })

      }

    }

    if (calcd.length > 0){
      COLOR = getOrderColor(0);
      data.datasets.push(
      {
        label: "Order " + element,
        fill: false,
        lineTension: 0,
        backgroundColor: COLOR,
        borderColor: COLOR,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        pointBorderWidth: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 0.0000000001,
        pointHitRadius: 10,
        data: calcd,
        spanGaps: false,
      });
    }

  });

  myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    responsive: true,
    options: {
      elements: {
        point: {
          radius:0
        }
      },
      animation: {
        duration: 0
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Angle of Diffraction, θm (deg)'
          },
          ticks: {
            beginAtZero:true,
            min: -90,
            max: 90,
            stepSize: 10,
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Angle of Incidence, θ (deg)'
          },
          type: 'linear',
          position: 'bottom',
          ticks: {
            min: 0,
            max: 90,
          }
        }]
      },
      title: {
        display: true,
        text: 'Angle of Diffraction vs. Angle of Incidence'
      },
      legend: {
        display: true,
        position: 'right',
        labels: {
          boxWidth: 10,
          fontSize: 10,
          padding: 5,
        }
      }
    }
  });
}

function drawAngularDispersionChart() {

  var labels = [];
  var orders = [];
  var resMult = 3;

  if (myLineChart != null){
    myLineChart.destroy();
  }

  for (i = 0; i <= 90*resMult; i++) {
    labels.push((i/resMult).toFixed(2))
  }

  var ctx = document.getElementById("myChart");

  oDMax = $('#ordersSelectMax').val();
  oDMin = $('#ordersSelectMin').val();
  orders = range(oDMin,oDMax,1);

  var wavelength = $('#wavelength').val();
  var lnMM =  $('#lnmm').val();
  var data = {
    labels: labels,
    datasets: [],
  };

  //iterate over each selected order
  orders.forEach(function (element) {

    var calcd = [];
    var n = parseInt(element);

    for (var thetaStep=0; thetaStep <= 90*resMult; thetaStep++) {

      theta = thetaStep/resMult;

      if (1e6/(wavelength*lnMM) >= -n/2.0 && 1e6/(wavelength*lnMM) >= n) {

        if (  n <= 0  && Math.sin(theta*Math.PI/180) + n * wavelength * lnMM * 1.0e-6 < n/Math.abs(n)) {

          var calc = 1000*(n/Math.abs(n));

        } else if ( n > 0 && Math.sin(theta*Math.PI/180) + n * wavelength * lnMM * 1.0e-6 > n/Math.abs(n) ) {

            var calc = 1000*(n/Math.abs(n));

        } else {

          var calc = n * lnMM * 1e-6 * (180.0 / Math.PI)  / Math.sqrt( (1 - Math.pow(Math.sin(theta*Math.PI/180.0)+n*wavelength*lnMM*1e-6,2) )) ;

        }

        calcd.push({x:theta,y:calc});

      }

    }

    if (calcd.length > 0){
      COLOR = getOrderColor(0);
      data.datasets.push(
      {
        label: "Order " + element,
        fill: false,
        lineTension: 0.0000000000000000001,
        backgroundColor: COLOR,
        borderColor: COLOR,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        pointBorderWidth: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 0.0000000001,
        pointHitRadius: 10,
        data: calcd,
        spanGaps: false,
      });
    }

  });

  myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    responsive: true,
    maintainAspectRatio: false,
    options: {
      elements: {
        point: {
          radius:0
        }
      },
      animation: {
        duration: 0
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Angular Dispersion, dθm/dλ (deg/nm)'
          },
          ticks: {
            beginAtZero:true,
            min: angleLow,
            max: angleHigh
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Angle of Incidence, θ (deg)'
          },
          type: 'linear',
          position: 'bottom',
          ticks: {
            min: 0,
            max: 90,
          }
        }]
      },
      title: {
        display: true,
        text: 'Angular Dispersion vs. Angle of Incidence'
      },
      legend: {
        display: true,
        position: 'right',
        labels: {
          boxWidth: 10,
          fontSize: 10,
          padding: 5,
        }
      }

    }
  });
}

function drawPulseDispersionChart() {

  var labels = [];
  var orders = [];
  var resMult = 4;

  if (myLineChart != null) {
    myLineChart.destroy();
  }

  for (i = 0; i <= 90*resMult; i++) {
    labels.push((i/resMult).toFixed(2));
  }

  var ctx = document.getElementById("myChart");

  oDMax = $('#ordersSelectMax').val();
  oDMin = $('#ordersSelectMin').val();
  orders = range(oDMin,oDMax,1);

  var wavelength = $('#wavelength').val();
  var lnMM =  $('#lnmm').val();
  var data = {
    labels: labels,
    datasets: [],
  };

  //iterate over each selected order
  orders.forEach(function (element) {

    var calcd = [];
    var n = parseInt(element);

    for (var thetaStep=0; thetaStep <= 90*resMult; thetaStep++) {

      theta = thetaStep/resMult;

      if (1e6/(wavelength*lnMM) >= -n/2.0 && 1e6/(wavelength*lnMM) >= n) {

        if (  n <= 0  && Math.sin(theta*Math.PI/180) + n * wavelength * lnMM * 1.0e-6 < n/Math.abs(n)) {

          var calc = 1000*(n/Math.abs(n));

        } else if ( n > 0 && Math.sin(theta*Math.PI/180) + n * wavelength * lnMM * 1.0e-6 > n/Math.abs(n) ) {

          var calc = 1000*(n/Math.abs(n));
              
        } else {

          var calc = 1e12*Math.pow(n,2)*wavelength*Math.pow(lnMM*1e-6,2) / ( 3e8 *Math.pow(Math.cos(Math.asin( Math.sin(theta*Math.PI/180)+n*wavelength*lnMM*1e-6 )),3 ) ) ;

        }

        calcd.push({x:theta,y:calc});

      }

    }

    if (calcd.length > 0){
      COLOR = getOrderColor(0);
      data.datasets.push(
      {
        label: "Order " + element,
        fill: false,
        lineTension: 0.0000000000000000001,
        backgroundColor: COLOR,
        borderColor: COLOR,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        pointBorderWidth: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 0.0000000001,
        pointHitRadius: 10,
        data: calcd,
        spanGaps: false,
      });
    }

  });

  myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    responsive: true,
    options: {
      elements: {
        point: {
          radius:0
        }
      },
      animation: {
        duration: 0
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Temporal Dispersion (1/s)dτ/dλ (ps/nm per meter)'
          },
          ticks: {
            beginAtZero:true,
            min: pulseLow,
            max: pulseHigh
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Angle of Incidence, θ (deg)'
          },
          type: 'linear',
          position: 'bottom',
          ticks: {
            min: 0,
            max: 90,
          }
        }]
      },
      title: {
        display: true,
        text: 'Pulse Dispersion vs. Angle of Incidence'
      },
      legend: {
        display: true,
        position: 'right',
        labels: {
          boxWidth: 10,
          fontSize: 10,
          padding: 5,
        }
      }
    }
  });
}

function validateInput(input, old) {
  if (input == 0){
    return input
  }
  else return input || old
}

$('#axisSetButton').click(function(ev){

  console.log(checkGraphParam("testabsdafsdfas"));
  console.log(func);

  if (func == 1){
    pulseHigh = validateInput(parseFloat(window.prompt("Enter new Pulse Dispersion Y High",pulseHigh)),pulseHigh);
    pulseLow = validateInput(parseFloat(window.prompt("Enter new Pulse Dispersion Y Low",pulseLow)),pulseLow);

    while (pulseHigh <= pulseLow) {
      pulseLow = validateInput(parseFloat(window.prompt("Enter new Angular Dispersion Y High (must be less then "+pulseLow+")",pulseHigh)),pulseLow);
    }

    drawPulseDispersionChart();
  } else if (func == 2) {

      angleHigh = validateInput(parseFloat(window.prompt("Enter new Angular Dispersion Y High",angleHigh)),angleHigh);

      angleLow = validateInput(parseFloat(window.prompt("Enter new Angular Dispersion Y Low",angleLow)),angleLow);

      while (angleHigh <= angleLow) {
        angleLow = validateInput(parseFloat(window.prompt("Enter new Angular Dispersion Y High (must be less then "+angleHigh+")",angleLow)),angleLow);
      }

      drawAngularDispersionChart();
  }

});

$('#submit-calc').submit(function(ev) {

  ev.preventDefault();

  /* Validations go here */
  var orders = $('#ordersSelect').val();
  var wavelength = $('#wavelength').val();
  var lnmm = $('#lnmm').val();

  if (wavelength > 0 && lnmm > 0 ) {
    if (func == 0){
      drawDiffractionChart();
    }
    else if (func == 1){
      drawPulseDispersionChart();
    }
    else if (func == 2){
      drawAngularDispersionChart();
    }
  } else if (wavelength <= 0 && lnmm <= 0) {
    alert("Wavelength and Period must be greater than zero");
  } else if (orders.length ==  0) {
    alert("Please select at least one order to plot");
  } else {
    alert("Please fill in all values and select an order to plot");
  }

});

$('#myChart').ready(function(){
  drawDiffractionChart();
});

$('#diffractionLink').click(function () {
  $('#calcSelect').children().children().removeClass('active');
  $(this).addClass('active');
  $('#axisSetButton').prop('disabled', true);
  $('#calcType').text('Angle Calculator');
  drawDiffractionChart();
  func = 0;
});

$('#pulseLink').click(function () {
  $('#calcSelect').children().children().removeClass('active');
  $(this).addClass('active');
  $('#axisSetButton').prop('disabled', false);
  $('#calcType').text('Pulse Dispersion Calculator');
  drawPulseDispersionChart();
  func = 1;
});

$('#angularLink').click(function () {
  $('#calcSelect').children().children().removeClass('active');
  $(this).addClass('active');
  $('#axisSetButton').prop('disabled', false);
  $('#calcType').text('Angular Dispersion Calculator');
  drawAngularDispersionChart();
  func = 2;
});