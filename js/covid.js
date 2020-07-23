
function selectAllCounties() {
  var elements = document.querySelectorAll('.counties input');
  for (var i=0; i<elements.length;i++) {
    elements[i].checked = true;
  }
  draw();
}

function unselectAllCounties() {
  var elements = document.querySelectorAll('.counties input');
  for (var i=0; i<elements.length;i++) {
    elements[i].checked = false;
  }
  draw();
}
function draw() {
  var dateControl = document.querySelector('input[type="date"]');
  var startdate = dateControl.value;
  
  document.getElementById('canvas-parent').innerHTML ='';
  document.getElementById('canvas-parent').innerHTML ='<canvas id="chartJSContainer"></canvas>';
  fetch(
    //"http://localhost:8080/http://dph.illinois.gov/sitefiles/COVIDHistoricalTestResults.json?nocache=1"
    "/resources/covid_data.json"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
    
      var soillcounties = [
        //"Franklin",
        //"Hamilton",
        //"Union",
        //"Johnson",
        //"Pulaski",
        //"Williamson",
        //"Saline",
        //"Hardin",
        //"Pope",
        //"White",
        //"Perry",
        //"Massac",
        //"Gallatin",
        //"Randolph",
        //"Jefferson",
        //"Jackson",
        //"Alexander"
        //"St. Clair",
        //"Monroe",
        //"Washington",
        //"Madison",
        // "Bond",
        // "Clinton",
        //"Marion",
        //"Wayne",
        //"Edwards",
        //"Wabash"
      ];

      var elements = document.querySelectorAll(".counties input:checked");
      for (var i=0; i<elements.length;i++) {
        soillcounties.push(elements[i].id);
      }

    
    
      /*single County Use */
      //soillcounties = ["Jackson"];
      /*  single county use */
      var historicalData = data.historical_county.values.reverse();
      var newCaseData = [];
      var cumCaseData = [];
      var newDeathData = [];
      var newDailyData = [];
      var cumDeathDataArr = [];
      var labelData = [];
      var dailytested = [];
      for (var i = 0; i < historicalData.length; i++) {
        var totalSOILLCountForDate = 0;
        var cumdeathdata = 0;
        var caseCount = 0;
        var totalCaseCount = 0;
        var dailytesteddata = 0;
        for (var j = 0; j < historicalData[i].values.length; j++) {
          if (soillcounties.includes(historicalData[i].values[j].County)) {
            if (i > 0) {
              historicalData[i].values[j].dailydeaths =
                historicalData[i].values[j].deaths -
                findCountByCountyName(
                  historicalData[i].values[j].County,
                  historicalData[i - 1].values
                );
              historicalData[i].values[j].dailycases =
                historicalData[i].values[j].confirmed_cases -
                findCountByCountyNameCases(
                  historicalData[i].values[j].County,
                  historicalData[i - 1].values
                );
              historicalData[i].values[j].dailytests =
                historicalData[i].values[j].total_tested -
                findCountByCountyNameTested(
                  historicalData[i].values[j].County,
                  historicalData[i - 1].values
                );
            } else {
              historicalData[i].values[j].dailydeaths =
                historicalData[i].values[j].deaths;
              historicalData[i].values[j].dailycases =
                historicalData[i].values[j].confirmed_cases;
              historicalData[i].values[j].dailytests =
                historicalData[i].values[j].total_tested;
            }
            totalSOILLCountForDate += historicalData[i].values[j].dailydeaths;
            cumdeathdata += historicalData[i].values[j].deaths;
            totalCaseCount += historicalData[i].values[j].confirmed_cases;
            caseCount += historicalData[i].values[j].dailycases;
            dailytesteddata += historicalData[i].values[j].dailytests;
          }
        }
        if (startdate == undefined || startdate == '') {
            datetypestartdate = new Date('6/1/2020');
            dateControl.value = '2020-06-01';
        } else {
          datetypestartdate = new Date(startdate);
        }
        if (new Date(historicalData[i].testDate).getTime() > datetypestartdate.getTime()) {
          newDeathData.push(totalSOILLCountForDate);
          cumDeathDataArr.push(cumdeathdata);
          newCaseData.push(caseCount);
          cumCaseData.push(totalCaseCount);
          dailytested.push(dailytesteddata);
          labelData.push(historicalData[i].testDate);
        }
      }

      var newDeathDataSet = {
        label: "# of Deaths Per Day",
        data: newDeathData,
        backgroundColor:'red'
      };

      var cumDeathDataSet = {
        label: "# of Total Deaths",
        data: cumDeathDataArr,
        backgroundColor:'pink'
      };

      var cumCaseDataSet = {
        label: "# of Total Cases",
        data: cumCaseData,
        backgroundColor:'blue'
      };
      var dailyCaseDataSet = {
        label: "# of Daily Cases",
        data: newCaseData,
        backgroundColor:'green'
      };
    
      
    
      var dailyTestDataSet = {
        label: "# of Daily Tests",
        data: dailytested,
        backgroundColor:'yellow'
      };
    
    
      var dailytpr = [];

      for (var i = 0; i < newCaseData.length; i++) {
        if (dailytested[i - 6] != 0) {
          var dailytprdata =
            ((newCaseData[i] / dailytested[i]) * 100 +
              (newCaseData[i - 1] / dailytested[i - 1]) * 100 +
              (newCaseData[i - 2] / dailytested[i - 2]) * 100 +
              (newCaseData[i - 3] / dailytested[i - 3]) * 100 +
              (newCaseData[i - 4] / dailytested[i - 4]) * 100 +
              (newCaseData[i - 5] / dailytested[i - 5]) * 100 +
              (newCaseData[i - 6] / dailytested[i - 6]) * 100) /
            7;
        } else {
          var dailytprdata = 0;
        }
        //alert(dailytprdata)
        dailytprfixed = dailytprdata.toFixed(2);
        dailytpr.push(dailytprfixed);
      }
      //alert(dailytprfixed)
      
      var dailyTPRDataSet = {
        label: "Average 7 day Daily Test Positivity Rate",
        data: dailytpr,
        backgroundColor:'orange'
      };

    var sevendaytestdata = [];
    for (var i = 0; i < dailytested.length; i++) {
        if (dailytested[i - 6] != 0) {
          var sevendaytested =
            (dailytested[i] +
              (dailytested[i - 1])  +
              (dailytested[i - 2])  +
              (dailytested[i - 3])  +
              (dailytested[i - 4])  +
              (dailytested[i - 5])  +
              (dailytested[i - 6]) ) /  7;
        } else {
          var sevendaytested = 0;
        }
        //alert(dailytprdata)
        sevendaytestedfixed = sevendaytested.toFixed(2);
        sevendaytestdata.push(sevendaytestedfixed);
      }
    
      var sevendaydailyTestDataSet = {
        label: "# of 7 Day averaged Daily Tests",
        data: sevendaytestdata,
        backgroundColor:'grey'
      };
    
    var population = 56000;
    var testedperpopulationData = [];
    for (var i = 0; i < dailytested.length; i++) {
        if (dailytested[i - 6] != 0) {
          var testedperpopulation = 
           ((((dailytested[i]   +
              dailytested[i - 1]   +
              dailytested[i - 2]    +
              dailytested[i - 3]    +
              dailytested[i - 4]   +
              dailytested[i - 5]    +
              dailytested[i - 6]) / 7) / population) * 800) ;
          
        } else {
          var testedperpopulation = 0;
        }
        //alert(dailytprdata)
        testedperpopulationfixed = testedperpopulation.toFixed(2);
        testedperpopulationData.push(testedperpopulationfixed);
      }
        
      var testedperpopulationDataSet = {
        label: "Tested Per Population 7 Day averaged Daily Tests",
        data: testedperpopulationData,
        backgroundColor:'black'
      };
    
    
    var sevendaycasedata = [];
    for (var i = 0; i < newCaseData.length; i++) {
        if (newCaseData[i - 6] != 0) {
          var sevendaycases =
            (newCaseData[i] +
              (newCaseData[i - 1])  +
              (newCaseData[i - 2])  +
              (newCaseData[i - 3])  +
              (newCaseData[i - 4])  +
              (newCaseData[i - 5])  +
              (newCaseData[i - 6]) ) /  7;
        } else {
          var sevendaycases = 0;
        }
        //alert(dailytprdata)
        sevendaycasesfixed = sevendaycases.toFixed(2);
        sevendaycasedata.push(sevendaycasesfixed);
      }
    
      var sevendaydailyCaseDataSet = {
        label: "# of 7 Day averaged Daily Cases",
        data: sevendaycasedata
      };
      var datasets = [];

      if (document.getElementById('cumDeathDataSet').checked) {
        datasets.push(cumDeathDataSet);
      }
      if (document.getElementById('newDeathDataSet').checked) {
        datasets.push(newDeathDataSet)
      }
      if (document.getElementById('cumCaseDataSet').checked) {
        datasets.push(cumCaseDataSet)
      }
      if (document.getElementById('dailyCaseDataSet').checked) {
        datasets.push(dailyCaseDataSet)
      }
      if (document.getElementById('sevendaydailyCaseDataSet').checked) {
        datasets.push(sevendaydailyCaseDataSet);
      }
      //if (document.getElementById('dailyTestDataSet').checked) {
       // datasets.push(dailyTestDataSet);
      //}
      if (document.getElementById('dailyTPRDataSet').checked) {
        datasets.push(dailyTPRDataSet);
      }
      if (document.getElementById('sevendaydailyTestDataSet').checked) {
        datasets.push(sevendaydailyTestDataSet);
      }      
      
      
      
      //datasets.push(testedperpopulationDataSet);
      var options = {
        type: "line",
        data: {
          labels: labelData,
          datasets: datasets
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  reverse: false
                }
              }
            ]
          }
        }
      };

      var ctx = document.getElementById("chartJSContainer").getContext("2d");
      new Chart(ctx, options);
    });
}
draw();

findCountByCountyName = function (name, arr) {
  for (var i = 0; arr.length; i++) {
    if (arr[i].County == name) {
      return arr[i].deaths;
    }
  }
};

findCountByCountyNameCases = function (name, arr) {
  for (var i = 0; arr.length; i++) {
    if (arr[i].County == name) {
      return arr[i].confirmed_cases;
    }
  }
};
findCountByCountyNameTested = function (name, arr) {
  for (var i = 0; arr.length; i++) {
    if (arr[i].County == name) {
      return arr[i].total_tested;
    }
  }
};
