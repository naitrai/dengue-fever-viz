d3.csv("../resources/symptom_data.csv", (data)=> {

    // Transform age from string to integer
    data.forEach((d) => {
        
        d.Age_AdultPt = +d.Age_AdultPt;
        d.Age_children = Math.floor(+d.Age_children / 12);

    });

    // Create JS Object 
    var hospitalDataCount = {
        
        "hospitals": [
            {
                "name": "Chittagong Medical College Hospital",
                "data": {
                    "Age_AdultPt": 0,	
                    "Age_children": 0, 
                    "Fever_Type": 0,
                    "Fever_chills": 0,
                    "Fever_Subside": 0,
                    "Cough": 0,	
                    "Severe_Headache": 0,	
                    "Nausea": 0,	
                    "Vomiting": 0,
                    "AbdominalPain": 0,
                    "Severe_Myalgia": 0,
                    "Arthalgia": 0,
                    "Back_Pain": 0,
                    "Rash": 0,
                    "Itching": 0,	
                    "Retroorbital_Pain": 0,	
                    "Hemorrhagic_menifestations": 0,	
                    "Haemorrhagic_spot": 0,
                    "Conjunctival_Haemorrhage": 0,	
                    "Travel_history": 0,	
                    "mosquito_present": 0,
                    "Family_sickness": 0,	
                    "Neighbourhood_illness": 0,	
                    "result": 0
                }               
            },

            {
                "name": "Dhaka Medical College Hospital",
                "data": {
                    "Age_AdultPt": 0,	
                    "Age_children": 0, 
                    "Fever_Type": 0,
                    "Fever_chills": 0,
                    "Fever_Subside": 0,
                    "Cough": 0,	
                    "Severe_Headache": 0,	
                    "Nausea": 0,	
                    "Vomiting": 0,
                    "AbdominalPain": 0,
                    "Severe_Myalgia": 0,
                    "Arthalgia": 0,
                    "Back_Pain": 0,
                    "Rash": 0,
                    "Itching": 0,	
                    "Retroorbital_Pain": 0,	
                    "Hemorrhagic_menifestations": 0,	
                    "Haemorrhagic_spot": 0,
                    "Conjunctival_Haemorrhage": 0,	
                    "Travel_history": 0,	
                    "mosquito_present": 0,
                    "Family_sickness": 0,	
                    "Neighbourhood_illness": 0,	
                    "result": 0
                }
            },

            {
                "name": "Uttara Adhunik Medical College Hospital",
                "data": {
                    "Age_AdultPt": 0,	
                    "Age_children": 0, 
                    "Fever_Type": 0,
                    "Fever_chills": 0,
                    "Fever_Subside": 0,
                    "Cough": 0,	
                    "Severe_Headache": 0,	
                    "Nausea": 0,	
                    "Vomiting": 0,
                    "AbdominalPain": 0,
                    "Severe_Myalgia": 0,
                    "Arthalgia": 0,
                    "Back_Pain": 0,
                    "Rash": 0,
                    "Itching": 0,	
                    "Retroorbital_Pain": 0,	
                    "Hemorrhagic_menifestations": 0,	
                    "Haemorrhagic_spot": 0,
                    "Conjunctival_Haemorrhage": 0,	
                    "Travel_history": 0,	
                    "mosquito_present": 0,
                    "Family_sickness": 0,	
                    "Neighbourhood_illness": 0,	
                    "result": 0
                }
            },

            {
                "name": "Khulna Medical College Hospital",
                "data": {
                    "Age_AdultPt": 0,	
                    "Age_children": 0, 
                    "Fever_Type": 0,
                    "Fever_chills": 0,
                    "Fever_Subside": 0,
                    "Cough": 0,	
                    "Severe_Headache": 0,	
                    "Nausea": 0,	
                    "Vomiting": 0,
                    "AbdominalPain": 0,
                    "Severe_Myalgia": 0,
                    "Arthalgia": 0,
                    "Back_Pain": 0,
                    "Rash": 0,
                    "Itching": 0,	
                    "Retroorbital_Pain": 0,	
                    "Hemorrhagic_menifestations": 0,	
                    "Haemorrhagic_spot": 0,
                    "Conjunctival_Haemorrhage": 0,	
                    "Travel_history": 0,	
                    "mosquito_present": 0,
                    "Family_sickness": 0,	
                    "Neighbourhood_illness": 0,	
                    "result": 0
                }
            },
        ]
    }
    
    // Fill JS Objects with data
    

})