# Belly Button Biodiversity

![text](images/app_screen_shot.png)
![text](images/app_screen_shot2.png)
![text](images/app_screen_shot3.png)

In this assignment, I build an interactive dashboard to explore the [Belly Button Biodiversity DataSet](http://robdunnlab.com/projects/belly-button-biodiversity/).

## Step 1 - Flask API

Use Flask to design an API for your dataset and to serve the HTML and JavaScript required for your dashboard page. Note: We recommend using the sqlite database file and SQLAlchemy inside of your Flask application code, but you are permitted to read the CSV data directly into Pandas DataFrames for this assignment. You will still need to output the data as JSON in the format specified in the routes below.



## Step 2 - Plotly.js

Use Plotly.js to build interactive charts for your dashboard.


* Create a PIE chart that uses data from your routes `/samples/<sample>` and `/otu` to display the top 10 samples.

  * Use the Sample Value as the values for the PIE chart

  * Use the OTU ID as the labels for the pie chart

  * Use the OTU Description as the hovertext for the chart

  * Use `Plotly.restyle` to update the chart whenever a new sample is selected

  

* Create a Bubble Chart that uses data from your routes `/samples/<sample>` and `/otu` to plot the __Sample Value__ vs the __OTU ID__ for the selected sample.

  * Use the OTU IDs for the x values

  * Use the Sample Values for the y values

  * Use the Sample Values for the marker size

  * Use the OTU IDs for the marker colors

  * Use the OTU Description Data for the text values

  * Use `Plotly.restyle` to update the chart whenever a new sample is selected

  

* Display the sample metadata from the route `/metadata/<sample>`

  * Display each key/value pair from the metadata JSON object somewhere on the page

  * Update the metadata for each sample that is selected

* You are welcome to create any layout that you would like for your dashboard. An example dashboard page might look something like the following.

* Finally, deploy your Flask app to Heroku.

---

## Optional Challenge Assignment

The following task is completely optional

* Adapt the Gauge Chart from [https://plot.ly/javascript/gauge-charts/](https://plot.ly/javascript/gauge-charts/) to plot the Weekly Washing Frequency obtained from the route `/wfreq/<sample>`

* You will need to modify the example gauge code to account for values ranging from 0 - 9.

* Use `Plotly.restyle` to update the chart whenever a new sample is selected

