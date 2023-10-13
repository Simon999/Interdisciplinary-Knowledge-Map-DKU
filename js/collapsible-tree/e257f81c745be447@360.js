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

function _data(FileAttachment){return({
  "name": "Area",
  "children": [
    {
      "name": "Biological, behavioral sciences and health",
      "children": [
        {
          "name": "Biochemistry & molecular biology",
          "children": [
            {
              "name": "Mark Spaller",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/mark-spaller"
            }
          ]
        },
        {
          "name": "Biology",
          "children": [
            {
              "name": "Sajid Umar",
              "url": "https://newstatic.dukekunshan.edu.cn/dkumain/wp-content/uploads/2022/05/25170246/CV-SAJID-UMAR-2022.pdf"
            },
            {
              "name": "Yiu Wing Kam",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yiu-wing-jason-kam"
            }
          ]
        },
        {
          "name": "Green & sustainable science & technology",
          "children": [
            {
              "name": "Ka Leung Lam",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ka-leung-lam"
            },
            {
              "name": "William Winner",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/william-winner"
            }
          ]
        },
        {
          "name": "Molecular biology",
          "children": [
            {
              "name": "Anastasia Tsigkou",
              "url": "https://euraxess.ec.europa.eu/worldwide/china/network-european-researchers-biology-and-medicine-china"
            },
            {
              "name": "Eunyu Kim",
              "url": "https://eunyukimlab.com/"
            },
            {
              "name": "Ferdinand Kappes",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ferdinand-kappes"
            },
            {
              "name": "Huansheng Cao",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
            },
            {
              "name": "Hyun-Min Kim",
              "url": "https://sites.duke.edu/kimlab"
            },
            {
              "name": "Jianbo Yue",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/jianbo-yue"
            },
            {
              "name": "Joohyun Lee",
              "url": "jleelab.org"
            },
            {
              "name": "Linfeng Huang",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/linfeng-huang; http://www.pro-sirna.com/lab/"
            },
            {
              "name": "Xiangdong Gao",
              "url": NaN
            },
            {
              "name": "Xianzhi Lin",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xianzhi-lin"
            }
          ]
        },
        {
          "name": "Neurosciences",
          "children": [
            {
              "name": "Pedro Rada",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/pedro-rada"
            },
            {
              "name": "Sze Chai Kwok",
              "url": "http://www.kwoklab.org/"
            }
          ]
        },
        {
          "name": "Psychology, biological",
          "children": [
            {
              "name": "Eric Chen",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chia-chien-eric-chen"
            },
            {
              "name": "Shan Wang",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/shan-wang"
            }
          ]
        }
      ]
    },
    {
      "name": "Data and computer sciences",
      "children": [
        {
          "name": "Artificial intelligence",
          "children": [
            {
              "name": "Bing Luo",
              "url": "https://luobing1008.github.io/"
            },
            {
              "name": "Feng Tian",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/feng-tian/"
            },
            {
              "name": "Kaizhu Huang",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kaizhu-huang"
            },
            {
              "name": "Ming Li",
              "url": "https://scholars.duke.edu/person/MingLi"
            },
            {
              "name": "Ming-chun Huang",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ming-chun-huang"
            },
            {
              "name": "Mustafa Misir",
              "url": "http://mustafamisir.github.io"
            }
          ]
        },
        {
          "name": "Computer communication",
          "children": [
            {
              "name": "Peng Sun",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/peng-sun"
            }
          ]
        },
        {
          "name": "Data mining",
          "children": [
            {
              "name": "Pengzhan Guo",
              "url": "http://pengzhanguo.github.io"
            }
          ]
        },
        {
          "name": "Software engineering",
          "children": [
            {
              "name": "Jiang Long",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/jiang-long"
            }
          ]
        }
      ]
    },
    {
      "name": "Environmental science and sustainability",
      "children": [
        {
          "name": "Environmental science",
          "children": [
            {
              "name": "Chi-Yeung(Jimmy) Choi",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chi-yeung-jimmy-choi"
            },
            {
              "name": "Chuanhui Gu",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chuanhui-gu"
            },
            {
              "name": "Ding Ma",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ding-ma"
            },
            {
              "name": "Renee Richer",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/renee-richer"
            },
            {
              "name": "Song Gao",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/song-gao"
            },
            {
              "name": "Ya-Jou Chen",
              "url": "https://cyj-environmental-microbiology-lab.webnode.page"
            },
            {
              "name": "Zuchuan Li",
              "url": "https://scholars.duke.edu/person/zuchuan.li"
            }
          ]
        },
        {
          "name": "Green & sustainable science & technology",
          "children": [
            {
              "name": "Ka Leung Lam",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ka-leung-lam"
            },
            {
              "name": "William Winner",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/william-winner"
            }
          ]
        },
        {
          "name": "Materials science, coatings & films",
          "children": [
            {
              "name": "Kwang Leong Choy",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kwang-leong-choy/"
            }
          ]
        },
        {
          "name": "Molecular biology",
          "children": [
            {
              "name": "Anastasia Tsigkou",
              "url": "https://euraxess.ec.europa.eu/worldwide/china/network-european-researchers-biology-and-medicine-china"
            },
            {
              "name": "Eunyu Kim",
              "url": "https://eunyukimlab.com/"
            },
            {
              "name": "Ferdinand Kappes",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ferdinand-kappes"
            },
            {
              "name": "Huansheng Cao",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
            },
            {
              "name": "Hyun-Min Kim",
              "url": "https://sites.duke.edu/kimlab"
            },
            {
              "name": "Jianbo Yue",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/jianbo-yue"
            },
            {
              "name": "Joohyun Lee",
              "url": "jleelab.org"
            },
            {
              "name": "Linfeng Huang",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/linfeng-huang; http://www.pro-sirna.com/lab/"
            },
            {
              "name": "Xiangdong Gao",
              "url": NaN
            },
            {
              "name": "Xianzhi Lin",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xianzhi-lin"
            }
          ]
        },
        {
          "name": "Polymer science",
          "children": [
            {
              "name": "Tan Zhang",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/tan-zhang"
            },
            {
              "name": "Xinrong Lin",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xinrong-lin/"
            }
          ]
        },
        {
          "name": "Psychiatry",
          "children": [
            {
              "name": "Rebecca Hock",
              "url": "https://dku-cn.academia.edu/RebeccaHockPhD"
            }
          ]
        }
      ]
    },
    {
      "name": "Math, physical and materials sciences",
      "children": [
        {
          "name": "Applied math",
          "children": [
            {
              "name": "Konstantinos Efstathiou",
              "url": "https://www.efstathiou.gr/"
            },
            {
              "name": "Marcus Werner",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/marcus-werner"
            },
            {
              "name": "Shixin Xu",
              "url": "https://sites.google.com/site/shixinxupage/"
            },
            {
              "name": "Xiaoqian Xu",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xiaoqian-xu"
            }
          ]
        },
        {
          "name": "Biophysics",
          "children": [
            {
              "name": "Domna Kotsifaki",
              "url": "https://dkotsifaki.weebly.com/"
            }
          ]
        },
        {
          "name": "Chemistry, medicinal",
          "children": [
            {
              "name": "Floyd Beckford",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/floyd-beckford"
            }
          ]
        },
        {
          "name": "Education & educational research",
          "children": [
            {
              "name": "Paul Stanley",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/paul-stanley"
            }
          ]
        },
        {
          "name": "Materials science, biomaterials",
          "children": [
            {
              "name": "Weiwei Shi",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/weiwei-shi"
            }
          ]
        },
        {
          "name": "Materials science, characterization & testing",
          "children": [
            {
              "name": "Changcheng Zheng",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/changcheng-zheng"
            }
          ]
        },
        {
          "name": "Materials science, multidisciplinary",
          "children": [
            {
              "name": "Xiawa Wang",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xiawa-wang"
            }
          ]
        },
        {
          "name": "Mathematics, interdisciplinary applications",
          "children": [
            {
              "name": "Dangxing Chen",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/dangxing-chen"
            },
            {
              "name": "Pascal Grange",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/pascal-grange"
            }
          ]
        },
        {
          "name": "Physics, condensed matter",
          "children": [
            {
              "name": "Myung-Joong Hwang",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/myung-joong-hwang"
            }
          ]
        },
        {
          "name": "Physics, multidisciplinary",
          "children": [
            {
              "name": "Kai Huang",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kai-huang"
            }
          ]
        },
        {
          "name": "Pure math",
          "children": [
            {
              "name": "Zhenghui Huo",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zhenghui-huo"
            }
          ]
        },
        {
          "name": "Statistics & probability",
          "children": [
            {
              "name": "Dongmian Zou",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/dongmian-zou"
            },
            {
              "name": "Italo Simonelli",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/italo-simonelli"
            },
            {
              "name": "Lin Jiu",
              "url": "https://jiulin90.github.io/"
            },
            {
              "name": "Xingshi Cai",
              "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xingshi-cai"
            }
          ]
        },
        {
          "name": "Statistics and probability",
          "children": [
            {
              "name": "Cristiano Villa",
              "url": "Cristiano Villa | Scholars@Duke profile"
            }
          ]
        }
      ]
    }
  ]
})}

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
