/********************************************/
var svgWidth = 1000;
var svgHeight = 600;

var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 60,
};

var chartwidth = svgWidth - margin.left - margin.right;
var chartheight = svgHeight - margin.top - margin.bottom;

/********************************************/
//creating svg wrapper and appending an chartgroup
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

/********************************************/
//Importing the csv data
d3.csv("assets/data/data.csv").then(function(Census) {
  Census.forEach(function(data) {
    data.age = +data.age;
    data.smokes = +data.smokes;
    console.log(data);
  });

/********************************************/
//Creating the x-axis scale
  const xScale = d3.scaleLinear()
    .domain(d3.extent(Census, d => d.age))
    .range([0, chartwidth])
    .nice(); //makes the intersection of axes crisp

//Creating the y-axis scale
  const yScale = d3.scaleLinear()
    .domain([6,d3.max(Census, d => d.smokes)])
    .range([chartheight, 0])
    .nice();
  
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  chartGroup.append("g").attr("transform", `translate(0, ${chartheight})`).call(xAxis);
  chartGroup.append("g").call(yAxis);

/********************************************/
//Function to make the scatter plot
chartGroup.selectAll("circle")
.data(Census)
.enter()
.append("circle")
.attr("cx", d=>xScale(d.age))
.attr("cy", d=>yScale(d.smokes))
.attr("r", "15")
.attr("stroke-width", "1")
.classed("stateCircle", true)
.attr("opacity", 0.75);

//Adding the  data text to the scatter points
chartGroup.append("g")
  .selectAll('text')
  .data(Census)
  .enter()
  .append("text")
  .text(d=>d.abbr)
  .attr("x",d=>xScale(d.age))
  .attr("y",d=>yScale(d.smokes))
  .classed(".stateText", true)
  .attr("text-anchor", "middle")
  .attr("font-size", "10px")
  .style("font-weight", "bold")
  .attr("alignment-baseline", "central");
  
/********************************************/
//Adding axes titles in scatter plot
chartGroup.append("text")
        .attr("transform", `translate(${chartwidth / 2}, ${chartheight + margin.top + 13})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("fill", "black")
        .style("font-weight", "bold")
        .text("Median Age");

        chartGroup.append("text")
        .attr("y", 0 - ((margin.left / 2) + 2))
        .attr("x", 0 - (chartheight / 2))
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("fill", "black")
        .style("font-weight", "bold")
        .attr("transform", "rotate(-90)")
        .text("Smokers(%)");
}).catch(function(error) {
  console.log(error);
});
// I used the live server to host the index.html, Not the python -m http.server line of code.