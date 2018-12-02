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
    var width = 120,
      height = 320,
      allDates = unpack(rows, "date"),
      allCases = unpack(rows, "cases"),
      allDeaths = unpack(rows, "deaths"),
      allTemps = unpack(rows, "temp"),
      allRain = unpack(rows, "rainfall"),
      allHumid = unpack(rows, "humidity"),
      months = [
        "January",
        "Feburary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        " November",
        "December"
      ],
      listofYears = [],
      legendVals = [],
      currentDate = [],
      currentCases = [],
      currentDeaths = [],
      currentTemps = [],
      currentRain = [],
      currentHumid = [],
      svgLegend3 = null;

    listofYears.push("All");

    //getting list of years from data
    for (var i = 0; i < allDates.length; i++) {
      var year = allDates[i];
      var sub = year.toString().slice(0, 4);
      if (listofYears.indexOf(sub) === -1) {
        listofYears.push(sub);
        legendVals.push(sub);
      }
    }

    //getting data associated with that year
    function getYearData(chosenYear) {
      numYear = parseInt(chosenYear, 10);

      //displays all data
      if (chosenYear === "All") {
        for (var i = 0; i < allDates.length; i++) {
          currentDate.push(allDates[i]);
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
    function init(svgLegend3) {
      svgLegned3 = d3
        .select(".legend3")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      setParallelCoords("All");
      setLegend("All", months, legendVals);
    }
    init(svgLegend3);

    function setParallelCoords(chosenYear) {
      getYearData(chosenYear);

      //title
      var titleStr;
      if (chosenYear === "All") {
        titleStr =
          "Comparing Weather and Dengue Fever Death Cases in Dhaka from " +
          listofYears[1] +
          " - " +
          listofYears[listofYears.length - 1];
      } else {
        titleStr =
          "Comparing Weather and Dengue Fever Death Cases in Dhaka for " +
          chosenYear;
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
              // labelfont: family("Lato"),
              label: "Temperture",
              values: currentTemps

            },
            {
              range: [
                Math.min.apply(Math, currentRain),
                Math.max.apply(Math, currentRain)
              ],
              label: "Rainfall",
              values: currentRain
            },
            {
              label: "Humidity",
              range: [
                Math.round(Math.min.apply(Math, currentHumid)),
                Math.round(Math.max.apply(Math, currentHumid))
              ],
              values: currentHumid
            },
            {
              label: "Deaths",
              range: (Math.round(Math.min(currentDeaths)),
              Math.round(Math.max(currentDeaths))),
              values: currentDeaths
            },
            {
              label: "Cases",
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
      Plotly.newPlot("parCoordsContain", data, layout);
    }

    //Dropdown Menu
    var yearSelector = document.querySelector(".yeardata");

    function assignOptions(textArray, selector) {
      for (var i = 0; i < textArray.length; i++) {
        var currentOption = document.createElement("option");
        currentOption.text = textArray[i];
        selector.appendChild(currentOption);
      }
    }
    assignOptions(listofYears, yearSelector);

    //legend
    function setLegend(chosenYear, months, legendVals) {
      //color
      var color = d3.scaleSequential(d3.interpolateGreens);

      //legendText
      var legendText;
      if (chosenYear === "All") {
        //all years
        legendText = d3.scale.ordinal().domain(legendVals);
      } else {
        //selected year
        legendText = d3.scale.ordinal().domain(months);
      }

      //declaring legend
      var legend3 = svgLegned3
        .selectAll(".legend3")
        .data(legendText.domain())
        .enter()
        .append("g")
        .attr("class", "gElements")
        .attr("transform", function(d, i) {
          {
            return "translate(0," + i * 20 + ")";
          }
        });

      legend3
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d, i) {
          return color(((i + 1) / (legendVals.length - 2)) * 1.05);
        });

      legend3
        .append("text")
        .attr("x", 20)
        .attr("y", 10)
        .text(function(d, i) {
          return d;
        })
        .attr("class", "textselected")
        .style("text-anchor", "start")
        .style("font-size", 15);
    }


    function clearLegend(){
      var elements = document.getElementsByClassName("gElements");
      while(elements.length > 0){
          elements[0].parentNode.removeChild(elements[0]);
      }
  }

    //updates graph
    function updateGraph() {
      clearLegend();
      setParallelCoords(yearSelector.value);
      setLegend(yearSelector.value, months, legendVals);
    }

    yearSelector.addEventListener("change", updateGraph, false);
  }
);
