dataset = []

Plotly.d3.csv('Data/monthly_table.csv',

    function(d) {
        return {
            cases: +d.cases,
            date: +d.date,
            deaths: +d.deaths,
            humidity: +d.humidity,
            rainfall: +d.rainfall,
            temp: +d.temp
        }
    },

    function(err, rows) {
        
        dataset = rows;

        function unpack(rows, key) {
            return rows.map(function(row) { 
              return row[key]; 
        })}

        var data = [{

    
            // Parallel coordinates
            type: 'parcoords',
            pad: [80,80,80,80],
            
            line: {
              color: unpack(rows, 'date'),
              colorscale: "Greens"
            },
          
            dimensions: [{
              range: [Math.round(Math.min.apply(Math, unpack(rows, 'temp'))), 
                    Math.round(Math.max.apply(Math, unpack(rows, 'temp')))],
              label: 'temp',
              values: unpack(rows, 'temp')
            }, {
              range: [Math.min.apply(Math, unpack(rows, 'rainfall')), 
                    Math.max.apply(Math, unpack(rows, 'rainfall'))],
              label: 'rainfall',
              values: unpack(rows, 'rainfall')
            }, {
              label: 'humidity',
              range: [Math.round(Math.min.apply(Math, unpack(rows, 'humidity'))), 
                    Math.round(Math.max.apply(Math, unpack(rows, 'humidity')))],
              values: unpack(rows, 'humidity')
            }, {
              label: 'deaths',
              range: (Math.round(Math.min(unpack(rows, 'deaths'))), Math.round(Math.max(unpack(rows, 'deaths')))),
              values: unpack(rows, 'deaths')
            },{
                label: 'cases',
                range: (Math.round(Math.min(unpack(rows, 'cases'))), Math.round(Math.max(unpack(rows, 'cases')))),
                values: unpack(rows, 'cases')
            }]
          }];
          
          var layout = {
            width: 1200,
            height: 600
          };
        
        
        // GRAPHS DATA
        Plotly.plot('graphDiv', data, layout);
})

    