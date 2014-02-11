(function(g5) {
    var f1 = g5.newField();
    var f2 = g5.newField();
    var f3 = g5.newField();
    g5.addAlgoPlugin({
        name: "Uniprot Data",
        algo: function(g) {
            d3.text("http://datapath.cise.ufl.edu:1080/BioVerto/rest/uniprot/uniprot.list", function(result) {
                var rows = d3.csv.parseRows(result);
                for (i = 0; i < rows.length; i++) {
                    if (g.nodes[rows[i][0]] !== undefined)
                    {   
                        g.nodes[rows[i][0]].data[f1] = rows[i][1];
                        g.nodes[rows[i][0]].data[f2] = rows[i][2];
                        g.nodes[rows[i][0]].data[f3] = rows[i][3];
                    }   
                }
            }
            );
        },
        nodeAccs: {
            "Name": {type: "character", fct: g5.createAccessor(f1)},
            "Sequence": {type: "number", fct: g5.createAccessor(f2)},
            "GO Length": {type: "number", fct: g5.createAccessor(f3)}
        }
    });
}(g5));
