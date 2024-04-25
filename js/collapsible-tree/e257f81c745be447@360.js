// https://observablehq.com/@d3/collapsible-tree@360
function _1(md){return(
md`# Collapsible Tree

Click a black node to expand or collapse [the tree](/@d3/tidy-tree).`
)}
var rootGlobal = null;
var treeGlobal = null;
var svgGlobal = null;
var diagonalGlobal = null;
var marginGlobal = null;
var widthGlobal = null;
var dxGloabl = null;


import {research_tree_data } from "../data/research-tree.js";
console.log(research_tree_data);

function _chart(d3,data,dy,margin,width,dx,tree,diagonal)
{
  const root = d3.hierarchy(data);
  rootGlobal = root;
  treeGlobal = tree;
  marginGlobal = margin;
  widthGlobal = width;
  dxGloabl = dx;
  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });
  
  var diagonalGlobal = diagonal;
  // zoom according to the screen size
  width = width / (width / 1024);
  const svg = d3.create("svg")
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("font", "11px sans-serif")
      .style("user-select", "none");
  svgGlobal = svg;
  
  const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

  const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

  function update(source) {
    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + margin.top + margin.bottom;

    const transition = svg.transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    nodes.forEach(function(d) {
      if (d.depth < 3) {
        d.y = d.depth * (width / 4.5);
      } else{
        d.y = (d.depth - 1) * (width / 4.5) + width / 3;
      }
    });

    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        ;

    nodeEnter.append("circle")
        .attr("r", 4.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

    nodeEnter.append("text")
        .on("click", (event, d) => {
          if (d._children == null) {
            //location.href=d.data.url;
            window.open(d.data.url, "_blank");
          } else {
            d.children = d.children ? null : d._children;
            update(d);
          }
        })
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? 6 : 6)
        .attr("text-anchor", d => d._children ? "start" : "start")
        .text(d => d.data.name)
        .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white")
        ;

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  update(root);

  return svg.node();
}


function _diagonal(d3){return(
d3.linkHorizontal().x(d => d.y).y(d => d.x)
)}

function _tree(d3,dx,dy){return(
d3.tree().nodeSize([dx, dy])
)}

function _data(FileAttachment){return(research_tree_data)}

function _dx(){return(
30
)}

function _dy(width){return(
width / 6
)}

function _margin(){return(
{top: 10, right: 120, bottom: 10, left: 40}
)}

function _d3(require){return(
require("d3@6")
)}

export function searchTreeByName() {
  var searchText = document.getElementById("search").value;
  var paths = searchTree(rootGlobal, searchText,[]);
  if(typeof(paths) !== "undefined"){
      openPaths(paths);
  }
  else{
      alert(searchText + " not found!");
  }
}

function openPaths(paths){
  var fullPath = '';
  for(var i=0;i<paths.length;i++){
      fullPath += paths[i].data.name + '/';
      if(paths[i].id !== "1"){//i.e. not root
          paths[i].class = 'found';
          if(paths[i]._children){ //if children are hidden: open them, otherwise: don't do anything
              paths[i].children = paths[i]._children;
              paths[i]._children = null;
          }
          //update(paths[i], treeGlobal, rootGlobal, svgGlobal, diagonalGlobal, marginGlobal, widthGlobal, dxGloabl);
      }
  }
  alert("Found, the path is: " + fullPath);
}

function searchTree(obj,search,path){
  //alert("obj.data.name:" + obj.data.name);
  if(obj.data.name.trim().toLowerCase() === search.trim().toLowerCase()){ //if search is found return, add the object to the path and return it
      path.push(obj);
      return path;
  }
  else if(obj.children || obj._children){ //if children are collapsed d3 object will have them instantiated as _children
     var children = (obj.children) ? obj.children : obj._children;
     for(var i=0;i<children.length;i++){
          path.push(obj);// we assume this path is the right one
          var found = searchTree(children[i],search,path);
          if(found){// we were right, this should return the bubbled-up path from the first if statement
              return found;
          }
          else{//we were wrong, remove this parent from the path and continue iterating
              path.pop();
          }
      }
  }
  else{//not the right object, return false so it will continue to iterate in the loop
      return false;
  }
}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  // const fileAttachments = new Map([
  //   ["flare-2.json", {url: new URL("./flare-2.json", import.meta.url), mimeType: "application/json", toString}]
  // ]);
  main.builtin("FileAttachment", "flare-2.json");
  //main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["d3","data","dy","margin","width","dx","tree","diagonal"], _chart);
  main.variable(observer("diagonal")).define("diagonal", ["d3"], _diagonal);
  main.variable(observer("tree")).define("tree", ["d3","dx","dy"], _tree);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("dx")).define("dx", _dx);
  main.variable(observer("dy")).define("dy", ["width"], _dy);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
