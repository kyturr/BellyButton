function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // console.log(metadata)
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var smplData = data.samples;
    // console.log(smplData)
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var smplArray = smplData.filter(sampleObj => sampleObj.id== sample);
    //  5. Create a variable that holds the first sample in the array.
    var smpl = smplArray[0];
    // console.log(smpl);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds=smpl.otu_ids;
    // console.log(otuIds);
    var otuLabels=smpl.otu_labels;
    // console.log(otuLabels);
    var smplValues=smpl.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var top10 = otuIds.slice(0,10).map(id=>"OTU "+id).reverse();
    var val10= smplValues.slice(0,10).reverse();
    // console.log(top10);
    // console.log(val10);
    // 8. Create the trace for the bar chart. 
    var trace1 = {
      x: val10,
      y: top10,
      type:"bar",
      orientation: "h"
    };
    var barData= [trace1];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
    ///////////////////////////////////
    //////////////////////////////////
    /////Deliverable 2///////////////
    ////////////////////////////////
    ///////////////////////////////
    // 1. Create the trace for the bubble chart.
    // console.log(otuLabels);
    var bubbleTrace = {
      x: otuIds,
      y: smplValues,
      mode: 'markers',
      text: otuLabels,
      marker:{
        size: smplValues,
        color:otuIds,
        colorscale: 'YlGnBu',
        opacity: 0.5
      }
    };
    // console.log(bubbleData);
    var bubbleData=[bubbleTrace]
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {
        text: "Bacteria Cultures Per Sample",
        font: {
          family:'Courier New, monospace',
          size: 24
        }
      },
      xaxis:{
        title: "OTU ID",
      font:{
        family:'Courier New, monospace',
        size: 18
      }
    }
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    ///////////////////////////////////
    //////////////////////////////////
    /////Deliverable 3///////////////
    ////////////////////////////////
    ///////////////////////////////

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var meta = data.metadata;
    // console.log(meta);
    // Filter the data for the object with the desired sample number
    var resultArray = meta.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    
    var result = resultArray[0];
    // console.log(result);
    // 3. Create a variable that holds the washing frequency.
    var wFreq= parseFloat(result.wfreq);
    // console.log(wFreq);
  
    // 4. Create the trace for the gauge chart.
    var gaugeTrace = { 
      domain: {x:[0,10], y:[0,10]},
      type: "indicator",
      mode: "gauge+number+delta",
      value: wFreq,
      title:{text: "Belly Button Washing Frequency", font: { size: 24 }},
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "black" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "maroon" },
          { range: [2, 4], color: "gold" },
          { range: [4, 6], color: "lemonchiffon" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" }
        ],
        threshold: {
          line: { color: "white", width: 4 },
          thickness: 0.75,
          value: 10
        }
      }

    };
    var gaugeData =  [gaugeTrace];
    // console.log(gaugeData)
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600,
      height: 500,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "black", family: "Arial" }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  });
}
