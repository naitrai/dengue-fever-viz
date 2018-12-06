dataset = [];

Plotly.d3.csv(
    "Data/positiveagefreq.csv",

    function (d) {
        return {
            Freq: +d.Freq
        };
    },

    function (err, rows) {
        dataset = rows;

        function unpack(rows, key) {
            return rows.map(function (row) {
                return row[key];
            });
        }

        //init variables
        var allAges = unpack(rows, "Freq"),
            listOfAges = [],
            listOfFreqs = [];
        var count = 0;
        //getting list of ages from data
        for (var i = 0; i < allAges.length; i++) {
            if (allAges[i] != null){
                listOfFreqs.push(allAges[i]);
                listOfAges.push(i+1);
            }
        }

        console.log(listOfAges.length);

        function setLines(listOfAges, listOfFreqs) {
           var xmin =  Math.min.apply(null, listOfAges);
           var ymin =  Math.min.apply(null, listOfFreqs);
           var xmax =  Math.max.apply(null, listOfAges);
           var ymax =  Math.max.apply(null, listOfFreqs);
           
            var line = {
                type: 'scatter',
                x: listOfAges,
                y: listOfFreqs,
                mode: 'lines',
                name: 'Red',
                line: {
                    color: 'rgb(219, 64, 82)',
                    width: 3
                }
            }
            var layout = {
                title: 'Age Frequency Line Chart',
                width: 800,
                height: 400,
                xaxis: {
                    range: [xmin, xmax],
                    title: "Ages",
                    tick0: xmin,

                },
                yaxis: {
                    range: [ymin, ymax],
                    title: "Frequency",
                    tick0: ymin,

                }
            };
            console.log(xmin, xmax);
            var data = [line];

            // Plotly.newPlot('ageline', data, layout);
        }
        setLines(listOfAges, listOfFreqs);
    }
);