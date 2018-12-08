# Dengue Fever Data Visualization

Naitra Iriumi, Chace Jones, Franchine Ninh

## URL

https://chacejones1.github.io/

## How to Run Code

In the root of the project, run the command:

```bash
python3 -m http.server 8080
```

## Files

### Data Folder

All the data was given to us by Professor Tanzima Islam. Some of these files were manipulated with python inorder to form in such a way that it would be eaiser to use for the visualizations. The files that were used included:

* Monthly Death and Case numbers of Dengue Fever in Dhaka from 2000-2015

* Daily climate data from 1953-2015 from 21 weather stations in Bangladesh
  
  * Humidity -> Averaged
  * Rainfall -> Totaled
  * Temperature -> Averaged

* Hospital data with symptoms relating to Dengue Fever

  * Taken all positive cases of Dengue Fever from four different hospitals
  * Compared rates of symptom appearance between them

### Readings

These were files given to us to research more about Dengue Fever.

### Scripts

#### agelinegraph.js

* Displays the frequency of ages that appear relating to Dengue Fever.
* Not represented in overall dashboard  

#### barchart.js

* Displays the ratio of every symptom for a particular hospital of postive (had Dengue Fever) and negative cases.

#### visualization.js

* Displays how weather (rain, temp, humidiy) is related to the number of Dengue Fever cases and deaths.

### make_timeline.py

* Used to parse data for visualization.js and output as monthly_table.csv

### index.html

* Renders our dashboard

### style.css

* Page styling / layouting of the dashboard