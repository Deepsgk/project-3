
var svgWidth = 960;
var svgHeight = 700;
var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// insert chart to tag id "scatter"
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
// Append an SVG group
var chartGroup = svg.append("g")
.attr("height", height)
.attr("width", width)
.attr("transform", `translate(${margin.left}, ${margin.top})`);
// Initial Xscale Params
var chosenXAxis = "awardyear";
// function used for updating x-scale var upon click on axis label
function xScale(nobelData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(nobelData, d => d[chosenXAxis]-0.2) ,
      d3.max(nobelData, d => d[chosenXAxis])
    ])
    .range([0, width]);
  return xLinearScale;
}
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}
// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  return circlesGroup;
}

// Initial Yscale Params
var chosenYAxis = "prizeamount";

// function used for updating Y-scale var upon click on axis label
function yScale(nobelData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(nobelData, d => d[chosenYAxis]-0.7) ,
      d3.max(nobelData, d => d[chosenYAxis])
    ])
    .range([height, 0]);

  return yLinearScale;

}
// function used for updating y-Axis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var LeftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(LeftAxis);

  return yAxis;
}


// function used for updating circles group with a transition to new circles by yAxis
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
};


//function used for update text in circle with a transition to new circles by xAxis
function renderXtext(circlestext, newXScale, chosenXAxis) {

  circlestext.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));
  return circlestext;
};
//function used for update text in circle with a transition to new circles by xAxis
function renderYtext(circlestext, newYScale, chosenYAxis) {
  circlestext.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYAxis]));
  return circlestext;
};
// function used for updating circles group with new tooltip
function updateToolTipx(chosenXAxis, circlesGroup) {
  if (chosenXAxis === "id" ) {
     var labelx = "id" 
     var labely =chosenYAxis
  }
 
  else {
    var labelx ="awardyear"
    var labely =chosenYAxis
  };
  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.birth_continent}<br>${labelx}: ${d[chosenXAxis]}<br><br> ${labely}:${d[chosenYAxis]}`);
  });
  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
  .on("mouseout", function(data, index) {
      toolTip.hide(data);
  });
  return circlesGroup;
}
// function used for updating circles group with new tooltip
function updateToolTipy(chosenYAxis, circlesGroup) {

  if (chosenYAxis === "sortorder" ) {
    var labely = "sortorder" 
    var labelx =chosenXAxis
  }
  
  else {    
    var labely ="prizeamount"
    var labelx =chosenXAxis
  };

  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.birth_continent}<br>${d.birth_countrynow}<br>${d.category}<br>${labelx}: ${d[chosenXAxis]}<br> ${labely}:${d[chosenYAxis]}`);
  });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
  return circlesGroup;
}
// Retrieve data from the api and execute everything below
d3.json('http://127.0.0.1:5000/api/v0/nobelprizewinners').then(function(nobelData, err) {
  if (err) throw err;
  // parse data
  nobelData.forEach(function(data) {
    data.awardyear = +data.awardyear;
    data.prizeamount = +data.prizeamount;
    data.id = + data.id;
    data.birth_continent = data.birth_continent;
    data.sortorder = + data.sortorder;
    
  });
     
  // xLinearScale function 
  var xLinearScale = xScale(nobelData, chosenXAxis);
  
  // Create y scale function
  var yLinearScale = yScale(nobelData, chosenYAxis);

  // Create initial axis functions & Create bottom(x) and left(y) axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);
  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(nobelData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".9");
//adding text element inside the circle
var circlestext = chartGroup.selectAll(".stateText")
                  .data(nobelData)
                  .enter()
                  .append("text")
                  .classed ("stateText", true)
                  .attr("x", d => xLinearScale(d[chosenXAxis]))
                  .attr("y", d => yLinearScale(d[chosenYAxis]))
                  
                  
  // Create group for  2 x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  var yearLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 50)
    .attr("value", "awardyear") 
    // value to grab for event listener
    .classed("active", true)
    .text("awardyear");

  var idLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("value", "id")
    .classed("active", true)
    .text("id");
  // create group for 2 y-axis labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");
  var prizeLabel =ylabelsGroup.append("text")
    .attr("y", 0 - margin.left+40)
    .attr("x", 0 - (height/2))
    .attr("value", "prizeamount") // value to grab for event listener
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("prizeamount");
  var orderLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "sortorder") // value to grab for event listener
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("sortorder");
  // updateToolTip function above csv import
  var circlesGroup = updateToolTipx(chosenXAxis, circlesGroup);
  var circlesGroup = updateToolTipy(chosenYAxis, circlesGroup);
  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;
        xLinearScale = xScale(nobelData, chosenXAxis);
        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        circlestext = renderXtext (circlestext,xLinearScale,chosenXAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTipx(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        //Xaxis
        if (chosenXAxis === "awardyear") {
          yearLabel
            .classed("active", true)
            .classed("inactive", false);
          idLabel
            .classed("active", false)
            .classed("inactive", true);
          
        }
        
        else {
          yearLabel
            .classed("active", false)
            .classed("inactive", true);
          idLabel
            .classed("active", true)
            .classed("inactive", false);
         
        }

        
      }
    });

    // y axis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

         console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(nobelData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
        circlestext = renderYtext (circlestext,yLinearScale,chosenYAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTipy(chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "prizeamount") {
          prizeLabel
            .classed("active", true)
            .classed("inactive", false);
          orderLabel
            .classed("active", false)
            .classed("inactive", true);
          
        }
        
        else {
          prizeLabel
            .classed("active", false)
            .classed("inactive", true);
          orderLabel
            .classed("active", true)
            .classed("inactive", false);
          
        }
      }
    
    });

  }).catch(function(error) {
    console.log(error);
  });
