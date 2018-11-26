//https://plot.ly/javascript/dropdowns/
dataset = [];

Plotly.d3.csv(
  "Data/monthly_table.csv",

  function(d) {
    return {
      cases: +d.cases,
      date: +d.date,
      deaths: +d.deaths,
      humidity: +d.humidity,
      rainfall: +d.rainfall,
      temp: +d.temp
    };
  },

  function(err, rows) {
    dataset = rows;

    function unpack(rows, key) {
      return rows.map(function(row) {
        return row[key];
      });
    }

    //init variables
    var allDates = unpack(rows, "date"),
      allCases = unpack(rows, "cases"),
      allDeaths = unpack(rows, "deaths"),
      allTemps = unpack(rows, "temp"),
      allRain = unpack(rows, "rainfall"),
      allHumid = unpack(rows, "humidity"),
      listofYears = [],
      currentDate = [],
      currentCases = [],
      currentDeaths = [],
      currentTemps = [],
      currentRain = [],
      currentHumid = [];

    //getting list of years from data
    for (var i = 0; i < allDates.length; i++) {
      var year = allDates[i];
      var sub = year.toString().slice(0, 4);
      if (listofYears.indexOf(sub) === -1) {
        listofYears.push(sub);
      }
    }

    //getting data associated with that year
    function getYearData(chosenYear) {
      numYear = parseInt(chosenYear, 10);

      //displays all data
      if (numYear === 1) {
        for (var i = 0; i < allDates.length; i++) {
          currentCases.push(allCases[i]);
          currentDeaths.push(allDeaths[i]);
          currentTemps.push(allTemps[i]);
          currentRain.push(allRain[i]);
          currentHumid.push(allHumid[i]);
        }
        //selected data
      } else {
        numYear = numYear * 100;
        currentDate = [];
        currentDeaths = [];
        currentTemps = [];
        currentRain = [];
        currentHumid = [];
        for (var i = 0; i < allDates.length; i++) {
          if (allDates[i] > numYear && allDates[i] < numYear + 13) {
            currentDate.push(allDates[i]);
            currentCases.push(allCases[i]);
            currentDeaths.push(allDeaths[i]);
            currentTemps.push(allTemps[i]);
            currentRain.push(allRain[i]);
            currentHumid.push(allHumid[i]);
          }
        }
      }
    }

    //graphing all the data
    setParallelCoords("1");

    function setParallelCoords(chosenYear) {
      getYearData(chosenYear);

      //title
      var titleStr;
      var numYear = parseInt(chosenYear, 10);
      if(numYear === 1){
        titleStr = 'Comparing Weather and Dengue Fever Death Cases from ' + listofYears[0] + ' - ' + listofYears[listofYears.length - 1]; 
      } else {
        titleStr = 'Comparing Weather and Dengue Fever Death Cases for ' + chosenYear; 
      }

      var data = [
        {
          // Parallel coordinates
          type: "parcoords",
          pad: [80, 80, 80, 80],

          line: {
            color: currentDate,
            colorscale: "Greens"
          },

          dimensions: [
            {
              range: [
                Math.round(Math.min.apply(Math, currentTemps)),
                Math.round(Math.max.apply(Math, currentTemps))
              ],
              label: "temp",
              values: currentTemps
            },
            {
              range: [
                Math.min.apply(Math, currentRain),
                Math.max.apply(Math, currentRain)
              ],
              label: "rainfall",
              values: currentRain
            },
            {
              label: "humidity",
              range: [
                Math.round(Math.min.apply(Math, currentHumid)),
                Math.round(Math.max.apply(Math, currentHumid))
              ],
              values: currentHumid
            },
            {
              label: "deaths",
              range: (Math.round(Math.min(currentDeaths)),
              Math.round(Math.max(currentDeaths))),
              values: currentDeaths
            },
            {
              label: "cases",
              range: (Math.round(Math.min(currentCases)),
              Math.round(Math.max(currentCases))),
              values: currentCases
            }
          ]
        }
      ];
     
      var layout = {
        title: titleStr,
        width: 1200,
        height: 600
      };

      // GRAPHS DATA
      Plotly.newPlot("graphDiv", data, layout);
    }

    var yearSelector = document.querySelector(".yeardata");

    function assignOptions(textArray, selector) {
      for (var i = 0; i < textArray.length; i++) {
        var currentOption = document.createElement("option");
        currentOption.text = textArray[i];
        selector.appendChild(currentOption);
      }
    }
    assignOptions(listofYears, yearSelector);

    function updateGraph() {
      setParallelCoords(yearSelector.value);
    }

    yearSelector.addEventListener("change", updateGraph, false);
  }
);
