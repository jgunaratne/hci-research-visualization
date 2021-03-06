var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("years.tsv", function(error, data) {
  data.forEach(function(d) {
    d.count = +d.count;
    d.year = +d.year;
    d.size = +d.count;
  });

  var yearSumsHash = [];
  var citeSumsHash = [];

  data.forEach(function(d) {
    d.count = +d.count;
    if (yearSumsHash[d.year] == null) {
      yearSumsHash[d.year] = 0;
    }
    if (citeSumsHash[d.year] == null) {
      citeSumsHash[d.year] = 0;
    }
    yearSumsHash[d.year] += d.count;
    citeSumsHash[d.year] += 1;
  });

  for (n in yearSumsHash) {
    console.log(n + '\t' + Math.round(yearSumsHash[n]/citeSumsHash[n]));
  }

  x.domain(d3.extent(data, function(d) { return d.year; })).nice();
  y.domain(d3.extent(data, function(d) { return d.count; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Citations")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) { return d.size/25; })
      .attr("cx", function(d) { return x(d.year); })
      .attr("cy", function(d) { return y(d.count); })
      .style("fill", function(d) { return color(d.species); });

  // var legend = svg.selectAll(".legend")
  //     .data(color.domain())
  //   .enter().append("g")
  //     .attr("class", "legend")
  //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // legend.append("rect")
  //     .attr("x", width - 18)
  //     .attr("width", 18)
  //     .attr("height", 18)
  //     .style("fill", color);

  // legend.append("text")
  //     .attr("x", width - 24)
  //     .attr("y", 9)
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "end")
  //     .text(function(d) { return d; });

});