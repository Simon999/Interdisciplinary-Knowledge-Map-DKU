// https://observablehq.com/@d3/collapsible-tree@360
function _1(md){return(
md`# Collapsible Tree

Click a black node to expand or collapse [the tree](/@d3/tidy-tree).`
)}

function _chart(d3,data,dy,margin,width,dx,tree,diagonal)
{
  const root = d3.hierarchy(data);

  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });

  const svg = d3.create("svg")
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("font", "10px sans-serif")
      .style("user-select", "none");

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
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        ;

    nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

    nodeEnter.append("text")
        .on("click", (event, d) => {
          if (d._children == null) {
            location.href=d.data.url;
          }
        })
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
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

function _data(FileAttachment){return(
  {
    "name": "Area",
    "children": [
      {
        "name": "Biological, Behavioral sciences and Health",
        "children": [
          {
            "name": "BIOCHEMISTRY & MOLECULAR BIOLOGY",
            "children": [
              {
                "name": "Kwang Leong Choy",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kwang-leong-choy/"
              }
            ]
          },
          {
            "name": "Biology",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              },
              {
                "name": "Sajid Umar",
                "url": NaN
              }
            ]
          },
          {
            "name": "Green & Sustainable Science & Technology",
            "children": [
              {
                "name": "Ding Ma",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ma-ding/"
              },
              {
                "name": "Yiu Wing Kam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kam-yiu-wing-jason/"
              }
            ]
          },
          {
            "name": "Molecular Biology",
            "children": [
              {
                "name": "Andrew Lin",
                "url": NaN
              },
              {
                "name": "Eunyu Kim",
                "url": "http://eunyu.kim.lab.com/"
              },
              {
                "name": "Ferdinand Kappes",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kappes-ferdinand/"
              },
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              },
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              },
              {
                "name": "Joohyun Lee",
                "url": "jleelab.org"
              },
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              },
              {
                "name": "Linfeng Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-linfeng/"
              },
              {
                "name": "Renee Richer",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/richer-renee/"
              }
            ]
          },
          {
            "name": "NEUROSCIENCES",
            "children": [
              {
                "name": "Eric Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-chia-chien-eric/"
              },
              {
                "name": "Pedro Rada",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/rada-pedro/"
              }
            ]
          },
          {
            "name": "PSYCHOLOGY, BIOLOGICAL",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              },
              {
                "name": "Szechai Kwok",
                "url": "http://www.kwoklab.org/"
              }
            ]
          }
        ]
      },
      {
        "name": "Data and computer sciences",
        "children": [
          {
            "name": "COMPUTER SCIENCE",
            "children": [
              {
                "name": "Anastasia Tsigkou",
                "url": "https://euraxess.ec.europa.eu/worldwide/china/network-european-researchers-biology-and-medicine-china"
              },
              {
                "name": "Bing Luo",
                "url": "https://luobing1008.github.io/"
              },
              {
                "name": "Feng Tian",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/tian-feng/"
              },
              {
                "name": "Jiang Long",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/long-jiang/"
              },
              {
                "name": "Ming Li",
                "url": "https://scholars.duke.edu/person/MingLi"
              },
              {
                "name": "Ming-chun Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-ming-chun/"
              },
              {
                "name": "Mustafa Misir",
                "url": "http://mustafamisir.github.io"
              },
              {
                "name": "Peng Sun",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/sun-peng/"
              },
              {
                "name": "Pengzhan Guo",
                "url": "http://pengzhanguo.github.io"
              }
            ]
          }
        ]
      },
      {
        "name": "Environmental science and sustainability",
        "children": [
          {
            "name": "ENVIRONMENTAL SCIENCES",
            "children": [
              {
                "name": "Chi-Yeung(Jimmy) Choi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/choi-chi-yeung-jimmy/"
              },
              {
                "name": "Ka Leung Lam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/lam-ka-leung/"
              },
              {
                "name": "Zuchuan Li",
                "url": "https://sites.duke.edu/sagdku/"
              }
            ]
          },
          {
            "name": "Environmental Science",
            "children": [
              {
                "name": "Floyd Beckford",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/beckford-floyd/"
              },
              {
                "name": "William Winner",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/winner-william/"
              }
            ]
          },
          {
            "name": "Environmental science",
            "children": [
              {
                "name": "Hyun-Min Kim",
                "url": "https://sites.duke.edu/kimlab"
              }
            ]
          },
          {
            "name": "Green & Sustainable Science & Technology",
            "children": [
              {
                "name": "Ding Ma",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ma-ding/"
              },
              {
                "name": "Yiu Wing Kam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kam-yiu-wing-jason/"
              }
            ]
          },
          {
            "name": "MATERIALS SCIENCE, COATINGS & FILMS",
            "children": [
              {
                "name": "Xinrong Lin",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xinrong-lin/"
              }
            ]
          },
          {
            "name": "Molecular Biology",
            "children": [
              {
                "name": "Andrew Lin",
                "url": NaN
              },
              {
                "name": "Eunyu Kim",
                "url": "http://eunyu.kim.lab.com/"
              },
              {
                "name": "Ferdinand Kappes",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kappes-ferdinand/"
              },
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              },
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              },
              {
                "name": "Joohyun Lee",
                "url": "jleelab.org"
              },
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              },
              {
                "name": "Linfeng Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-linfeng/"
              },
              {
                "name": "Renee Richer",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/richer-renee/"
              }
            ]
          },
          {
            "name": "POLYMER SCIENCE",
            "children": [
              {
                "name": "Mark Spaller",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/spaller-mark/"
              },
              {
                "name": "Shan Wang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/wang-shan/"
              }
            ]
          },
          {
            "name": "PSYCHIATRY",
            "children": [
              {
                "name": "Chuanhui Gu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gu-chuanhui/"
              }
            ]
          }
        ]
      },
      {
        "name": "Math, physical and materials sciences",
        "children": [
          {
            "name": "Applied Math",
            "children": [
              {
                "name": "Konstantinos Efstathiou",
                "url": "https://www.efstathiou.gr/"
              },
              {
                "name": "Marcus Werner",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/werner-marcus/"
              },
              {
                "name": "Shixin Xu",
                "url": "https://sites.google.com/site/shixinxupage/"
              },
              {
                "name": "Xiaoqian Xu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xu-xiaoqian/"
              }
            ]
          },
          {
            "name": "BIOPHYSICS",
            "children": [
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "CHEMISTRY, MEDICINAL",
            "children": [
              {
                "name": "Weiwei Shi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/shi-weiwei/"
              }
            ]
          },
          {
            "name": "CHEMISTRY, PHYSICAL",
            "children": [
              {
                "name": "Song Gao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gao-song/"
              }
            ]
          },
          {
            "name": "EDUCATION & EDUCATIONAL RESEARCH",
            "children": [
              {
                "name": "Changcheng Zheng",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zheng-changcheng/"
              }
            ]
          },
          {
            "name": "MATERIALS SCIENCE, BIOMATERIALS",
            "children": [
              {
                "name": "Tan Zhang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zhang-tan/"
              }
            ]
          },
          {
            "name": "MATERIALS SCIENCE, CHARACTERIZATION & TESTING",
            "children": [
              {
                "name": "Xiawa Wang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/wang-xiawa/"
              }
            ]
          },
          {
            "name": "MATERIALS SCIENCE, MULTIDISCIPLINARY",
            "children": [
              {
                "name": "Myung-Joong Hwang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/hwang-myung-joong/"
              }
            ]
          },
          {
            "name": "MATHEMATICS, INTERDISCIPLINARY APPLICATIONS",
            "children": [
              {
                "name": "Dangxing Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-dang-xing/"
              },
              {
                "name": "Pascal Grange",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/grange-pascal/"
              }
            ]
          },
          {
            "name": "PHYSICS, CONDENSED MATTER",
            "children": [
              {
                "name": "Domna Kotsifaki",
                "url": "https://dkotsifaki.weebly.com/"
              }
            ]
          },
          {
            "name": "PHYSICS, MULTIDISCIPLINARY",
            "children": [
              {
                "name": "Paul Stanley",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/stanley-paul/"
              }
            ]
          },
          {
            "name": "Pure Math",
            "children": [
              {
                "name": "Zhe Liu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/liu-zhe/"
              },
              {
                "name": "Zhenghui Huo",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huo-zhenghui/"
              }
            ]
          },
          {
            "name": "STATISTICS & PROBABILITY",
            "children": [
              {
                "name": "Dongmian Zou",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zou-dongmian/"
              },
              {
                "name": "Italo Simonelli",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/simonelli-italo/"
              },
              {
                "name": "Lin Jiu",
                "url": "https://jiulin90.github.io/"
              },
              {
                "name": "Xingshi Cai",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cai-xing-shi/"
              }
            ]
          }
        ]
      }
    ]
  }
)}

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
