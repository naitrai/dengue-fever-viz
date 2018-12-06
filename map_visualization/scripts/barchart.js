

var hospitalData = d3.csv("../resources/symptom_data.csv", (data) => {


    // Hierarchy of data
    hospitalList = ["Chittagong Medical College Hospital", "Dhaka Medical College Hospital",
                    "Uttara Adhunik Medical College Hospital", "Khulna Medical College Hospital"];
    symptomList = Object.keys(data[1]).slice(3, Object.keys(data[1]).length - 1)
    symptomState = ["yes", "no"];

    // Top down approach of creating the object
    var hospitalData = {}

    for (var hospital = 0; hospital < hospitalList.length; hospital++) {
        
        // Add hospital 
        hospitalData[hospitalList[hospital]] = {};


        // Add symptom in hospital
        for (var symptom = 0; symptom < symptomList.length; symptom++) {
            hospitalData[hospitalList[hospital]][symptomList[symptom]] = {};


            // Add state for each symptom
            for (var state = 0; state < symptomState.length; state++) {
                hospitalData[hospitalList[hospital]][symptomList[symptom]][symptomState[state]] = 0;
            }
        }
    }


    // Iterate through all the rows and add counts to specific 
    for (var i = 0; i < data.length; i++) {

        var currentRow = data[i] 
        
        // Locate the hospital name 
        hospitalName = currentRow.Hospital_Code

        for (var j = 0; j < symptomList.length; j++) {

            var symptomName = symptomList[j];        
            var state = currentRow[symptomName].toLowerCase();

            if (typeof state === 'string' && (state === "yes" || state === "no")) {

                hospitalData[hospitalName][symptomName][state] += 1;
            }
        }
    }

    // Normalizing the data
    var graphNumber = 0;
    for (var hospital in hospitalData) {

        var yesRatioList = []
        var noRatioList = []
        for (var i = 0; i < Object.keys(hospitalData[hospital]).length; i++) {

            var yesFrequency = hospitalData[hospital][symptomList[i]]["yes"];
            var noFrequency = hospitalData[hospital][symptomList[i]]["no"];
            var total = yesFrequency + noFrequency

            console.log(symptomList[i] + " Yes: " + yesFrequency + " No: " + noFrequency+ " Total: " + total)

            console.log(yesFrequency / total)
            yesRatioList.push(yesFrequency / total);
            noRatioList.push(noFrequency / total);
        }

        var yesData = {
            x: symptomList,
            y: yesRatioList,
            name: 'Yes',
            type: 'bar'
        };
        
        var noData = {
            // Labels
            x: symptomList,
            y: noRatioList,
            name: 'No',
            type: 'bar'
        };

        var data = [yesData, noData];      
        var layout = {
            barmode: 'stack',
            title: hospital + " Symptom Ratios",
            xaxis: {
                title: 'Symptoms'
            },

            yaxis: {
                title: 'Percentage %'
            }
        };

        Plotly.newPlot('infoBox' + graphNumber, data, layout=layout);
        
        document.getElementById('infoBox' + graphNumber).on('plotly_click', function(data){
            d3.select(this)
                .transition()
                .duration(300)
                .style("opacity", "0")
        });
        
        graphNumber++;
    }
});
