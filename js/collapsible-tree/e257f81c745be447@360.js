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
        "name": "Math, physical and materials sciences",
        "children": [
          {
            "name": "Mathematical physics",
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
                "name": "Paul Stanley",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/stanley-paul/"
              }
            ]
          },
          {
            "name": "Dynamical system",
            "children": [
              {
                "name": "Konstantinos Efstathiou",
                "url": "https://www.efstathiou.gr/"
              }
            ]
          },
          {
            "name": "Nonlinear dynamics",
            "children": [
              {
                "name": "Konstantinos Efstathiou",
                "url": "https://www.efstathiou.gr/"
              },
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "stochastic process",
            "children": [
              {
                "name": "Konstantinos Efstathiou",
                "url": "https://www.efstathiou.gr/"
              }
            ]
          },
          {
            "name": "General relativistic theory",
            "children": [
              {
                "name": "Marcus Werner",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/werner-marcus/"
              }
            ]
          },
          {
            "name": "Gravitational waves",
            "children": [
              {
                "name": "Marcus Werner",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/werner-marcus/"
              }
            ]
          },
          {
            "name": "astrophysics",
            "children": [
              {
                "name": "Marcus Werner",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/werner-marcus/"
              }
            ]
          },
          {
            "name": "Topology",
            "children": [
              {
                "name": "Marcus Werner",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/werner-marcus/"
              }
            ]
          },
          {
            "name": "Mathematical modeling",
            "children": [
              {
                "name": "Shixin Xu",
                "url": "https://sites.google.com/site/shixinxupage/"
              }
            ]
          },
          {
            "name": "Biophysics",
            "children": [
              {
                "name": "Shixin Xu",
                "url": "https://sites.google.com/site/shixinxupage/"
              },
              {
                "name": "Domna Kotsifaki",
                "url": "https://dkotsifaki.weebly.com/"
              },
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "Fluid mechanics",
            "children": [
              {
                "name": "Shixin Xu",
                "url": "https://sites.google.com/site/shixinxupage/"
              }
            ]
          },
          {
            "name": "Machine learning",
            "children": [
              {
                "name": "Shixin Xu",
                "url": "https://sites.google.com/site/shixinxupage/"
              },
              {
                "name": "Ming Li",
                "url": "https://scholars.duke.edu/person/MingLi"
              },
              {
                "name": "Mustafa Misir",
                "url": "http://mustafamisir.github.io"
              },
              {
                "name": "Pengzhan Guo",
                "url": "http://pengzhanguo.github.io"
              },
              {
                "name": "Chi-Yeung(Jimmy) Choi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/choi-chi-yeung-jimmy/"
              },
              {
                "name": "Zuchuan Li",
                "url": "https://sites.duke.edu/sagdku/"
              }
            ]
          },
          {
            "name": "Complex fluids",
            "children": [
              {
                "name": "Shixin Xu",
                "url": "https://sites.google.com/site/shixinxupage/"
              }
            ]
          },
          {
            "name": "Mixing",
            "children": [
              {
                "name": "Shixin Xu",
                "url": "https://sites.google.com/site/shixinxupage/"
              }
            ]
          },
          {
            "name": "Murray \u00a8C von Neumann Algebras",
            "children": [
              {
                "name": "Zhe Liu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/liu-zhe/"
              }
            ]
          },
          {
            "name": "Analysis",
            "children": [
              {
                "name": "Zhe Liu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/liu-zhe/"
              }
            ]
          },
          {
            "name": "Operator algebra",
            "children": [
              {
                "name": "Zhe Liu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/liu-zhe/"
              }
            ]
          },
          {
            "name": "Probability",
            "children": [
              {
                "name": "Italo Simonelli",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/simonelli-italo/"
              }
            ]
          },
          {
            "name": "Statistics",
            "children": [
              {
                "name": "Italo Simonelli",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/simonelli-italo/"
              },
              {
                "name": "Zuchuan Li",
                "url": "https://sites.duke.edu/sagdku/"
              }
            ]
          },
          {
            "name": "Combinatorics",
            "children": [
              {
                "name": "Italo Simonelli",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/simonelli-italo/"
              },
              {
                "name": "Xingshi Cai",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cai-xing-shi/"
              },
              {
                "name": "Lin Jiu",
                "url": "https://jiulin90.github.io/"
              }
            ]
          },
          {
            "name": "Graph theory",
            "children": [
              {
                "name": "Italo Simonelli",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/simonelli-italo/"
              }
            ]
          },
          {
            "name": "Game theory",
            "children": [
              {
                "name": "Italo Simonelli",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/simonelli-italo/"
              }
            ]
          },
          {
            "name": "Self-organization",
            "children": [
              {
                "name": "Italo Simonelli",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/simonelli-italo/"
              }
            ]
          },
          {
            "name": "Symmetry",
            "children": [
              {
                "name": "Italo Simonelli",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/simonelli-italo/"
              }
            ]
          },
          {
            "name": "applied math",
            "children": [
              {
                "name": "Xiaoqian Xu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xu-xiaoqian/"
              }
            ]
          },
          {
            "name": "partial differential equations",
            "children": [
              {
                "name": "Xiaoqian Xu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xu-xiaoqian/"
              }
            ]
          },
          {
            "name": "fluid dynamics",
            "children": [
              {
                "name": "Xiaoqian Xu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xu-xiaoqian/"
              }
            ]
          },
          {
            "name": "active scalar",
            "children": [
              {
                "name": "Xiaoqian Xu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xu-xiaoqian/"
              }
            ]
          },
          {
            "name": "mixing",
            "children": [
              {
                "name": "Xiaoqian Xu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xu-xiaoqian/"
              }
            ]
          },
          {
            "name": "time-fractional equations",
            "children": [
              {
                "name": "Xiaoqian Xu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xu-xiaoqian/"
              }
            ]
          },
          {
            "name": "Probabilistic",
            "children": [
              {
                "name": "Xingshi Cai",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cai-xing-shi/"
              }
            ]
          },
          {
            "name": "random graphs",
            "children": [
              {
                "name": "Xingshi Cai",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cai-xing-shi/"
              }
            ]
          },
          {
            "name": "random trees",
            "children": [
              {
                "name": "Xingshi Cai",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cai-xing-shi/"
              }
            ]
          },
          {
            "name": "randomized algorithms",
            "children": [
              {
                "name": "Xingshi Cai",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cai-xing-shi/"
              }
            ]
          },
          {
            "name": "algorithm",
            "children": [
              {
                "name": "Xingshi Cai",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cai-xing-shi/"
              }
            ]
          },
          {
            "name": "probability",
            "children": [
              {
                "name": "Xingshi Cai",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cai-xing-shi/"
              }
            ]
          },
          {
            "name": "Discrete math",
            "children": [
              {
                "name": "Xingshi Cai",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cai-xing-shi/"
              }
            ]
          },
          {
            "name": "Symbolic Computation",
            "children": [
              {
                "name": "Lin Jiu",
                "url": "https://jiulin90.github.io/"
              }
            ]
          },
          {
            "name": "Number Theory",
            "children": [
              {
                "name": "Lin Jiu",
                "url": "https://jiulin90.github.io/"
              }
            ]
          },
          {
            "name": "Special Functions",
            "children": [
              {
                "name": "Lin Jiu",
                "url": "https://jiulin90.github.io/"
              }
            ]
          },
          {
            "name": "Complex analysis",
            "children": [
              {
                "name": "Zhenghui Huo",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huo-zhenghui/"
              }
            ]
          },
          {
            "name": "Harmonic analysis",
            "children": [
              {
                "name": "Zhenghui Huo",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huo-zhenghui/"
              }
            ]
          },
          {
            "name": "Operator theory",
            "children": [
              {
                "name": "Zhenghui Huo",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huo-zhenghui/"
              }
            ]
          },
          {
            "name": "Bergman kernal function",
            "children": [
              {
                "name": "Zhenghui Huo",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huo-zhenghui/"
              }
            ]
          },
          {
            "name": "financial mathematics",
            "children": [
              {
                "name": "Dangxing Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-dang-xing/"
              }
            ]
          },
          {
            "name": "numerical analysis",
            "children": [
              {
                "name": "Dangxing Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-dang-xing/"
              }
            ]
          },
          {
            "name": "fast algorithms",
            "children": [
              {
                "name": "Dangxing Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-dang-xing/"
              }
            ]
          },
          {
            "name": "computational physics",
            "children": [
              {
                "name": "Dangxing Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-dang-xing/"
              }
            ]
          },
          {
            "name": "computational quantum chemistry",
            "children": [
              {
                "name": "Dangxing Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-dang-xing/"
              }
            ]
          },
          {
            "name": "Mathematical finance",
            "children": [
              {
                "name": "Dangxing Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-dang-xing/"
              }
            ]
          },
          {
            "name": "parallel computing",
            "children": [
              {
                "name": "Dangxing Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-dang-xing/"
              }
            ]
          },
          {
            "name": "Applied Harmonic Analysis",
            "children": [
              {
                "name": "Dongmian Zou",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zou-dongmian/"
              }
            ]
          },
          {
            "name": "Machine Learning",
            "children": [
              {
                "name": "Dongmian Zou",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zou-dongmian/"
              }
            ]
          },
          {
            "name": "Data Science",
            "children": [
              {
                "name": "Dongmian Zou",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zou-dongmian/"
              }
            ]
          },
          {
            "name": "Signal processing",
            "children": [
              {
                "name": "Dongmian Zou",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zou-dongmian/"
              },
              {
                "name": "Peng Sun",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/sun-peng/"
              }
            ]
          },
          {
            "name": "Neuron network",
            "children": [
              {
                "name": "Dongmian Zou",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zou-dongmian/"
              }
            ]
          },
          {
            "name": "Out of equilibrium statistical physics",
            "children": [
              {
                "name": "Pascal Grange",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/grange-pascal/"
              }
            ]
          },
          {
            "name": "Brain research",
            "children": [
              {
                "name": "Pascal Grange",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/grange-pascal/"
              },
              {
                "name": "Szechai Kwok",
                "url": "http://www.kwoklab.org/"
              },
              {
                "name": "Pedro Rada",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/rada-pedro/"
              }
            ]
          },
          {
            "name": "Computational neuroscience",
            "children": [
              {
                "name": "Pascal Grange",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/grange-pascal/"
              }
            ]
          },
          {
            "name": "Stochastic system",
            "children": [
              {
                "name": "Pascal Grange",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/grange-pascal/"
              }
            ]
          },
          {
            "name": "Phase transitions",
            "children": [
              {
                "name": "Pascal Grange",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/grange-pascal/"
              }
            ]
          },
          {
            "name": "Oncogenesis",
            "children": [
              {
                "name": "Pascal Grange",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/grange-pascal/"
              }
            ]
          },
          {
            "name": "Acoustics",
            "children": [
              {
                "name": "Paul Stanley",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/stanley-paul/"
              }
            ]
          },
          {
            "name": "Asian musical instruments",
            "children": [
              {
                "name": "Paul Stanley",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/stanley-paul/"
              }
            ]
          },
          {
            "name": "Quantum systems and chaos",
            "children": [
              {
                "name": "Paul Stanley",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/stanley-paul/"
              }
            ]
          },
          {
            "name": "Pattern formation",
            "children": [
              {
                "name": "Paul Stanley",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/stanley-paul/"
              }
            ]
          },
          {
            "name": "Condense matter physics",
            "children": [
              {
                "name": "Changcheng Zheng",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zheng-changcheng/"
              }
            ]
          },
          {
            "name": "Nonlinear optics",
            "children": [
              {
                "name": "Changcheng Zheng",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zheng-changcheng/"
              }
            ]
          },
          {
            "name": "Materials characterization",
            "children": [
              {
                "name": "Changcheng Zheng",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zheng-changcheng/"
              }
            ]
          },
          {
            "name": "Luminescent / fluorescent materials",
            "children": [
              {
                "name": "Changcheng Zheng",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zheng-changcheng/"
              }
            ]
          },
          {
            "name": "Low dimensional systems",
            "children": [
              {
                "name": "Changcheng Zheng",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zheng-changcheng/"
              }
            ]
          },
          {
            "name": "Semiconductors and nanostructures",
            "children": [
              {
                "name": "Changcheng Zheng",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zheng-changcheng/"
              }
            ]
          },
          {
            "name": "Semi-conductors",
            "children": [
              {
                "name": "Changcheng Zheng",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zheng-changcheng/"
              }
            ]
          },
          {
            "name": "optical properties",
            "children": [
              {
                "name": "Changcheng Zheng",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zheng-changcheng/"
              }
            ]
          },
          {
            "name": "nanostructures",
            "children": [
              {
                "name": "Changcheng Zheng",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zheng-changcheng/"
              }
            ]
          },
          {
            "name": "fluorescent materials",
            "children": [
              {
                "name": "Changcheng Zheng",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zheng-changcheng/"
              }
            ]
          },
          {
            "name": "Microelectronics and nanoelectronics",
            "children": [
              {
                "name": "Xiawa Wang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/wang-xiawa/"
              }
            ]
          },
          {
            "name": "Metamaterials",
            "children": [
              {
                "name": "Xiawa Wang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/wang-xiawa/"
              },
              {
                "name": "Domna Kotsifaki",
                "url": "https://dkotsifaki.weebly.com/"
              }
            ]
          },
          {
            "name": "Photonics",
            "children": [
              {
                "name": "Xiawa Wang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/wang-xiawa/"
              }
            ]
          },
          {
            "name": "Device",
            "children": [
              {
                "name": "Xiawa Wang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/wang-xiawa/"
              }
            ]
          },
          {
            "name": "Energy systems",
            "children": [
              {
                "name": "Xiawa Wang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/wang-xiawa/"
              }
            ]
          },
          {
            "name": "Material science",
            "children": [
              {
                "name": "Xiawa Wang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/wang-xiawa/"
              }
            ]
          },
          {
            "name": "nuclear battery",
            "children": [
              {
                "name": "Xiawa Wang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/wang-xiawa/"
              }
            ]
          },
          {
            "name": "Quantum information",
            "children": [
              {
                "name": "Myung-Joong Hwang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/hwang-myung-joong/"
              }
            ]
          },
          {
            "name": "Quantum Rabi model",
            "children": [
              {
                "name": "Myung-Joong Hwang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/hwang-myung-joong/"
              }
            ]
          },
          {
            "name": "Quantum phase transitions",
            "children": [
              {
                "name": "Myung-Joong Hwang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/hwang-myung-joong/"
              }
            ]
          },
          {
            "name": "Quantum electro-dynamics",
            "children": [
              {
                "name": "Myung-Joong Hwang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/hwang-myung-joong/"
              }
            ]
          },
          {
            "name": "Quantum sensing & computing",
            "children": [
              {
                "name": "Myung-Joong Hwang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/hwang-myung-joong/"
              }
            ]
          },
          {
            "name": "Nano-photonics",
            "children": [
              {
                "name": "Domna Kotsifaki",
                "url": "https://dkotsifaki.weebly.com/"
              }
            ]
          },
          {
            "name": "Optical tweezer",
            "children": [
              {
                "name": "Domna Kotsifaki",
                "url": "https://dkotsifaki.weebly.com/"
              }
            ]
          },
          {
            "name": "Plasmonics",
            "children": [
              {
                "name": "Domna Kotsifaki",
                "url": "https://dkotsifaki.weebly.com/"
              }
            ]
          },
          {
            "name": "Sensing",
            "children": [
              {
                "name": "Domna Kotsifaki",
                "url": "https://dkotsifaki.weebly.com/"
              }
            ]
          },
          {
            "name": "Optical tweezers",
            "children": [
              {
                "name": "Domna Kotsifaki",
                "url": "https://dkotsifaki.weebly.com/"
              }
            ]
          },
          {
            "name": "Equilibrium/non-equilibrium thermodynamics Statistical mechanics",
            "children": [
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "Stochastic processes",
            "children": [
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "Soft matter",
            "children": [
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              },
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "Self-assembly",
            "children": [
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "Packing and jamming",
            "children": [
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "Glass",
            "children": [
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "Granular materials",
            "children": [
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              },
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "Polymer",
            "children": [
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "Monte Carlo methods",
            "children": [
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "MC simulations",
            "children": [
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "molecular dynamics simulation",
            "children": [
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "numerical computation",
            "children": [
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "Atmospheric chemistry",
            "children": [
              {
                "name": "Song Gao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gao-song/"
              }
            ]
          },
          {
            "name": "Aerosol dynamics (mechanisms characterization)Analytical chemistry",
            "children": [
              {
                "name": "Song Gao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gao-song/"
              }
            ]
          },
          {
            "name": "Density functional theory",
            "children": [
              {
                "name": "Song Gao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gao-song/"
              }
            ]
          },
          {
            "name": "Climate mitigation",
            "children": [
              {
                "name": "Song Gao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gao-song/"
              }
            ]
          },
          {
            "name": "Climate pollutants",
            "children": [
              {
                "name": "Song Gao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gao-song/"
              }
            ]
          },
          {
            "name": "Air pollution",
            "children": [
              {
                "name": "Song Gao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gao-song/"
              },
              {
                "name": "William Winner",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/winner-william/"
              }
            ]
          },
          {
            "name": "Water pollution",
            "children": [
              {
                "name": "Song Gao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gao-song/"
              },
              {
                "name": "Eric Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-chia-chien-eric/"
              },
              {
                "name": "Chuanhui Gu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gu-chuanhui/"
              }
            ]
          },
          {
            "name": "Materials synthesis",
            "children": [
              {
                "name": "Weiwei Shi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/shi-weiwei/"
              }
            ]
          },
          {
            "name": "Bio-inspired materials",
            "children": [
              {
                "name": "Weiwei Shi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/shi-weiwei/"
              }
            ]
          },
          {
            "name": "Water harvesting",
            "children": [
              {
                "name": "Weiwei Shi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/shi-weiwei/"
              }
            ]
          },
          {
            "name": "Filtration",
            "children": [
              {
                "name": "Weiwei Shi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/shi-weiwei/"
              }
            ]
          },
          {
            "name": "Bio-materials & soft materials",
            "children": [
              {
                "name": "Weiwei Shi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/shi-weiwei/"
              }
            ]
          },
          {
            "name": "Materials engineering",
            "children": [
              {
                "name": "Weiwei Shi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/shi-weiwei/"
              },
              {
                "name": "Kwang Leong Choy",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kwang-leong-choy/"
              }
            ]
          },
          {
            "name": "Polymer materials",
            "children": [
              {
                "name": "Tan Zhang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zhang-tan/"
              }
            ]
          },
          {
            "name": "Catalysis design",
            "children": [
              {
                "name": "Tan Zhang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zhang-tan/"
              }
            ]
          },
          {
            "name": "Colloids and interfaces",
            "children": [
              {
                "name": "Tan Zhang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zhang-tan/"
              }
            ]
          },
          {
            "name": "Metallic and inorganic nanomaterialsPolymer degeneration",
            "children": [
              {
                "name": "Tan Zhang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zhang-tan/"
              }
            ]
          }
        ]
      },
      {
        "name": "Data and computer sciences",
        "children": [
          {
            "name": "Speech and language processing",
            "children": [
              {
                "name": "Ming Li",
                "url": "https://scholars.duke.edu/person/MingLi"
              }
            ]
          },
          {
            "name": "Machine learning",
            "children": [
              {
                "name": "Shixin Xu",
                "url": "https://sites.google.com/site/shixinxupage/"
              },
              {
                "name": "Ming Li",
                "url": "https://scholars.duke.edu/person/MingLi"
              },
              {
                "name": "Mustafa Misir",
                "url": "http://mustafamisir.github.io"
              },
              {
                "name": "Pengzhan Guo",
                "url": "http://pengzhanguo.github.io"
              },
              {
                "name": "Chi-Yeung(Jimmy) Choi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/choi-chi-yeung-jimmy/"
              },
              {
                "name": "Zuchuan Li",
                "url": "https://sites.duke.edu/sagdku/"
              }
            ]
          },
          {
            "name": "Statistical modeling",
            "children": [
              {
                "name": "Ming Li",
                "url": "https://scholars.duke.edu/person/MingLi"
              },
              {
                "name": "Pengzhan Guo",
                "url": "http://pengzhanguo.github.io"
              }
            ]
          },
          {
            "name": "Structure health modeling",
            "children": [
              {
                "name": "Ming Li",
                "url": "https://scholars.duke.edu/person/MingLi"
              }
            ]
          },
          {
            "name": "Multi-model processing",
            "children": [
              {
                "name": "Ming Li",
                "url": "https://scholars.duke.edu/person/MingLi"
              }
            ]
          },
          {
            "name": "health monitoring",
            "children": [
              {
                "name": "Ming Li",
                "url": "https://scholars.duke.edu/person/MingLi"
              }
            ]
          },
          {
            "name": "Logic Synthesis",
            "children": [
              {
                "name": "Jiang Long",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/long-jiang/"
              }
            ]
          },
          {
            "name": "Formal Methods",
            "children": [
              {
                "name": "Jiang Long",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/long-jiang/"
              }
            ]
          },
          {
            "name": "Program Analysis",
            "children": [
              {
                "name": "Jiang Long",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/long-jiang/"
              }
            ]
          },
          {
            "name": "EDA tool",
            "children": [
              {
                "name": "Jiang Long",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/long-jiang/"
              }
            ]
          },
          {
            "name": "Computer Architecture",
            "children": [
              {
                "name": "Jiang Long",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/long-jiang/"
              }
            ]
          },
          {
            "name": "SoC design and Verification",
            "children": [
              {
                "name": "Jiang Long",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/long-jiang/"
              }
            ]
          },
          {
            "name": "System on Chip design",
            "children": [
              {
                "name": "Jiang Long",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/long-jiang/"
              }
            ]
          },
          {
            "name": "computer engine",
            "children": [
              {
                "name": "Jiang Long",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/long-jiang/"
              }
            ]
          },
          {
            "name": "Neural network",
            "children": [
              {
                "name": "Feng Tian",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/tian-feng/"
              }
            ]
          },
          {
            "name": "Deep learning",
            "children": [
              {
                "name": "Feng Tian",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/tian-feng/"
              }
            ]
          },
          {
            "name": "Artistic animation rendering",
            "children": [
              {
                "name": "Feng Tian",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/tian-feng/"
              }
            ]
          },
          {
            "name": "Augmented reality",
            "children": [
              {
                "name": "Feng Tian",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/tian-feng/"
              }
            ]
          },
          {
            "name": "Game design",
            "children": [
              {
                "name": "Feng Tian",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/tian-feng/"
              }
            ]
          },
          {
            "name": "Virtual reality",
            "children": [
              {
                "name": "Feng Tian",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/tian-feng/"
              }
            ]
          },
          {
            "name": "IoT",
            "children": [
              {
                "name": "Ming-chun Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-ming-chun/"
              },
              {
                "name": "Bing Luo",
                "url": "https://luobing1008.github.io/"
              }
            ]
          },
          {
            "name": "Smart health",
            "children": [
              {
                "name": "Ming-chun Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-ming-chun/"
              }
            ]
          },
          {
            "name": "Machine learning and informatics",
            "children": [
              {
                "name": "Ming-chun Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-ming-chun/"
              }
            ]
          },
          {
            "name": "Motion and physiological signal sensing",
            "children": [
              {
                "name": "Ming-chun Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-ming-chun/"
              }
            ]
          },
          {
            "name": "Automatic algorithm design",
            "children": [
              {
                "name": "Mustafa Misir",
                "url": "http://mustafamisir.github.io"
              }
            ]
          },
          {
            "name": "Data mining",
            "children": [
              {
                "name": "Mustafa Misir",
                "url": "http://mustafamisir.github.io"
              },
              {
                "name": "Pengzhan Guo",
                "url": "http://pengzhanguo.github.io"
              }
            ]
          },
          {
            "name": "Evolutionary algorithm",
            "children": [
              {
                "name": "Mustafa Misir",
                "url": "http://mustafamisir.github.io"
              }
            ]
          },
          {
            "name": "Combinatorial optimization",
            "children": [
              {
                "name": "Mustafa Misir",
                "url": "http://mustafamisir.github.io"
              }
            ]
          },
          {
            "name": "Wireless sensor network",
            "children": [
              {
                "name": "Peng Sun",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/sun-peng/"
              }
            ]
          },
          {
            "name": "Autonomous driving",
            "children": [
              {
                "name": "Peng Sun",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/sun-peng/"
              }
            ]
          },
          {
            "name": "Ad-hoc network",
            "children": [
              {
                "name": "Peng Sun",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/sun-peng/"
              }
            ]
          },
          {
            "name": "Signal processing",
            "children": [
              {
                "name": "Dongmian Zou",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/zou-dongmian/"
              },
              {
                "name": "Peng Sun",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/sun-peng/"
              }
            ]
          },
          {
            "name": "Sensors",
            "children": [
              {
                "name": "Peng Sun",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/sun-peng/"
              }
            ]
          },
          {
            "name": "Edge learning",
            "children": [
              {
                "name": "Bing Luo",
                "url": "https://luobing1008.github.io/"
              }
            ]
          },
          {
            "name": "Networking",
            "children": [
              {
                "name": "Bing Luo",
                "url": "https://luobing1008.github.io/"
              }
            ]
          },
          {
            "name": "Game Theory",
            "children": [
              {
                "name": "Bing Luo",
                "url": "https://luobing1008.github.io/"
              }
            ]
          },
          {
            "name": "Optimization",
            "children": [
              {
                "name": "Bing Luo",
                "url": "https://luobing1008.github.io/"
              }
            ]
          },
          {
            "name": "embedded AI",
            "children": [
              {
                "name": "Bing Luo",
                "url": "https://luobing1008.github.io/"
              }
            ]
          },
          {
            "name": "Cancer research",
            "children": [
              {
                "name": "Anastasia Tsigkou",
                "url": "https://euraxess.ec.europa.eu/worldwide/china/network-european-researchers-biology-and-medicine-china"
              },
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "Microbiology",
            "children": [
              {
                "name": "Anastasia Tsigkou",
                "url": "https://euraxess.ec.europa.eu/worldwide/china/network-european-researchers-biology-and-medicine-china"
              },
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "Ovarian cancer",
            "children": [
              {
                "name": "Anastasia Tsigkou",
                "url": "https://euraxess.ec.europa.eu/worldwide/china/network-european-researchers-biology-and-medicine-china"
              }
            ]
          },
          {
            "name": "Translational medicine",
            "children": [
              {
                "name": "Anastasia Tsigkou",
                "url": "https://euraxess.ec.europa.eu/worldwide/china/network-european-researchers-biology-and-medicine-china"
              }
            ]
          }
        ]
      },
      {
        "name": "Biological, Behavioral sciences and Health",
        "children": [
          {
            "name": "Infectious disease",
            "children": [
              {
                "name": "Linfeng Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-linfeng/"
              },
              {
                "name": "Yiu Wing Kam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kam-yiu-wing-jason/"
              }
            ]
          },
          {
            "name": "Biochemistry",
            "children": [
              {
                "name": "Linfeng Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-linfeng/"
              },
              {
                "name": "Andrew Lin",
                "url": NaN
              }
            ]
          },
          {
            "name": "Biotechnology",
            "children": [
              {
                "name": "Linfeng Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-linfeng/"
              },
              {
                "name": "Andrew Lin",
                "url": NaN
              }
            ]
          },
          {
            "name": "Cellular and Molecular Biology",
            "children": [
              {
                "name": "Linfeng Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-linfeng/"
              }
            ]
          },
          {
            "name": "Synthetic Biology",
            "children": [
              {
                "name": "Linfeng Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-linfeng/"
              }
            ]
          },
          {
            "name": "RNA",
            "children": [
              {
                "name": "Linfeng Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-linfeng/"
              }
            ]
          },
          {
            "name": "Bacteria",
            "children": [
              {
                "name": "Linfeng Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-linfeng/"
              }
            ]
          },
          {
            "name": "Endosomal trafficking",
            "children": [
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "Autophagy",
            "children": [
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "cell cycle",
            "children": [
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "metastasis",
            "children": [
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "anticancer",
            "children": [
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "immunity",
            "children": [
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "virus infection",
            "children": [
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "Ca2+ signaling",
            "children": [
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "Cancer research",
            "children": [
              {
                "name": "Anastasia Tsigkou",
                "url": "https://euraxess.ec.europa.eu/worldwide/china/network-european-researchers-biology-and-medicine-china"
              },
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "Cell signaling",
            "children": [
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "Immunology",
            "children": [
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "Drug development",
            "children": [
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "reactive oxygen species  (ROS) and drug developmentBiomedical science",
            "children": [
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "drug development",
            "children": [
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "metabolism",
            "children": [
              {
                "name": "Jianbo Yue",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/yue-jianbo/"
              }
            ]
          },
          {
            "name": "Physiological ecology",
            "children": [
              {
                "name": "Renee Richer",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/richer-renee/"
              }
            ]
          },
          {
            "name": "Human Health and Environment",
            "children": [
              {
                "name": "Renee Richer",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/richer-renee/"
              }
            ]
          },
          {
            "name": "sustainable development",
            "children": [
              {
                "name": "Renee Richer",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/richer-renee/"
              }
            ]
          },
          {
            "name": "Evolutionary biology",
            "children": [
              {
                "name": "Renee Richer",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/richer-renee/"
              }
            ]
          },
          {
            "name": "Plant biologist",
            "children": [
              {
                "name": "Joohyun Lee",
                "url": "jleelab.org"
              }
            ]
          },
          {
            "name": "Epigenetics",
            "children": [
              {
                "name": "Joohyun Lee",
                "url": "jleelab.org"
              }
            ]
          },
          {
            "name": "Plant physiology",
            "children": [
              {
                "name": "Joohyun Lee",
                "url": "jleelab.org"
              }
            ]
          },
          {
            "name": "Genetic engineering",
            "children": [
              {
                "name": "Joohyun Lee",
                "url": "jleelab.org"
              }
            ]
          },
          {
            "name": "Ecological genomics",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "Systems biology",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "?Bioinformatics",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "Biocomplexity",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "Ecology and Evolutionary Biology",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "Evolutionary Genomics and Speciation",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "Evolution",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "Genomics",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "Genetics",
            "children": [
              {
                "name": "Hyun-Min Kim",
                "url": "https://sites.duke.edu/kimlab"
              },
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "Life sciences",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "Microbiology",
            "children": [
              {
                "name": "Anastasia Tsigkou",
                "url": "https://euraxess.ec.europa.eu/worldwide/china/network-european-researchers-biology-and-medicine-china"
              },
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "Systems Biology",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "Instrumental analysis",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              },
              {
                "name": "Floyd Beckford",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/beckford-floyd/"
              }
            ]
          },
          {
            "name": "Inorganic chemistry",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "bioinorganic chemistry",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              },
              {
                "name": "Floyd Beckford",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/beckford-floyd/"
              }
            ]
          },
          {
            "name": "Molecular Genetics",
            "children": [
              {
                "name": "Ferdinand Kappes",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kappes-ferdinand/"
              }
            ]
          },
          {
            "name": "Plant Physiology",
            "children": [
              {
                "name": "Ferdinand Kappes",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kappes-ferdinand/"
              }
            ]
          },
          {
            "name": "Medical Chemistry",
            "children": [
              {
                "name": "Ferdinand Kappes",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kappes-ferdinand/"
              }
            ]
          },
          {
            "name": "Biochemical Pharmacology",
            "children": [
              {
                "name": "Ferdinand Kappes",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kappes-ferdinand/"
              }
            ]
          },
          {
            "name": "Biological Sciences",
            "children": [
              {
                "name": "Andrew Lin",
                "url": NaN
              }
            ]
          },
          {
            "name": "Biomedical Sciences",
            "children": [
              {
                "name": "Andrew Lin",
                "url": NaN
              }
            ]
          },
          {
            "name": "?RNA interactome",
            "children": [
              {
                "name": "Andrew Lin",
                "url": NaN
              }
            ]
          },
          {
            "name": "lncRNA function",
            "children": [
              {
                "name": "Andrew Lin",
                "url": NaN
              }
            ]
          },
          {
            "name": "Trafficking and localization",
            "children": [
              {
                "name": "Andrew Lin",
                "url": NaN
              }
            ]
          },
          {
            "name": "Cancer Biology",
            "children": [
              {
                "name": "Andrew Lin",
                "url": NaN
              }
            ]
          },
          {
            "name": "Soft matter",
            "children": [
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              },
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "Nonequilibrium systems",
            "children": [
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              }
            ]
          },
          {
            "name": "Phase transition",
            "children": [
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              }
            ]
          },
          {
            "name": "Collective dynamics",
            "children": [
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              }
            ]
          },
          {
            "name": "Granular materials",
            "children": [
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              },
              {
                "name": "Kai Zhang",
                "url": "https://sites.google.com/site/kaizhangstatmech/"
              }
            ]
          },
          {
            "name": "Wetting",
            "children": [
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              }
            ]
          },
          {
            "name": "Impact mechanics",
            "children": [
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              }
            ]
          },
          {
            "name": "Particle tracking",
            "children": [
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              }
            ]
          },
          {
            "name": "Remote sensing (IoTRadar)",
            "children": [
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              }
            ]
          },
          {
            "name": "Digital twin",
            "children": [
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              }
            ]
          },
          {
            "name": "Room acoustics",
            "children": [
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              }
            ]
          },
          {
            "name": "human-machine interfact",
            "children": [
              {
                "name": "Kai Huang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/huang-kai/"
              }
            ]
          },
          {
            "name": "Materials engineering",
            "children": [
              {
                "name": "Weiwei Shi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/shi-weiwei/"
              },
              {
                "name": "Kwang Leong Choy",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kwang-leong-choy/"
              }
            ]
          },
          {
            "name": "Materials manufacturing",
            "children": [
              {
                "name": "Kwang Leong Choy",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kwang-leong-choy/"
              }
            ]
          },
          {
            "name": "Chemical vapor deposition",
            "children": [
              {
                "name": "Kwang Leong Choy",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kwang-leong-choy/"
              }
            ]
          },
          {
            "name": "Biomaterials",
            "children": [
              {
                "name": "Kwang Leong Choy",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kwang-leong-choy/"
              }
            ]
          },
          {
            "name": "Brain research",
            "children": [
              {
                "name": "Pascal Grange",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/grange-pascal/"
              },
              {
                "name": "Szechai Kwok",
                "url": "http://www.kwoklab.org/"
              },
              {
                "name": "Pedro Rada",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/rada-pedro/"
              }
            ]
          },
          {
            "name": "Cognitive neuroscience",
            "children": [
              {
                "name": "Szechai Kwok",
                "url": "http://www.kwoklab.org/"
              }
            ]
          },
          {
            "name": "Memory researchGeoscience",
            "children": [
              {
                "name": "Szechai Kwok",
                "url": "http://www.kwoklab.org/"
              }
            ]
          },
          {
            "name": "Neuroscience",
            "children": [
              {
                "name": "Pedro Rada",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/rada-pedro/"
              }
            ]
          },
          {
            "name": "Behavioral Physiology",
            "children": [
              {
                "name": "Pedro Rada",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/rada-pedro/"
              }
            ]
          },
          {
            "name": "Sleep physiology",
            "children": [
              {
                "name": "Pedro Rada",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/rada-pedro/"
              }
            ]
          },
          {
            "name": "Hydrology",
            "children": [
              {
                "name": "Pedro Rada",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/rada-pedro/"
              },
              {
                "name": "Chuanhui Gu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gu-chuanhui/"
              }
            ]
          },
          {
            "name": "Neurobiology",
            "children": [
              {
                "name": "Eric Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-chia-chien-eric/"
              }
            ]
          },
          {
            "name": "Neuropsychology",
            "children": [
              {
                "name": "Eric Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-chia-chien-eric/"
              }
            ]
          },
          {
            "name": "Aging",
            "children": [
              {
                "name": "Eric Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-chia-chien-eric/"
              }
            ]
          },
          {
            "name": "Psychiatry",
            "children": [
              {
                "name": "Eric Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-chia-chien-eric/"
              },
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Psychology",
            "children": [
              {
                "name": "Eric Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-chia-chien-eric/"
              }
            ]
          },
          {
            "name": "Water pollution",
            "children": [
              {
                "name": "Song Gao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gao-song/"
              },
              {
                "name": "Eric Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-chia-chien-eric/"
              },
              {
                "name": "Chuanhui Gu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gu-chuanhui/"
              }
            ]
          },
          {
            "name": "Mental and behavioral health",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Health inequities",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Child Development",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Child Health",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Clinical Research",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Community Health",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Community Sociology",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Developmental Psychology",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Epidemiology",
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
            "name": "Family Services",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Global Health",
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
            "name": "Health Medicine and Society",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Health Sciences",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Human Development",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Qualitative Methods",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Land degradation",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              },
              {
                "name": "Chuanhui Gu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gu-chuanhui/"
              }
            ]
          },
          {
            "name": "Quantitative Methods",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              }
            ]
          },
          {
            "name": "Global health",
            "children": [
              {
                "name": "Yiu Wing Kam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kam-yiu-wing-jason/"
              }
            ]
          },
          {
            "name": "Virus-host interaction",
            "children": [
              {
                "name": "Yiu Wing Kam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kam-yiu-wing-jason/"
              }
            ]
          },
          {
            "name": "Biomarker identification",
            "children": [
              {
                "name": "Yiu Wing Kam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kam-yiu-wing-jason/"
              }
            ]
          },
          {
            "name": "Immune response in patients",
            "children": [
              {
                "name": "Yiu Wing Kam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kam-yiu-wing-jason/"
              }
            ]
          },
          {
            "name": "Anti-viral drug development",
            "children": [
              {
                "name": "Yiu Wing Kam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/kam-yiu-wing-jason/"
              }
            ]
          },
          {
            "name": "One Health",
            "children": [
              {
                "name": "Sajid Umar",
                "url": NaN
              }
            ]
          },
          {
            "name": "Virology",
            "children": [
              {
                "name": "Sajid Umar",
                "url": NaN
              }
            ]
          },
          {
            "name": "infectious diseases",
            "children": [
              {
                "name": "Sajid Umar",
                "url": NaN
              }
            ]
          },
          {
            "name": "Pathology",
            "children": [
              {
                "name": "Sajid Umar",
                "url": NaN
              }
            ]
          },
          {
            "name": "Respiratory viruses",
            "children": [
              {
                "name": "Sajid Umar",
                "url": NaN
              }
            ]
          },
          {
            "name": "Paras+A51:M59itology",
            "children": [
              {
                "name": "Sajid Umar",
                "url": NaN
              }
            ]
          }
        ]
      },
      {
        "name": "Environmental science and sustainability",
        "children": [
          {
            "name": "Cell and Molecular Biology",
            "children": [
              {
                "name": "Hyun-Min Kim",
                "url": "https://sites.duke.edu/kimlab"
              }
            ]
          },
          {
            "name": "Genetics",
            "children": [
              {
                "name": "Hyun-Min Kim",
                "url": "https://sites.duke.edu/kimlab"
              },
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              }
            ]
          },
          {
            "name": "Microbiology and Biochemistry",
            "children": [
              {
                "name": "Hyun-Min Kim",
                "url": "https://sites.duke.edu/kimlab"
              }
            ]
          },
          {
            "name": "DNA damage and repair",
            "children": [
              {
                "name": "Hyun-Min Kim",
                "url": "https://sites.duke.edu/kimlab"
              }
            ]
          },
          {
            "name": "Biology",
            "children": [
              {
                "name": "Eunyu Kim",
                "url": "http://eunyu.kim.lab.com/"
              }
            ]
          },
          {
            "name": "Environmental Sciences",
            "children": [
              {
                "name": "Eunyu Kim",
                "url": "http://eunyu.kim.lab.com/"
              }
            ]
          },
          {
            "name": "Plant Molecular Biology",
            "children": [
              {
                "name": "Eunyu Kim",
                "url": "http://eunyu.kim.lab.com/"
              }
            ]
          },
          {
            "name": "Plant Biology",
            "children": [
              {
                "name": "Eunyu Kim",
                "url": "http://eunyu.kim.lab.com/"
              }
            ]
          },
          {
            "name": "Epigenetic",
            "children": [
              {
                "name": "Eunyu Kim",
                "url": "http://eunyu.kim.lab.com/"
              }
            ]
          },
          {
            "name": "Inorganic medicinal chemistry",
            "children": [
              {
                "name": "Floyd Beckford",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/beckford-floyd/"
              }
            ]
          },
          {
            "name": "Inorganic/Environmental Chemistry",
            "children": [
              {
                "name": "Floyd Beckford",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/beckford-floyd/"
              }
            ]
          },
          {
            "name": "Catalysts development for environmental science",
            "children": [
              {
                "name": "Floyd Beckford",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/beckford-floyd/"
              }
            ]
          },
          {
            "name": "Pharmaceutical",
            "children": [
              {
                "name": "Floyd Beckford",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/beckford-floyd/"
              }
            ]
          },
          {
            "name": "Personal products in the environment",
            "children": [
              {
                "name": "Floyd Beckford",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/beckford-floyd/"
              }
            ]
          },
          {
            "name": "Natural products chemistry",
            "children": [
              {
                "name": "Floyd Beckford",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/beckford-floyd/"
              }
            ]
          },
          {
            "name": "Instrumental analysis",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              },
              {
                "name": "Floyd Beckford",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/beckford-floyd/"
              }
            ]
          },
          {
            "name": "bioinorganic chemistry",
            "children": [
              {
                "name": "Huansheng Cao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/cao-huansheng/"
              },
              {
                "name": "Floyd Beckford",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/beckford-floyd/"
              }
            ]
          },
          {
            "name": "Organic chemistry",
            "children": [
              {
                "name": "Mark Spaller",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/spaller-mark/"
              },
              {
                "name": "Xinrong Lin",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xinrong-lin/"
              }
            ]
          },
          {
            "name": "Medicinal chemistry",
            "children": [
              {
                "name": "Mark Spaller",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/spaller-mark/"
              }
            ]
          },
          {
            "name": "Protein biochemistry",
            "children": [
              {
                "name": "Mark Spaller",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/spaller-mark/"
              }
            ]
          },
          {
            "name": "Biophysics of protein-ligand interactions",
            "children": [
              {
                "name": "Mark Spaller",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/spaller-mark/"
              }
            ]
          },
          {
            "name": "Molecular therapeutics",
            "children": [
              {
                "name": "Mark Spaller",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/spaller-mark/"
              }
            ]
          },
          {
            "name": "Drug discovery",
            "children": [
              {
                "name": "Mark Spaller",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/spaller-mark/"
              }
            ]
          },
          {
            "name": "Peptides",
            "children": [
              {
                "name": "Mark Spaller",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/spaller-mark/"
              }
            ]
          },
          {
            "name": "Bioorganic",
            "children": [
              {
                "name": "Mark Spaller",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/spaller-mark/"
              }
            ]
          },
          {
            "name": "Medicinal",
            "children": [
              {
                "name": "Mark Spaller",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/spaller-mark/"
              }
            ]
          },
          {
            "name": "Cancer",
            "children": [
              {
                "name": "Mark Spaller",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/spaller-mark/"
              }
            ]
          },
          {
            "name": "Polymer chemistry",
            "children": [
              {
                "name": "Xinrong Lin",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xinrong-lin/"
              }
            ]
          },
          {
            "name": "Electrochemical energy storage",
            "children": [
              {
                "name": "Xinrong Lin",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xinrong-lin/"
              }
            ]
          },
          {
            "name": "Energy Materials",
            "children": [
              {
                "name": "Xinrong Lin",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/xinrong-lin/"
              }
            ]
          },
          {
            "name": "Psychology of pain",
            "children": [
              {
                "name": "Shan Wang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/wang-shan/"
              }
            ]
          },
          {
            "name": "Quantitative psychology",
            "children": [
              {
                "name": "Shan Wang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/wang-shan/"
              }
            ]
          },
          {
            "name": "Aging research",
            "children": [
              {
                "name": "Shan Wang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/wang-shan/"
              }
            ]
          },
          {
            "name": "Cognitive psychology",
            "children": [
              {
                "name": "Shan Wang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/wang-shan/"
              }
            ]
          },
          {
            "name": "Environmental science",
            "children": [
              {
                "name": "Shan Wang",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/wang-shan/"
              },
              {
                "name": "Chuanhui Gu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gu-chuanhui/"
              }
            ]
          },
          {
            "name": "Geoscience",
            "children": [
              {
                "name": "Chuanhui Gu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gu-chuanhui/"
              }
            ]
          },
          {
            "name": "Hydrology",
            "children": [
              {
                "name": "Pedro Rada",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/rada-pedro/"
              },
              {
                "name": "Chuanhui Gu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gu-chuanhui/"
              }
            ]
          },
          {
            "name": "Water pollution",
            "children": [
              {
                "name": "Song Gao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gao-song/"
              },
              {
                "name": "Eric Chen",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/chen-chia-chien-eric/"
              },
              {
                "name": "Chuanhui Gu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gu-chuanhui/"
              }
            ]
          },
          {
            "name": "Land degradation",
            "children": [
              {
                "name": "Rebecca Hock",
                "url": NaN
              },
              {
                "name": "Chuanhui Gu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gu-chuanhui/"
              }
            ]
          },
          {
            "name": "Environmental management",
            "children": [
              {
                "name": "Chuanhui Gu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gu-chuanhui/"
              }
            ]
          },
          {
            "name": "Biodiversity",
            "children": [
              {
                "name": "Chuanhui Gu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gu-chuanhui/"
              }
            ]
          },
          {
            "name": "Aqueous geochemistry",
            "children": [
              {
                "name": "Chuanhui Gu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gu-chuanhui/"
              }
            ]
          },
          {
            "name": "Ecology",
            "children": [
              {
                "name": "Chuanhui Gu",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gu-chuanhui/"
              },
              {
                "name": "Chi-Yeung(Jimmy) Choi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/choi-chi-yeung-jimmy/"
              }
            ]
          },
          {
            "name": "Global change biology",
            "children": [
              {
                "name": "Chi-Yeung(Jimmy) Choi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/choi-chi-yeung-jimmy/"
              }
            ]
          },
          {
            "name": "Landscape ecology",
            "children": [
              {
                "name": "Chi-Yeung(Jimmy) Choi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/choi-chi-yeung-jimmy/"
              }
            ]
          },
          {
            "name": "Population biology",
            "children": [
              {
                "name": "Chi-Yeung(Jimmy) Choi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/choi-chi-yeung-jimmy/"
              }
            ]
          },
          {
            "name": "Ecosystem ecology",
            "children": [
              {
                "name": "Chi-Yeung(Jimmy) Choi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/choi-chi-yeung-jimmy/"
              }
            ]
          },
          {
            "name": "Ornithology",
            "children": [
              {
                "name": "Chi-Yeung(Jimmy) Choi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/choi-chi-yeung-jimmy/"
              }
            ]
          },
          {
            "name": "Machine learning",
            "children": [
              {
                "name": "Shixin Xu",
                "url": "https://sites.google.com/site/shixinxupage/"
              },
              {
                "name": "Ming Li",
                "url": "https://scholars.duke.edu/person/MingLi"
              },
              {
                "name": "Mustafa Misir",
                "url": "http://mustafamisir.github.io"
              },
              {
                "name": "Pengzhan Guo",
                "url": "http://pengzhanguo.github.io"
              },
              {
                "name": "Chi-Yeung(Jimmy) Choi",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/choi-chi-yeung-jimmy/"
              },
              {
                "name": "Zuchuan Li",
                "url": "https://sites.duke.edu/sagdku/"
              }
            ]
          },
          {
            "name": "Environmental data analysis",
            "children": [
              {
                "name": "Zuchuan Li",
                "url": "https://sites.duke.edu/sagdku/"
              }
            ]
          },
          {
            "name": "Remote sensing",
            "children": [
              {
                "name": "Zuchuan Li",
                "url": "https://sites.duke.edu/sagdku/"
              }
            ]
          },
          {
            "name": "Ocean carbon and oxygen cycling",
            "children": [
              {
                "name": "Zuchuan Li",
                "url": "https://sites.duke.edu/sagdku/"
              }
            ]
          },
          {
            "name": "Ocean physics",
            "children": [
              {
                "name": "Zuchuan Li",
                "url": "https://sites.duke.edu/sagdku/"
              }
            ]
          },
          {
            "name": "Biogeochemistry",
            "children": [
              {
                "name": "Zuchuan Li",
                "url": "https://sites.duke.edu/sagdku/"
              }
            ]
          },
          {
            "name": "Statistics",
            "children": [
              {
                "name": "Italo Simonelli",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/simonelli-italo/"
              },
              {
                "name": "Zuchuan Li",
                "url": "https://sites.duke.edu/sagdku/"
              }
            ]
          },
          {
            "name": "Water Management in Cities",
            "children": [
              {
                "name": "Ka Leung Lam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/lam-ka-leung/"
              }
            ]
          },
          {
            "name": "Environmental sustainability",
            "children": [
              {
                "name": "Ka Leung Lam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/lam-ka-leung/"
              }
            ]
          },
          {
            "name": "Industrial ecology",
            "children": [
              {
                "name": "Ka Leung Lam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/lam-ka-leung/"
              }
            ]
          },
          {
            "name": "Water Resources",
            "children": [
              {
                "name": "Ka Leung Lam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/lam-ka-leung/"
              }
            ]
          },
          {
            "name": "Environmental Engineering",
            "children": [
              {
                "name": "Ka Leung Lam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/lam-ka-leung/"
              }
            ]
          },
          {
            "name": "Environmental Management",
            "children": [
              {
                "name": "Ka Leung Lam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/lam-ka-leung/"
              }
            ]
          },
          {
            "name": "Environmental Policy",
            "children": [
              {
                "name": "Ka Leung Lam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/lam-ka-leung/"
              }
            ]
          },
          {
            "name": "Environmental Economics and Policy",
            "children": [
              {
                "name": "Ka Leung Lam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/lam-ka-leung/"
              }
            ]
          },
          {
            "name": "Sustainability",
            "children": [
              {
                "name": "Ka Leung Lam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/lam-ka-leung/"
              }
            ]
          },
          {
            "name": "Water Managerment",
            "children": [
              {
                "name": "Ka Leung Lam",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/lam-ka-leung/"
              }
            ]
          },
          {
            "name": "Atmospheric dynamics",
            "children": [
              {
                "name": "Ding Ma",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ma-ding/"
              }
            ]
          },
          {
            "name": "Climate model",
            "children": [
              {
                "name": "Ding Ma",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ma-ding/"
              }
            ]
          },
          {
            "name": "Climate variability",
            "children": [
              {
                "name": "Ding Ma",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ma-ding/"
              }
            ]
          },
          {
            "name": "Extreme weather events",
            "children": [
              {
                "name": "Ding Ma",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ma-ding/"
              }
            ]
          },
          {
            "name": "Monsoons",
            "children": [
              {
                "name": "Ding Ma",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ma-ding/"
              }
            ]
          },
          {
            "name": "Madden-Julian Oscillation (MJO)",
            "children": [
              {
                "name": "Ding Ma",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ma-ding/"
              }
            ]
          },
          {
            "name": "Annular modes",
            "children": [
              {
                "name": "Ding Ma",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ma-ding/"
              }
            ]
          },
          {
            "name": "Eddy-jet interaction",
            "children": [
              {
                "name": "Ding Ma",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/ma-ding/"
              }
            ]
          },
          {
            "name": "Energy",
            "children": [
              {
                "name": "William Winner",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/winner-william/"
              }
            ]
          },
          {
            "name": "Environment",
            "children": [
              {
                "name": "William Winner",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/winner-william/"
              }
            ]
          },
          {
            "name": "sustainability",
            "children": [
              {
                "name": "William Winner",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/winner-william/"
              }
            ]
          },
          {
            "name": "Air pollution",
            "children": [
              {
                "name": "Song Gao",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/gao-song/"
              },
              {
                "name": "William Winner",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/winner-william/"
              }
            ]
          },
          {
            "name": "Plant scientist",
            "children": [
              {
                "name": "William Winner",
                "url": "https://faculty.dukekunshan.edu.cn/faculty_profiles/winner-william/"
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
