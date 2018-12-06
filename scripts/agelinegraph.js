dataset = [];

Plotly.d3.csv(
  "Data/positiveagefreq.csv",

  function(d) {
    return {
      Freq: +d.Freq
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
      allAges = unpack(rows, "Freq"),
      listOfAges = [], 
      listOfFreqs = []; 

    //getting list of ages from data
    for (var i = 0; i < allAges.length; i++) {
        listOfFreqs[i].push(allAges[i]);
        listOfAges[i].push(i+1);     
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
        xmax = Math.round(datax[2]+(datax[2]-minTemp)/20);
        ymax = Math.round(datay[2]);
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
                range: [ymin, ymax],
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
  }
);

