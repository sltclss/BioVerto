if (typeof dc === 'undefined')
    dc = {};
/* @param parent: the ID of the DOM element where the gauge will be hooked up into
 @param chartGroup: the group to which the gauge belongs to (determines when refreshing is done)
 */
dc.chord = function(parent) {
    var _fgraph = {}, // main object
            _parentID = parent, // keep track of the parent of an object
            _margins = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
    _nodeData, // current data used by node
            _edgeData, // current data used by edge
            _svg, // svg element
            _node, // nodes
            _graph = {}, // data to be displayed
            _width = 960,
            _height = 600,
            _displayNames = true, // should we display names
            _weightAccessor = function(d) {
                return 2;
            },
            _uniqueElements = [],
            _graphProperty = function(d) {
                return d.data["_0"];
            },
            _terminator; // not used, just to terminate list


    // we can initialize the links/nodes only when we have data
    function changeData(graph) {
        _svg = d3.select(_parentID);
        _nodeData = graph.nodes.map(function(d, i) {
            d.index = i;
            return {
                data: d,
                weight: _weightAccessor(d)
            };
        });
        //console.log(_nodeData);
        _edgeData = graph.edges.map(function(d, i) {
            d.index = i;
            return {
                //  source: d.source,
                //  target: d.target,
                source: _nodeData[d.source.index],
                target: _nodeData[d.target.index],
                data: d.data,
                //value: d.value                
            };
        });

        var matrix = createUniqueList();
        var chord = d3.layout.chord()
                .padding(.05)
                .sortSubgroups(d3.descending)
                .matrix(matrix);
                 _width=_width - 300;
                innerRadius = Math.min(_width, _height) * .41,
                outerRadius = innerRadius * 1.1;

        var fill = d3.scale.ordinal()
                .domain(d3.range(4))
                .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

        var svg = d3.select(_parentID).append("svg")
                .attr("width", _width)
                .attr("height", _height)
                .append("g")
                .attr("transform", "translate(" + _width / 2 + "," + (_height+40) / 2 + ")");

        svg.append("g").selectAll("path")
                .data(chord.groups)
                .enter().append("path")
                .style("fill", function(d) {
                    return fill(d.index);
                })
                .style("stroke", function(d) {
                    return fill(d.index);
                })
                .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
                .on("mouseover", fade(.1))
                .on("mouseout", fade(1));

        var ticks = svg.append("g").selectAll("g")
                .data(chord.groups)
                .enter().append("g").selectAll("g")
                .data(groupTicks)
                .enter().append("g")
                .attr("transform", function(d) {
                    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                            + "translate(" + outerRadius + ",0)";
                });

        ticks.append("line")
                .attr("x1", 1)
                .attr("y1", 0)
                .attr("x2", 5)
                .attr("y2", 0)
                .style("stroke", "#000");

        ticks.append("text")
                .attr("x", 8)
                .attr("dy", ".35em")
                .attr("transform", function(d) {
                    return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
                })
                .style("text-anchor", function(d) {
                    return d.angle > Math.PI ? "end" : null;
                })
                .text(function(d) {
                    return d.label;
                });

        svg.append("g")
                .attr("class", "chord")
                .selectAll("path")
                .data(chord.chords)
                .enter().append("path")
                .attr("d", d3.svg.chord().radius(innerRadius))
                .style("fill", function(d) {
                    return fill(d.target.index);
                })
                .style("opacity", 1);

// Returns an array of tick angles and labels, given a group.
        function groupTicks(d) {
            var k = (d.endAngle - d.startAngle) / d.value;
            return d3.range(0, d.value, 1000).map(function(v, i) {
                return {
                    angle: v * k + d.startAngle,
                    label: (d.index <_nodeData.length) ? _nodeData[d.index].data.data.id :  _uniqueElements[d.index],
                };
            });
//             return[ {
//                    angle: NaN,
//                    label: (d.index <_nodeData.length) ? _nodeData[d.index].data.data.id : _uniqueElements[d.index],
//                }];
        }
        function fade(opacity) {
            return function(g, i) {
                svg.selectAll(".chord path")
                        .filter(function(d) {
                            return d.source.index != i && d.target.index != i;
                        })
                        .transition()
                        .style("opacity", opacity);
            };
        }
// Returns an event handler for fading a given chord group.

    }
    function createUniqueList() {
        _uniqueElements = [];
        for (var i = 0; i < _nodeData.length; i++) {
            _uniqueElements.push(_nodeData[i])
        }
        for (var i = 0; i < _nodeData.length; i++) {
            if (_uniqueElements.indexOf(_graphProperty(_nodeData[i].data)) === -1)
            {
                _uniqueElements.push(_graphProperty(_nodeData[i].data));
            }
        }
        var matrix = new Array();
        for (var i = 0; i < _uniqueElements.length; i++) {
            matrix.push(Array.apply(null, new Array(_uniqueElements.length)).map(Number.prototype.valueOf, 0))
        }

        for (var i = 0; i < _nodeData.length; i++) {

            for (var j = _nodeData.length; j < _uniqueElements.length; j++) {
                if (_uniqueElements[j] === _graphProperty(_uniqueElements[i].data))
                {
                    matrix[i][j] = 1;
                    matrix[j][j]=1;
                    matrix[j][i]=1;
                    
                }
                else
                {
                    matrix[i][j] = 0;
                }
            }

        }
        
        
        return matrix;
    }

    // wrap the info in graph so that force layout is happy

    //console.log(_edgeData);




    _fgraph.init = function(parent, data, width, height) {
        _parentID = parent;
       _width = width;
       _height = height;
       
        _fgraph.graphView(data)
           .resize(width, height);
        return _fgraph;
    }
    _fgraph.destroy = function()
    {
        $(_parentID).empty();
  
    }


    // should we display names for nodes?
    _fgraph.displayNames = function(_) {
        if (!arguments.length)
            return _displayNames;
        _displayNames = _;

        if (_displayNames)
            _node.append("text")
                    .text(function(d) {
                        return d.name;
                    });
        else {
            _node.selectAll("text").remove();
        }

        // _fgraph.doRedraw();
        return _fgraph;
    }



    // Change/get data
    _fgraph.graphView = function(_) {
        if (!arguments.length)
            return _graph;
        _graph = _;
        changeData(_graph);
        return _fgraph;
    };

    _fgraph.resize = function(width, height) {
        _width = width;
        _height = height;
        return _fgraph;
    };


    return _fgraph;
};