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
    var listofVs = ['Cases','Deaths','Temperature','Humidity','Rainfall']
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
      yearLabels = [],
      currentDate = [],
      currentCases = [],
      currentDeaths = [],
      currentTemps = [],
      currentRain = [],
      currentHumid = [],
      minTemp,
      maxTemp,
      minRain,
      maxRain,
      minHumid,
      maxHumid,
      minDeath,
      maxDeath,
      minCase,
      maxCase,
      svgLegend3 = null;
    listofYears.push("All");

    //getting list of years from data
    for (var i = 0; i < allDates.length; i++) {
      var year = allDates[i];
      var sub = year.toString().slice(0, 4);
      if (listofYears.indexOf(sub) === -1) {
        listofYears.push(sub);
        yearLabels.push(sub);
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
        currentCases = [];
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
      //set max & mins for ranges
      minTemp = Math.min.apply(null, currentTemps).toFixed(2);
      maxTemp = Math.max.apply(null, currentTemps).toFixed(2);
      minRain = Math.min.apply(null, currentRain);
      maxRain = Math.max.apply(null, currentRain);
      minHumid = Math.min.apply(null, currentHumid).toFixed(2);
      maxHumid = Math.max.apply(null, currentHumid).toFixed(2);
      minDeath = Math.min.apply(null, currentDeaths);
      maxDeath = Math.max.apply(null, currentDeaths);
      minCase = Number.parseFloat(Math.min.apply(null, currentCases));
      maxCase = Number.parseFloat(Math.max.apply(null, currentCases));
    }
    var yearSelector = document.querySelector(".yeardata");
    var v1Selector = document.querySelector(".v1");
    var v2Selector = document.querySelector(".v2");

    function assignOptions(textArray, selector) {
      for (var i = 0; i < textArray.length; i++) {
        var currentOption = document.createElement("option");
        currentOption.text = textArray[i];
        selector.appendChild(currentOption);
      }
    }

    //graphing all the data
    function init(svgLegend3) {
      svgLegned3 = d3
        .select(".legend3")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      assignOptions(listofYears, yearSelector);
      assignOptions(listofVs, v1Selector);
      assignOptions(listofVs, v2Selector);
      setParallelCoords("All");
      setLegend("All", months, yearLabels);
      setBottomStuff("All", 'Cases', 'Temperature');
    }

    init(svgLegend3);    
    function setBottomStuff() {
        setScatters(yearSelector.value, v1Selector.value, v2Selector.value);
        setLines(yearSelector.value, v1Selector.value, v2Selector.value);
    }
    function setScatters(chosenYear, t1, t2){

        datax = getNames(t1);
        datay = getNames(t2);
        console.log(datax)
        xtit = datax[0];
        ytit = datay[0];
        xmin = datax[1];
        ymin = datay[1];
        xmax = datax[2]+(datax[2]-minTemp)/20;
        ymax = datay[2]+(datay[2]-minCase)/20;
        xdat = datax[3];
        ydat = datay[3];

        var s1 = {
            x: xdat,
            y: ydat,
            mode: 'markers',
            type: 'scatter'
        };
        if(chosenYear != "All"){
            m_text = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                      'August', 'September', 'October', 'November', 'December']
            s1.text=m_text;
        }
        var layout = {
            title: 'Correlation',
            width: 400,
            height: 400,
            xaxis: {
                range: [xmin,xmax],
                title: xtit,
                tick0: xmin,

            },
            yaxis: {
                range: [ymin,ymax],
                title: ytit,
                tick0: ymin,

            }
        };
        data = [s1];
        Plotly.newPlot('corr', data, layout);
    }

    function setLines(chosenYear, y1, y2) {
        n = 0;
        m3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        xnums = [];
        xaxis = ''
        xts = [];
        xvs = []
        if(chosenYear != "All"){
            n = 12;
            xnums  = m3;
            xticks = xnums
            m_text = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                      'August', 'September', 'October', 'November', 'December'];
            xaxis  = 'Data from ' + chosenYear;
            xts = xnums
            xtv = xts
        } else {
            n = 192;
            xnums = [...Array(192).keys(0)];
            xts = [...Array(16).keys(0)];
            xtv = xts;
            xaxis = 'Data from all years';
            //xnums = ['Jan ','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var i;
            for (i = 0; i < 192; i++) {
              y = 2000+(Math.floor(i/12))
              m = m3[i % 12]
              xnums[i] = m + ' ' + y.toString();
            }
            for(i=0; i < 16; i++) {
              y = 2000 + i;
              xts[i] = 'Jan ' + y.toString()
              xtv = xts
            }
            console.log(xnums);
        }

        datax = getNames(y1);
        datay = getNames(y2);
        console.log(datax)
        xtit = datax[0];
        ytit = datay[0];
        xmin = datax[1];
        ymin = datay[1];
        xmax = Math.round(datax[2]+(datax[2]-xmin)/20);
        ymax = Math.round(datay[2]+(datay[2]-ymin)/20);
        xdat = datax[3];
        ydat = datay[3];
        var s1 = {
            x: xnums,
            y: xdat,
            type: 'scatter',
            name: xtit
        };
        var s2 = {
            x: xnums,
            y: ydat,
            type: 'scatter',
            name: ytit,
            yaxis: 'y2',
        };

        var layout = {
            title: 'Plotted over Time',
            width: 850,
            height: 400,
            xaxis: {
                title: xaxis,
                showticklabels: true,
                tickangle: 'auto',
                tickfont: {
                  size: 12,
                  color: 'black'
                },
                tickvals: xts,
                ticktext: xtv
            },
            yaxis: {
                range: [xmin,xmax+2],
                title: xtit,
            },
            yaxis2: {
                autotick: false,
                range: [ymin, ymax+2],
                title: ytit,
                overlaying: 'y',
                side: 'right',
                tick0: 0,
                dtick: ymax-ymin
            },
            legend: {
                x: 1.1,
                y: 0.95
            }
        };
        data = [s1, s2];
        Plotly.newPlot('line', data, layout);
    }

    function setParallelCoords(chosenYear) {
      getYearData(chosenYear);
      if (maxDeath == 0) {
        maxDeath = maxDeath + 1;
      }

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
              range: [minTemp, maxTemp],
              label: "Temperture",
              values: currentTemps
            },
            {
              range: [minRain, maxRain],
              label: "Rainfall",
              values: currentRain
            },
            {
              label: "Humidity",
              range: [minHumid, maxHumid],
              values: currentHumid
            },
            {
              label: "Deaths",
              range: [minDeath, maxDeath],
              values: currentDeaths
            },
            {
              label: "Cases",
              range: [minCase, maxCase],
              values: currentCases
            }
          ]
        }
      ];

      var layout = {
        title: titleStr,
        width: 750,
        height: 550
      };

      // GRAPHS DATA
      Plotly.newPlot("parCoordsContain", data, layout,{responsive: true});
    }

    //Year select menu


    //legend
    function setLegend(chosenYear, months, yearLabels) {
      //color
      var color = d3.scaleSequential(d3.interpolateGreens);

      //legendText
      var legendText;
      var colorRange;
      if (chosenYear === "All") {
        //all years
        legendText = d3.scale.ordinal().domain(yearLabels);
        colorRange = yearLabels.length;
      } else {
        //selected year
        legendText = d3.scale.ordinal().domain(months);
        colorRange = months.length;
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
        .style("fill", function (d, i) {
          return color((i +.5) / (colorRange));
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

    function clearLegend() {
      var elements = document.getElementsByClassName("gElements");
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    }

    //updates graph
    function updateGraph() {
      clearLegend();
      setParallelCoords(yearSelector.value);
      setLegend(yearSelector.value, months, yearLabels);
      setBottomStuff();
    }

    function getNames(name) {
        aname = '';
        amin  = 0;
        amax  = 0;
        dat   = [];
        if (name == 'Cases') {
            aname = 'Number of cases';
            dat = currentCases;
            amin = minCase;
            amax = maxCase;
        }else if (name == 'Temperature') {
            aname = 'Average Temperature';
            dat = currentTemps;
            amin = minTemp;
            amax = maxTemp;
        }else if (name == 'Humidity') {
            aname = 'Humidity';
            dat = currentHumid;
            amin = minHumid;
            amax = maxHumid;
        }else if (name == 'Rainfall') {
            aname = 'Total Monthly Rainfall';
            dat = currentRain;
            amin = minRain;
            amax = maxRain;
        }else if (name == 'Deaths') {
            aname = 'Number of Deaths';
            dat = currentDeaths;
            amin = minDeath;
            amax = maxDeath;
        } else {
            console.log('invalid type');
        }
        return [aname, amin, amax, dat];
    }
    yearSelector.addEventListener("change", updateGraph, false);
    v1Selector.addEventListener("change", setBottomStuff, false);
    v2Selector.addEventListener("change", setBottomStuff, false);
  }
);
