
d3.tsv("schools.tsv", function(e, data) {
  var nameHash = [];
  for (var i = 0; i < data.length; i++) {
    var name = data[i].name;
    var rank = +data[i].rank;
    if (nameHash[name] == null) {
      nameHash[name] = rank;
    } else if (nameHash[name]) {
      nameHash[name] += rank;
    }
  }

  var schools = [];
  for (n in nameHash) {
    if (nameHash[n]) {
      schools.push([n, nameHash[n]]);
    }
  }
  schools.sort(function(a,b) {
    return a[1] - b[1];
  }).reverse();
  
  var i = 0;
  for (n in schools) {
    var s = (schools[n]);
    console.log(s[0],s[1].toFixed(1));
    i++;
  }
  console.log(i);
});