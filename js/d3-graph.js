// if both d3v3 and d3v4 are loaded, we'll assume
// that d3v4 is called d3v4, otherwise we'll assume
// that d3v4 is the default (d3)
if (typeof d3v4 == 'undefined')
    d3v4 = d3;

var links = null;
var nodes = null;
var yAxisG = null;
var simulation = null;
var selectedNode = null;
var clippingToTimeline = false; // it is the status of checkbox
var showingHighlight = true;
// var shiftView = false;


// Shift Views 

function createD3Graph(graph, parentWidth, parentHeight, pageType) {
    var x = document.getElementById("detail-area-container");
    var y = document.getElementById("d3_svg");
    var z = document.getElementById("d3_selectable_force_directed_graph");
    x.style.display = "none";
    x.style.zIndex = 1;
    
    y.style.display = "block";
    z.style.zIndex = 10;
    var svg = d3v4.select('svg')
    .attr('width', '100%')
    .attr('height', '100%')

    // remove any previous graphs
    svg.selectAll('.g-main').remove();

    var gMain = svg.append('g')
    .classed('g-main', true)

    // add background
    var rect = gMain.append('rect')
    .classed('graph-background', true)
    .attr('width', '100%')
    .attr('height', '100%')

    // add graph
    // give graph a reasonable size and position for different screen sizes / aspect ratios using shallow trickery
    var reasonableScreenSizeScaleMultiple = 1;
    var initXTransform = 1;
    var initYTransform = 1;
    if (pageType == 'faculty') {
        reasonableScreenSizeScaleMultiple = 16000;
        initXTransform = parentWidth / 2;
        initYTransform = parentHeight / 2.5;
    } else {
        reasonableScreenSizeScaleMultiple = 8000;
        initXTransform = parentWidth / 2.5;
        initYTransform = parentHeight / 3.2;
    }
    var initScale = Math.max(parentWidth, parentHeight) / (reasonableScreenSizeScaleMultiple);

    var gDraw = gMain.append('g')
    .attr("transform","translate("+ initXTransform + ", " + initYTransform + ") scale(" + initScale + ")");

    // add Y axis
    // map domain to range
    var yScale = d3v4.scaleLinear()
    .domain([parentHeight - 96, 96]) // unit:
    .range([parentHeight - 96, 96]); // unit:

    var yAxis = createYAxis(yScale)
    
    yAxisG = gMain.append("g")
    .classed('y-axis', true)
    .call(yAxis)
    .attr("opacity", 0)
    .attr("transform", "translate(" + (parentWidth * 0.08 + 38) + "," + 0 + ")");

    // Add zoom callback
    var zoom = d3v4.zoom()
    .on('zoom', zoomed);
    gMain.call(zoom).call(zoom.transform, d3v4.zoomIdentity.translate(initXTransform, initYTransform).scale(initScale));

    function zoomed() {
        gDraw.attr('transform', d3v4.event.transform);
        var newYScale = d3v4.event.transform.rescaleY(yScale);
        yAxisG.call(createYAxis(newYScale))
    }

    // Add resize callback
    window.addEventListener('resize', function() {
        var graphContainer = document.getElementById("d3_selectable_force_directed_graph")
        yAxisG.attr("transform", "translate(" + (graphContainer.clientWidth * 0.08 + 38) + "," + 0 + ")");
    });

    // add links
    links = gDraw.append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        // link strength
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
        .attr("stroke", function(d){
            if(d.type == "has_interest") {
                return "rgba(50, 187, 225, 0.959)";
            }
            
            if(d.type == "research_pillar_primary") {
                return "rgba(155, 175, 195, 0)";
            } 
            // parent_primary_major_center_to
            if(d.type == "parent_primary_major_center_to") {
                return "rgba(155, 175, 195, 0.5)";
            }
        }
        )

    // add nodes
    nodes = gDraw.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        // size of node
        .attr("r", function(n) { 

                if(n.labels[0] == "ResearchInterest") {
                    return 20;
                }
                // ResearchInterest_shown
                if(n.labels[0] == "ResearchInterest_shown") {
                    return 60;
                }
                if(n.labels[0] == "Faculty") {
                    return 70;
                }
                if(n.labels[0] == "Faculty_notshown") {
                    return 30;
                }
                if(n.labels[0] == "PrimaryResearchPillar") {
                    return 1200;
                }
                // PrimaryMajorSupport
                if (n.labels[0] == "PrimaryMajorSupport") {
                    return 80;
                }
                // ParentPrimaryMajorSupport
                if (n.labels[0] == "ParentPrimaryMajorSupport") {
                    return 150;
                }

        })
        // color of node
        .attr("fill", function(n) { 

            if(n.labels[0] == "Faculty" || n.labels[0] == "Faculty_notshown") {
                if(n.properties.research_direction == "Mathematics") {return "rgba(88, 49, 244, 0.96)";}
                if(n.properties.research_direction == "Data and computer sciences") {return "rgba(133, 64, 222, 0.96)";}

                if(n.properties.research_direction == "Physics") {return "rgba(0, 51, 204, 0.96)";}
                if(n.properties.research_direction == "Chemistry") {return "rgba(0, 153, 255, 0.96)";}
                if(n.properties.research_direction == "Biology") {return "rgba(41, 202, 127, 0.99)";}

                if(n.properties.research_direction == "Behavioral Science") {return "rgba(14, 169, 3, 0.96)";}
                if(n.properties.research_direction == "Global Health - Biological Sciences") {return "rgba(1, 136, 132, 0.96)";}
                if(n.properties.research_direction == "Environmental Science") {return "rgba(2, 187, 181, 0.96)";}
                // if more than one areas
                return "rgba(149, 45, 183, 0.96)";
            }
            if(n.labels[0] == "ResearchInterest") {
                return "rgba(155, 175, 195, 0.603)";
            }
            
            if(n.labels[0] == "PrimaryResearchPillar") {
                if(n.properties.name == "Biological, behavioral sciences and health") {return "rgba(245, 88, 39, 0.2)";}
                if(n.properties.name == "Math, physical and materials sciences") {return "rgba(39, 245, 63, 0.2)";}
                if(n.properties.name == "Data and computer sciences") {return "rgba(84, 39, 245, 0.2)";}
                if(n.properties.name == "Environmental science and sustainability") {return "rgba(155, 175, 195, 0.2)";}
                return "rgba(155, 175, 195, 0.2)";
            }
            // PrimaryMajorSupport
            if(n.labels[0] == "PrimaryMajorSupport") {
                return "rgba(155, 175, 195, 0)";
            }
            // ParentPrimaryMajorSupport
            if(n.labels[0] == "ParentPrimaryMajorSupport") {
                return "rgba(155, 175, 195, 0.1)";
            }
            // ResearchInterest_shown
            if(n.labels[0] == "ResearchInterest_shown") {
                return "rgba(20, 37, 53, 0.89)";
            }
        })

        .call(d3v4.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
      


    //Display node name when mouse on a node
    nodes.append("title").text(function(n) { return n.properties.name });

    nodeLabels = gDraw.append("g")
        .attr("class", "node-labels")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .text(function(n) { 
            // only if faculty
            if(n.labels[0] == "Faculty") {
                return n.properties.name;
            }

            if(n.labels[0] == "ResearchInterest_shown") {
                //return n.properties.name;
                return n.properties.name.split(" ").map(word => (typeof word[0] === 'string' ? word[0].toUpperCase() : '')).join("");
            }
            // research pillar
            // if(n.labels[0] == "PrimaryResearchPillar") {
            //     return n.properties.name;
            // }

            // PrimaryMajorSupport
            if(n.labels[0] == "PrimaryMajorSupport" || n.labels[0] == "ParentPrimaryMajorSupport") {
                return n.properties.name;
            }
        })
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("opacity", 0.8)
        

        .call(d3v4.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // display node name on the nodes: node labeling

    // create simulation

    // https://stackoverflow.com/questions/47510853/how-to-disable-animation-in-a-force-directed-graph
    simulation = d3v4.forceSimulation()
        .force("link", d3v4.forceLink()
                .id(function(d) { return d.id; })
                .distance(function(d) { return 200;}))
        .force("charge", d3v4.forceManyBody().distanceMin(100).strength(-4500))
        //.force('charge', d3.forceManyBody().strength(-1900).theta(0.5).distanceMax(1500))
        .force("center", d3v4.forceCenter(parentWidth / 2, parentHeight / 2))
        .force("x", d3v4.forceX(parentWidth/2))
        .force("y", d3v4.forceY(parentHeight/2))
        .force("collide", d3.forceCollide().strength([0.3]));

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);
    
    simulation.force("node")
        .texts(graph.links);

    function ticked() {
        // https://observablehq.com/@d3/simulation-tick
        // simulation.tick(n) runs n iterations of a force simulation layout.
        // update node and line positions at every step of the force simulation
        links.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        nodes.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        nodeLabels.attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y-10; });
    }

//------------------------------------------
// interactions
//------------------------------------------

    // click
    rect.on('click', () => {
        resetSelectedNode(nodes, links);
    });

    // drag
    function dragstarted(d) {
        if (!d3v4.event.active) simulation.alphaTarget(0.9).restart();

        setSelectedNode(d, nodes, links);

        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx += d3v4.event.dx;
        d.fy += d3v4.event.dy;
    }

    function dragended(d) {
        if (!d3v4.event.active) simulation.alphaTarget(0);

        d.fx = null;

        if(clippingToTimeline) {
            d.fy = d.savedFy;
        } else {
            d.fy = null;
        }
    }
};

// y axis
function createYAxis(scale) {
    return d3v4.axisLeft(scale)
    .ticks(10)
    .tickFormat(function(d) {
        var yearsAd = Math.floor(2000 - d);
        if(yearsAd >= 0) {
            return yearsAd + "";
        } else {
            return Math.abs(yearsAd) + " BC"
        }
    })
}

// select node
// input the clicked node and the graph
function setSelectedNode(node, allNodes, allLinks) {
    // do nothings if no new click
    if(selectedNode === node) return;
    // if(selectedNode != null) {
    //     allLinks.classed("influences", false);
    //     allLinks.classed("influenced-by", false);
    // }
    // select node that is clicked
    allNodes.classed("selected", function(n){ return n.id == node.id});
    allNodes.classed("not-selected", function(n){ return n.id != node.id});
    // select link about influence
    // define source and target
    // allLinks.classed("influenced-by", function(l){ return l.source.id == node.id})
    // allLinks.classed("influences", function(l){ return l.target.id == node.id})

    // if the node is faculty, show info
    if(node.labels[0] == "Faculty" || node.labels[0] == "Faculty_notshown") {
        showPeopleInfo(node);
        selectedNode = node;
    }
    if(node.labels[0] == "ResearchInterest" || node.labels[0] == "ResearchInterest_shown") {
        showConceptInfo(node, "ResearchInterest");
        selectedNode = node;
    }
    // PrimaryPillar
    if(node.labels[0] == "PrimaryResearchPillar") {
        showConceptInfo(node, "ResearchPillar");
        selectedNode = node;
    }
    // PrimaryMajorSupport
    if(node.labels[0] == "PrimaryMajorSupport") {
        showConceptInfo(node, "TeachingMajor");
        selectedNode = node;
    }
    // ParentPrimaryMajorSupport
    if(node.labels[0] == "ParentPrimaryMajorSupport") {
        showConceptInfo(node, "TeachingFaculty");
        selectedNode = node;
    }
       
}

function resetSelectedNode(allNodes, allLinks) {
    selectedNode = null;
    allNodes.classed("selected", false);
    allLinks.classed("influences", false);
    allLinks.classed("influenced-by", false);
}

// info board
function showPeopleInfo(node) {
    
    $('.modal').modal('open');
    // $('#PeopleImg').attr("src", node.img); 
    //$('#PeopleName').attr("href", "here is a link!" + node.id);
    $('#PeopleName').text(node.properties.name);
    $('#PeopleDescription')
        .html(
            "<br/><i><strong>"+ node.properties.title + " at " + node.properties.affiliation + "</i></strong>"+
            "<br/><i><strong>"+ node.properties.division + " Division </i></strong>" +
            "<br/><i>"+ node.properties.email  +"</i>" +
            "<br/><i>Personal Website: "+ "<a href=\"" + node.properties.website_link + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + node.properties.website_link + "<a/>"  +"</i>" + "<br>" +
            "<br/><strong>Primary Research Direction</strong>: <i>"+ node.properties.research_direction + "</i>" +
            "<br/><strong>Research Pillar</strong>: <i><br>Primary - "+ node.properties.research_pillar_primary + "<br>Secondary - "+ node.properties.research_pillar_secondary +"</i>" +
            "<br/><strong>Research Interests</strong>: <br/><i>"+ node.properties.research_interest + "</i>" +

            "<br/><br/><strong>Support Major</strong>: <i>"+ node.properties.major_support_primary + " (primary), "+ node.properties.major_support_secondary +" (secondary)</i>" +
            "<br><strong>Teaching</strong>: " + node.properties.course_taught 
            // + "<br/><strong>Advising</strong>: to be updated!<br/>"
        );
}

function showConceptInfo(node, nodeType) {
    
    $('.modal').modal('open');
    // $('#PeopleImg').attr("src", node.img); 
    // $('#PeopleName').attr("href", "here is a link!" + node.id);
    $('#PeopleName').text(node.properties.name);
    var desc = ""
    if (nodeType == "ResearchPillar") {
        desc = "<br/> Click a faculty's name to find out his or her research areas and interests.  <br>"
    } else if (nodeType == "ResearchInterest") {
        desc = "<br/> Please contact he/she to get the details of this research interest. <br>"
    } else if (nodeType == "TeachingMajor") {
        desc = "<br/> This is a track. Click a node (small dot) linking to this node for the information about the faculty who teaches courses for this track. <br>"
    } else if (nodeType == "TeachingFaculty") {
        desc = "<br/> This is a major. Click a linking node to see a track under this major. <br>"
    }
    $('#PeopleDescription')
        .html(
            desc
        );
}


// =================================================================
// highlightt


function highlightNode(checkboxStatus) {

    var color = ["rgb(255, 188, 43)", "rgba(48, 87, 186, 0.959)"];

    // is just a bool
    if(checkboxStatus ) {
        
        nodes.attr("fill", function(d) { return color[d.gender]; });
        showingHighlight = true;
    } else {
        
        nodes.attr("fill", function(d) { return color[1];});
        showingHighlight = false;
    }
}

function onClickHighlightNode() {
    var checkBox = document.getElementById("onClickHighlightNode");
    // checkBox.checked == true => checked
    // checkBox.checked == false => unchecked
    highlightNode(checkBox.checked);
}


// =================================================================
// search 

function searchByName() {
    // get strings in search bar
    var searchTerm = document.getElementById("search").value;
    // color 
    nodes.classed("search-match", function(n){
        if(searchTerm.length == 0) {
            return false;
        } else {
            return n.properties.name.toLowerCase().includes(searchTerm.toLowerCase());
        } 
    });
    // Not matched
    nodes.classed("not-search-match", function(n){
        if(searchTerm.length == 0) {
            return false;
        } else {
            return !n.properties.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });
}



