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
        var width = 120,
            height = 320,
            allAges = unpack(rows, "Freq"),
            listOfAges = [],
            listOfFreqs = [];

        //getting list of ages from data
        for (var i = 0; i < allAges.length; i++) {
            listOfFreqs[i].push(allAges[i]);
            listOfAges[i].push(i + 1);
        }


        function setLines(chosenYear, y1, y2) {

            Plotly.newPlot('line', data, layout);
        }

    }
);