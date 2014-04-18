var width = 1600,
    height = 1600

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .size([width, height]);


d3.tsv("people.tsv", function(e, data) {
  var nameHash = [];
  var indexHash = [];

  var graph = {};
  graph.nodes = [];
  graph.links = [];

  for (var i = 0; i < data.length; i++) {
    var nameArr = nameHash[data[i].name];

    if (nameArr == null) {
      nameArr = [data[i].institution];
    } else {
      nameArr.push(data[i].institution);
    }
    nameHash[data[i].name] = nameArr;
    //indexHash[data[i].name]


    var indexArr = indexHash[data[i].name];
    if (indexArr == null) {
      indexArr = [i];
    } else {
      indexArr.push(i);
    }
    indexHash[data[i].name] = indexArr;

    var nSize = data[i].count.replace('(','').replace(')','')*1;
    var node = {
      name : data[i].name,
      group : data[i].institution,
      size : nSize,
      i : i
    };
    graph.nodes.push(node);

    var newTarget = null;
    if (data[i].institution == "Microsoft Research") {
        newTarget = 0;
    }
    if (data[i].institution == "Nokia") {
        newTarget = 1;
    }
    if (data[i].institution == "IBM Thomas J. Watson Research Center") {
        newTarget = 2;
    }
    if (data[i].institution == "Microsoft Research Cambridge") {
        newTarget = 3;
    }
    if (data[i].institution == "IBM") {
        newTarget = 4;
    }
    if (data[i].institution == "Microsoft") {
        newTarget = 5;
    }
    if (data[i].institution == "IBM Research") {
        newTarget = 6;
    }
    if (data[i].institution == "IBM Almaden Research Center") {
        newTarget = 7;
    }


    if (newTarget != null) {
      var link = {
        source : i,
        target : newTarget,
      };
      graph.links.push(link);
    }

  }

  for (n in nameHash) {
    var indexArr = indexHash[n];
    if (indexArr.length > 1) {
      for (var i = 1; i < indexArr.length; i++) {
        var link = {
          source : indexArr[0],
          target : indexArr[i],
        };
        graph.links.push(link);
      }
    }
  }
  console.log(graph);
  generateGraph(graph);

});

function generateGraph(json) {
  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  var color = d3.scale.category20();
  node.append("circle")
      .attr("class", "node")
      .attr("r", function(d) {
        return d.size;
      })
      .style("fill", function(d) { return color(d.group); })


  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .classed("top", true)
      .text(function(d) { 
        if (d.index < 8) {
          return d.name;
        } else {
          return '';
        }
        
      });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
}