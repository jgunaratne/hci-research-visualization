var width = 1200,
    height = 1200

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .size([width, height]);


d3.tsv("papers.tsv", function(e, data) {
  var graph = {};
  graph.nodes = [];
  graph.links = [];

  var institutionHash = [];
  for (var i = 0; i < data.length; i++) {
    institutionHash[data[i].institution] = 0;
  }

  var nodeCount = 0;

  for (n in institutionHash) {
    var node = {
      name : n,
      group : n,
      size : 4,
      nodeCount : nodeCount
    };
    institutionHash[n] = nodeCount;
    graph.nodes.push(node);
    nodeCount++;
  }

  for (var i = 0; i < data.length; i++) {
    var nm = data[i].name.replace(/"/,'').replace(/:/,'').substring(0,32)+'...';
    var institution = data[i].institution;
    var count = data[i].count;
    var people = data[i].people.split(', ');
    var node = {
      name : nm + " (" + count + ")",
      group : institution,
      size : count/10,
      nodeCount : nodeCount
    };
    graph.nodes.push(node);

    var link = {
      source : nodeCount,
      target : institutionHash[institution],
    };
    graph.links.push(link);

    nodeCount++;
    /*
    for (var j = 0; j < people.length; j++) {
      var pnode = {
        //name : people[j],
        group : institution,
        size : 1,
        nodeCount : nodeCount
      };
      graph.nodes.push(pnode);

      var link = {
        source : nodeCount,
        target : institutionHash[institution],
      };
      graph.links.push(link);

      nodeCount++;

    }
    */
  }

  var link = {
    source : institutionHash["Carnegie Mellon University"],
    target : institutionHash["Georgia Institute of Technology"],
    value : 5
  };
  graph.links.push(link);

  var link = {
    source : institutionHash["University of Sussex"],
    target : institutionHash["Georgia Institute of Technology"],
    value : 1
  };
  graph.links.push(link);

  var link = {
    source : institutionHash["Carnegie Mellon University"],
    target : institutionHash["MIT"],
    value : 5
  };
  graph.links.push(link);


  var link = {
    source : institutionHash["Carnegie Mellon University"],
    target : institutionHash["Microsoft Research"],
    value : 49
  };
  graph.links.push(link);

  var link = {
    source : institutionHash["MIT"],
    target : institutionHash["Stanford University"],
    value : 5
  };
  graph.links.push(link);


  var link = {
    source : institutionHash["University of California, Berkeley"],
    target : institutionHash["PARC"],
    value : 1
  };
  graph.links.push(link);

  var link = {
    source : institutionHash["University of Maryland"],
    target : institutionHash["Microsoft Research"],
    value : 15
  };
  graph.links.push(link);

  var link = {
    source : institutionHash["University of California, Berkeley"],
    target : institutionHash["Stanford University"],
    value : 25
  };
  graph.links.push(link);

  var link = {
    source : institutionHash["University of California, Berkeley"],
    target : institutionHash["MIT"],
    value : 4
  };
  graph.links.push(link);

  var link = {
    source : institutionHash["University of Washington"],
    target : institutionHash["Cornell University"],
    value : 8
  };
  graph.links.push(link);

  var link = {
    source : institutionHash["University of Washington"],
    target : institutionHash["Microsoft Research"],
    value : 83
  };
  graph.links.push(link);

  var link = {
    source : institutionHash["Sony Computer Science Labs"],
    target : institutionHash["MIT"],
    value : 3
  };
  graph.links.push(link);

  var link = {
    source : institutionHash["University of Maryland"],
    target : institutionHash["Carnegie Mellon University"],
    value : 6
  };
  graph.links.push(link);


  var link = {
    source : institutionHash["PARC"],
    target : institutionHash["Carnegie Mellon University"],
    value : 2
  };
  graph.links.push(link);

  var link = {
    source : institutionHash["Royal College of Art"],
    target : institutionHash["Carnegie Mellon University"],
    value : 1
  };
  graph.links.push(link);

  var link = {
    source : institutionHash["University of Maryland"],
    target : institutionHash["Royal College of Art"],
    value : 1
  };
  graph.links.push(link);

  generateGraph(graph);
  console.log(graph);
});

function generateGraph(json) {
  force
      .nodes(json.nodes)
      .links(json.links)
      .charge(-800)
      //.linkDistance(200)
      .linkStrength(.1)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return d.value; });

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
        return d.name;
      });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
}