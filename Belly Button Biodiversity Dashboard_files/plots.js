

var base_url = "http://127.0.0.1:5000";


function BuildDropdown() {
    
    url = base_url + "/names";
    Plotly.d3.json(url, function(error, response) {
        if (error) return console.warn(error);

        
        // Add options to dropdown
        var options = Plotly.d3.select("#selDataset")
            .selectAll('option')
            .data(response).enter()
            .append('option')
            .attr("value", (d => d))
            .text(d => d);


        // Add a blank option at the top.
        var $ddBlank = Plotly.d3.select("#selDataset").insert("option", ":first-child")
            .text("Select...").attr("value", "").attr("selected", true);
       
        });
}

BuildDropdown();

/**
 * When a new sample is selected from the dropdown, redraw chart.
 * @fires fillOutTable()
 * @fires buildCharts()
 * @fires buildGauges()
 */
function optionChanged() {
    // Obtain selected sample from dropdown
    var selectedSample = Plotly.d3.select('select').property('value'); 
    console.log('selectsamle_value : ' , selectedSample)
    // Call plot function with the new sample value
    fillOutTable(selectedSample);
    buildCharts(selectedSample);
    buildGauges(selectedSample);
};
// update table info :


function fillOutTable(selectedSample) {
    var base_url = "http://127.0.0.1:5000";

    var url = base_url + '/metadata/' + selectedSample ;  // here is the problem
    Plotly.d3.json(url, function(error, response) {
        if (error) return console.warn(error);
        console.log(response);

        table = Plotly.d3.select(".sample-sidebar");
        // table.select("table").classed("displayed", true);
        table.select("#age").text(response.Age);
        table.select("#bbtype").text(response.BBType);
        table.select("#ethnicity").text(response.Ethnicity);
        table.select("#gender").text(response.Gender);
        table.select("#location").text(response.Location);
        table.select("#sampleid").text(response.SampleID);
        

        Plotly.d3.select(".col-md-9").select(".panel-body").text("Biodiversity Breakdown Pie Chart for Patient " + selectedSample); 
       

    });
};



// make a pie chart 

function buildCharts(selectedSample) {
    var base_url = "http://127.0.0.1:5000";
    var url = base_url + '/samples/' + selectedSample ;  
    Plotly.d3.json(url, function(error, response) {
            if (error) return console.warn(error);
            console.log(response);

    // get top 10 sample values and otu_ids
            var sample_values = []
            var otu_ids = []
            var sample_values_container = response.sample_values
            var otu_id_container = response.otu_ids
            

            for (var i = 0; i < response.sample_values.length; i++) {
                if (i === 9) {
                    break;
                };  
                sample_values.push(sample_values_container[i]);
                otu_ids.push(otu_id_container[i]);
            
            };

            console.log(sample_values);
            console.log(otu_ids);

       
    
            // get discription
                var url_otu = base_url + '/otu/' + selectedSample;  
                Plotly.d3.json(url_otu, function(error, response) {
                        if (error) return console.warn(error);
                        console.log(response);
                    var discription = []
                    for (var i = 0; i < otu_ids.length; i ++){

                        discription.push(response[i]);


                    };
                    console.log(discription);

    
                    // fill the pie chart
                        var data = [{
                            values: sample_values,
                            labels: otu_ids,
                            text: discription,
                            type: 'pie',
                            textinfo: 'none'
                        }];

                        var layout = {
                            height: 600,
                            width: 800
                        };


                        var PIE = document.getElementById('pie');
                        Plotly.plot(PIE, data, layout);


                    // bubble chart:

                    // Output bubble plot
                    var sample_values_sizes = sample_values.map(d => d*5); // Increase the size of the bubbles fourfold, so we can see them!
                    var trace1 = {
                        x: otu_ids,
                        y: sample_values,
                        mode: 'markers',
                        text: discription,
                        marker: {
                            color: otu_ids,
                            colorscale: [[0, 'rgb(200, 255, 200)'], [1, 'rgb(0, 100, 0)']],
                            cmin: Math.min(otu_ids),
                            cmax: Math.max(otu_ids),
                            size: sample_values_sizes,
                            sizemode: 'area',
                            sizeref: 1,
                            showscale: true,
                            colorbar: {
                            thickness: 10,
                            y: 0.5,
                            ypad: 0,
                            title: 'OTU ID',
                            titleside: 'bottom',
                            outlinewidth: 1,
                            outlinecolor: 'black',
                            tickfont: {
                                family: 'Lato',
                                size: 14,
                                color: 'green'
                            }
                            }
                        }
                    };
                    var data = [trace1];
                    Plotly.newPlot('bubble', data, layout);

                    
                 });

         });

};


function buildGauges(selectedSample) {
            var base_url = "http://127.0.0.1:5000";

            var url = base_url + '/wfreq/' + selectedSample;
            Plotly.d3.json(url, function(error, response) {
                if (error) return console.warn(error);
                console.log(response);
        // Enter a speed between 0 and 180
                var frequency = Number(response) * 18;
                // https://plot.ly/javascript/gauge-charts/
                // Enter a speed between 0 and 180
                

                // Trig to calc meter point
                var degrees = 180 - frequency,
                    radius = .5;
                var radians = degrees * Math.PI / 180;
                var x = radius * Math.cos(radians);
                var y = radius * Math.sin(radians);

                // Path: may have to change to create a better triangle
                var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
                    pathX = String(x),
                    space = ' ',
                    pathY = String(y),
                    pathEnd = ' Z';
                var path = mainPath.concat(pathX,space,pathY,pathEnd);

                var data = [{ type: 'scatter',
                x: [0], y:[0],
                    marker: {size: 28, color:'850000'},
                    showlegend: false,
                    name: 'speed',
                    text: frequency ,
                    hoverinfo: 'text+name'},
                { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
                rotation: 90,
                text: ['TOO Frequent!', 'Pretty Frequent', 'Frequent', 'Average Frequent',
                            'Less Frequent', 'not Frequent', ''],
                textinfo: 'text',
                textposition:'inside',      
                marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                                        'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                                        'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                                        'rgba(255, 255, 255, 0)']},
                labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
                hoverinfo: 'label',
                hole: .5,
                type: 'pie',
                showlegend: false
                }];

                var layout = {
                shapes:[{
                    type: 'path',
                    path: path,
                    fillcolor: '850000',
                    line: {
                        color: '850000'
                    }
                    }],
                title: '<b>BellyButton Washing Frequency</b> <br> Frequent 0-100',
                height: 1000,
                width: 1000,
                xaxis: {zeroline:false, showticklabels:false,
                            showgrid: false, range: [-1, 1]},
                yaxis: {zeroline:false, showticklabels:false,
                            showgrid: false, range: [-1, 1]}
                };

                Plotly.newPlot('gauge', data, layout);
            });

 };