// Import data and create plots
function getPlot(selectedsubjectID) {
    d3.json("complete.json").then((data) => {
        console.log(data)

        var plotData = data.metadata;
        var subject = plotData.filter(
            (sampleobject) => sampleobject.awardYear == selectedsubjectID
        )[0];

        console.log(subject);
        var gender = subject.gender;
        var category = subject.category;
        var birth_country = subject.birth_country;


        // Bar Chart
    
        //  
        var trace1 = {
            x: category,
            y: birth_country,
            text: gender,
            type: "bar",
            orientation: "h",
            marker: {
                color: "blue",
                width: 900,
            }
        };

        //   Data array
        var data = [trace1];

        var layout = {
            title: "<b>Top 10 countries </b>",
            xaxis: { autorange: true },
            yaxis: { autorange: true },
            margin: { t: 60, l: 120 },
        };
        //   Render plot
        Plotly.newPlot("bar", data, layout);


        // Bubble Chart
       
        //  Trace for Bubble Chart
        var trace1 = {
            x: ids,
            y: labels,
            text: values,
            mode: "markers",
            marker: {
                color: ids,
                size: labels,
                colorscale: "Jet",
            },
        };
        //   Data array
        var data = [trace1];

        var layout = {
            title: '<b>OTU ID Samples Collected</b>',
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Number of Samples Collected" },
            hovermode: "closest",
            width: 1300,
            height: 800
        };
        //   Render  plot
        Plotly.newPlot("bubble", data, layout);
    });
}

// Demographic Info 


function getDemographic(selectedsubjectID) {
    d3.json("complete.json").then((data) => {
        var metadata = data.metadata;
        var subject = metadata.filter(
            (sampleobject) => sampleobject.id == selectedsubjectID
        )[0];
        var demographicInfoBox = d3.select("#complete-metadata");
        demographicInfoBox.html("");
        Object.entries(subject).forEach(([key, value]) => {
            demographicInfoBox.append("h5").text(`${key}: ${value}`);
        });

        
        // Gauge Chart
        
        //  Var for Guage Chart
        var gaugeData = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: subject.awardYear,
            text: subject.awardYear,
            type: "indicator",
            mode: "gauge+number",
            delta: { reference: 10 },
            gauge: {
                axis: { range: [1900, 2025] },
                bar: { color: "black" },
                steps: [
                    { range: [1900, 1925], color: "cyan" },
                    { range: [1925, 1950], color: "green" },
                    { range: [1950, 1975], color: "blue" },
                    { range: [1975, 2000], color: "orange" },
                    { range: [2000, 2025], color: "red" },
                ],
            },
        }, ];

        var layout = {
            title: "<b>number of noble prize per 25 years</b> <br>(awards/25 years)</br>",
            width: 550,
            height: 400,
            margin: { t: 50, b: 0 },
        };

        //   Render  plot
        Plotly.newPlot("gauge", gaugeData, layout);
    });
}


// Initialize Data

function init() {
    d3.json("complete.json").then(function(data) {
        console.log("complete.json:", data);

        // Select dropdown via D3:
        let DropDown = d3.select(`#selDataset`);

        // Populate dropdown with sample names from json
        data.Year.forEach((Year) => {
            DropDown.append(`option`).text(Year).property(`value`, Year);
        });

        // Fetch data to populate plots from first sample
        const firstSample = data.Year[0];
        getPlot(firstSample);
        getDemographic(firstSample);
    });
}
// Fetch new data when a new sample is selected
function optionChanged(newSample) {
    getPlot(newSample);
    getDemographic(newSample);
}
// Initialize Dashboard
init();