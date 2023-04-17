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
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

    nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10);

    nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name)
      .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white");

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
                "name": "Konstantinos Efstathiou"
              },
              {
                "name": "Marcus Werner"
              },
              {
                "name": "<a>Paul Stanley</a>"
              }
            ]
          },
          {
            "name": "Dynamical system",
            "children": [
              {
                "name": "Konstantinos Efstathiou"
              }
            ]
          },
          {
            "name": "Nonlinear dynamics",
            "children": [
              {
                "name": "Konstantinos Efstathiou"
              },
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "stochastic process",
            "children": [
              {
                "name": "Konstantinos Efstathiou"
              }
            ]
          },
          {
            "name": "General relativistic theory",
            "children": [
              {
                "name": "Marcus Werner"
              }
            ]
          },
          {
            "name": "Gravitational waves",
            "children": [
              {
                "name": "Marcus Werner"
              }
            ]
          },
          {
            "name": "astrophysics",
            "children": [
              {
                "name": "Marcus Werner"
              }
            ]
          },
          {
            "name": "Topology",
            "children": [
              {
                "name": "Marcus Werner"
              }
            ]
          },
          {
            "name": "Mathematical modeling",
            "children": [
              {
                "name": "Shixin Xu"
              }
            ]
          },
          {
            "name": "Biophysics",
            "children": [
              {
                "name": "Shixin Xu"
              },
              {
                "name": "Domna Kotsifaki"
              },
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "Fluid mechanics",
            "children": [
              {
                "name": "Shixin Xu"
              }
            ]
          },
          {
            "name": "Machine learning",
            "children": [
              {
                "name": "Shixin Xu"
              },
              {
                "name": "Ming Li"
              },
              {
                "name": "Mustafa Misir"
              },
              {
                "name": "Pengzhan Guo"
              },
              {
                "name": "Chi-Yeung(Jimmy) Choi"
              },
              {
                "name": "Zuchuan Li"
              }
            ]
          },
          {
            "name": "Complex fluids",
            "children": [
              {
                "name": "Shixin Xu"
              }
            ]
          },
          {
            "name": "Mixing",
            "children": [
              {
                "name": "Shixin Xu"
              }
            ]
          },
          {
            "name": "Murray \u00a8C von Neumann Algebras",
            "children": [
              {
                "name": "Zhe Liu"
              }
            ]
          },
          {
            "name": "Analysis",
            "children": [
              {
                "name": "Zhe Liu"
              }
            ]
          },
          {
            "name": "Operator algebra",
            "children": [
              {
                "name": "Zhe Liu"
              }
            ]
          },
          {
            "name": "Probability",
            "children": [
              {
                "name": "Italo Simonelli"
              }
            ]
          },
          {
            "name": "Statistics",
            "children": [
              {
                "name": "Italo Simonelli"
              },
              {
                "name": "Zuchuan Li"
              }
            ]
          },
          {
            "name": "Combinatorics",
            "children": [
              {
                "name": "Italo Simonelli"
              },
              {
                "name": "Xingshi Cai"
              },
              {
                "name": "Lin Jiu"
              }
            ]
          },
          {
            "name": "Graph theory",
            "children": [
              {
                "name": "Italo Simonelli"
              }
            ]
          },
          {
            "name": "Game theory",
            "children": [
              {
                "name": "Italo Simonelli"
              }
            ]
          },
          {
            "name": "Self-organization",
            "children": [
              {
                "name": "Italo Simonelli"
              }
            ]
          },
          {
            "name": "Symmetry",
            "children": [
              {
                "name": "Italo Simonelli"
              }
            ]
          },
          {
            "name": "applied math",
            "children": [
              {
                "name": "Xiaoqian Xu"
              }
            ]
          },
          {
            "name": "partial differential equations",
            "children": [
              {
                "name": "Xiaoqian Xu"
              }
            ]
          },
          {
            "name": "fluid dynamics",
            "children": [
              {
                "name": "Xiaoqian Xu"
              }
            ]
          },
          {
            "name": "active scalar",
            "children": [
              {
                "name": "Xiaoqian Xu"
              }
            ]
          },
          {
            "name": "mixing",
            "children": [
              {
                "name": "Xiaoqian Xu"
              }
            ]
          },
          {
            "name": "time-fractional equations",
            "children": [
              {
                "name": "Xiaoqian Xu"
              }
            ]
          },
          {
            "name": "Probabilistic",
            "children": [
              {
                "name": "Xingshi Cai"
              }
            ]
          },
          {
            "name": "random graphs",
            "children": [
              {
                "name": "Xingshi Cai"
              }
            ]
          },
          {
            "name": "random trees",
            "children": [
              {
                "name": "Xingshi Cai"
              }
            ]
          },
          {
            "name": "randomized algorithms",
            "children": [
              {
                "name": "Xingshi Cai"
              }
            ]
          },
          {
            "name": "algorithm",
            "children": [
              {
                "name": "Xingshi Cai"
              }
            ]
          },
          {
            "name": "probability",
            "children": [
              {
                "name": "Xingshi Cai"
              }
            ]
          },
          {
            "name": "Discrete math",
            "children": [
              {
                "name": "Xingshi Cai"
              }
            ]
          },
          {
            "name": "Symbolic Computation",
            "children": [
              {
                "name": "Lin Jiu"
              }
            ]
          },
          {
            "name": "Number Theory",
            "children": [
              {
                "name": "Lin Jiu"
              }
            ]
          },
          {
            "name": "Special Functions",
            "children": [
              {
                "name": "Lin Jiu"
              }
            ]
          },
          {
            "name": "Complex analysis",
            "children": [
              {
                "name": "Zhenghui Huo"
              }
            ]
          },
          {
            "name": "Harmonic analysis",
            "children": [
              {
                "name": "Zhenghui Huo"
              }
            ]
          },
          {
            "name": "Operator theory",
            "children": [
              {
                "name": "Zhenghui Huo"
              }
            ]
          },
          {
            "name": "Bergman kernal function",
            "children": [
              {
                "name": "Zhenghui Huo"
              }
            ]
          },
          {
            "name": "financial mathematics",
            "children": [
              {
                "name": "Dangxing Chen"
              }
            ]
          },
          {
            "name": "numerical analysis",
            "children": [
              {
                "name": "Dangxing Chen"
              }
            ]
          },
          {
            "name": "fast algorithms",
            "children": [
              {
                "name": "Dangxing Chen"
              }
            ]
          },
          {
            "name": "computational physics",
            "children": [
              {
                "name": "Dangxing Chen"
              }
            ]
          },
          {
            "name": "computational quantum chemistry",
            "children": [
              {
                "name": "Dangxing Chen"
              }
            ]
          },
          {
            "name": "Mathematical finance",
            "children": [
              {
                "name": "Dangxing Chen"
              }
            ]
          },
          {
            "name": "parallel computing",
            "children": [
              {
                "name": "Dangxing Chen"
              }
            ]
          },
          {
            "name": "Applied Harmonic Analysis",
            "children": [
              {
                "name": "Dongmian Zou"
              }
            ]
          },
          {
            "name": "Machine Learning",
            "children": [
              {
                "name": "Dongmian Zou"
              }
            ]
          },
          {
            "name": "Data Science",
            "children": [
              {
                "name": "Dongmian Zou"
              }
            ]
          },
          {
            "name": "Signal processing",
            "children": [
              {
                "name": "Dongmian Zou"
              },
              {
                "name": "Peng Sun"
              }
            ]
          },
          {
            "name": "Neuron network",
            "children": [
              {
                "name": "Dongmian Zou"
              }
            ]
          },
          {
            "name": "Out of equilibrium statistical physics",
            "children": [
              {
                "name": "Pascal Grange"
              }
            ]
          },
          {
            "name": "Brain research",
            "children": [
              {
                "name": "Pascal Grange"
              },
              {
                "name": "Szechai Kwok"
              },
              {
                "name": "Pedro Rada"
              }
            ]
          },
          {
            "name": "Computational neuroscience",
            "children": [
              {
                "name": "Pascal Grange"
              }
            ]
          },
          {
            "name": "Stochastic system",
            "children": [
              {
                "name": "Pascal Grange"
              }
            ]
          },
          {
            "name": "Phase transitions",
            "children": [
              {
                "name": "Pascal Grange"
              }
            ]
          },
          {
            "name": "Oncogenesis",
            "children": [
              {
                "name": "Pascal Grange"
              }
            ]
          },
          {
            "name": "Acoustics",
            "children": [
              {
                "name": "Paul Stanley"
              }
            ]
          },
          {
            "name": "Asian musical instruments",
            "children": [
              {
                "name": "Paul Stanley"
              }
            ]
          },
          {
            "name": "Quantum systems and chaos",
            "children": [
              {
                "name": "Paul Stanley"
              }
            ]
          },
          {
            "name": "Pattern formation",
            "children": [
              {
                "name": "Paul Stanley"
              }
            ]
          },
          {
            "name": "Condense matter physics",
            "children": [
              {
                "name": "Changcheng Zheng"
              }
            ]
          },
          {
            "name": "Nonlinear optics",
            "children": [
              {
                "name": "Changcheng Zheng"
              }
            ]
          },
          {
            "name": "Materials characterization",
            "children": [
              {
                "name": "Changcheng Zheng"
              }
            ]
          },
          {
            "name": "Luminescent / fluorescent materials",
            "children": [
              {
                "name": "Changcheng Zheng"
              }
            ]
          },
          {
            "name": "Low dimensional systems",
            "children": [
              {
                "name": "Changcheng Zheng"
              }
            ]
          },
          {
            "name": "Semiconductors and nanostructures",
            "children": [
              {
                "name": "Changcheng Zheng"
              }
            ]
          },
          {
            "name": "Semi-conductors",
            "children": [
              {
                "name": "Changcheng Zheng"
              }
            ]
          },
          {
            "name": "optical properties",
            "children": [
              {
                "name": "Changcheng Zheng"
              }
            ]
          },
          {
            "name": "nanostructures",
            "children": [
              {
                "name": "Changcheng Zheng"
              }
            ]
          },
          {
            "name": "fluorescent materials",
            "children": [
              {
                "name": "Changcheng Zheng"
              }
            ]
          },
          {
            "name": "Microelectronics and nanoelectronics",
            "children": [
              {
                "name": "Xiawa Wang"
              }
            ]
          },
          {
            "name": "Metamaterials",
            "children": [
              {
                "name": "Xiawa Wang"
              },
              {
                "name": "Domna Kotsifaki"
              }
            ]
          },
          {
            "name": "Photonics",
            "children": [
              {
                "name": "Xiawa Wang"
              }
            ]
          },
          {
            "name": "Device",
            "children": [
              {
                "name": "Xiawa Wang"
              }
            ]
          },
          {
            "name": "Energy systems",
            "children": [
              {
                "name": "Xiawa Wang"
              }
            ]
          },
          {
            "name": "Material science",
            "children": [
              {
                "name": "Xiawa Wang"
              }
            ]
          },
          {
            "name": "nuclear battery",
            "children": [
              {
                "name": "Xiawa Wang"
              }
            ]
          },
          {
            "name": "Quantum information",
            "children": [
              {
                "name": "Myung-Joong Hwang"
              }
            ]
          },
          {
            "name": "Quantum Rabi model",
            "children": [
              {
                "name": "Myung-Joong Hwang"
              }
            ]
          },
          {
            "name": "Quantum phase transitions",
            "children": [
              {
                "name": "Myung-Joong Hwang"
              }
            ]
          },
          {
            "name": "Quantum electro-dynamics",
            "children": [
              {
                "name": "Myung-Joong Hwang"
              }
            ]
          },
          {
            "name": "Quantum sensing & computing",
            "children": [
              {
                "name": "Myung-Joong Hwang"
              }
            ]
          },
          {
            "name": "Nano-photonics",
            "children": [
              {
                "name": "Domna Kotsifaki"
              }
            ]
          },
          {
            "name": "Optical tweezer",
            "children": [
              {
                "name": "Domna Kotsifaki"
              }
            ]
          },
          {
            "name": "Plasmonics",
            "children": [
              {
                "name": "Domna Kotsifaki"
              }
            ]
          },
          {
            "name": "Sensing",
            "children": [
              {
                "name": "Domna Kotsifaki"
              }
            ]
          },
          {
            "name": "Optical tweezers",
            "children": [
              {
                "name": "Domna Kotsifaki"
              }
            ]
          },
          {
            "name": "Equilibrium/non-equilibrium thermodynamics Statistical mechanics",
            "children": [
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "Stochastic processes",
            "children": [
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "Soft matter",
            "children": [
              {
                "name": "Kai Huang"
              },
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "Self-assembly",
            "children": [
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "Packing and jamming",
            "children": [
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "Glass",
            "children": [
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "Granular materials",
            "children": [
              {
                "name": "Kai Huang"
              },
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "Polymer",
            "children": [
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "Monte Carlo methods",
            "children": [
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "MC simulations",
            "children": [
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "molecular dynamics simulation",
            "children": [
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "numerical computation",
            "children": [
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "Atmospheric chemistry",
            "children": [
              {
                "name": "Song Gao"
              }
            ]
          },
          {
            "name": "Aerosol dynamics (mechanisms characterization)Analytical chemistry",
            "children": [
              {
                "name": "Song Gao"
              }
            ]
          },
          {
            "name": "Density functional theory",
            "children": [
              {
                "name": "Song Gao"
              }
            ]
          },
          {
            "name": "Climate mitigation",
            "children": [
              {
                "name": "Song Gao"
              }
            ]
          },
          {
            "name": "Climate pollutants",
            "children": [
              {
                "name": "Song Gao"
              }
            ]
          },
          {
            "name": "Air pollution",
            "children": [
              {
                "name": "Song Gao"
              },
              {
                "name": "William Winner"
              }
            ]
          },
          {
            "name": "Water pollution",
            "children": [
              {
                "name": "Song Gao"
              },
              {
                "name": "Eric Chen"
              },
              {
                "name": "Chuanhui Gu"
              }
            ]
          },
          {
            "name": "Materials synthesis",
            "children": [
              {
                "name": "Weiwei Shi"
              }
            ]
          },
          {
            "name": "Bio-inspired materials",
            "children": [
              {
                "name": "Weiwei Shi"
              }
            ]
          },
          {
            "name": "Water harvesting",
            "children": [
              {
                "name": "Weiwei Shi"
              }
            ]
          },
          {
            "name": "Filtration",
            "children": [
              {
                "name": "Weiwei Shi"
              }
            ]
          },
          {
            "name": "Bio-materials & soft materials",
            "children": [
              {
                "name": "Weiwei Shi"
              }
            ]
          },
          {
            "name": "Materials engineering",
            "children": [
              {
                "name": "Weiwei Shi"
              },
              {
                "name": "Kwang Leong Choy"
              }
            ]
          },
          {
            "name": "Polymer materials",
            "children": [
              {
                "name": "Tan Zhang"
              }
            ]
          },
          {
            "name": "Catalysis design",
            "children": [
              {
                "name": "Tan Zhang"
              }
            ]
          },
          {
            "name": "Colloids and interfaces",
            "children": [
              {
                "name": "Tan Zhang"
              }
            ]
          },
          {
            "name": "Metallic and inorganic nanomaterialsPolymer degeneration",
            "children": [
              {
                "name": "Tan Zhang"
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
                "name": "Ming Li"
              }
            ]
          },
          {
            "name": "Machine learning",
            "children": [
              {
                "name": "Shixin Xu"
              },
              {
                "name": "Ming Li"
              },
              {
                "name": "Mustafa Misir"
              },
              {
                "name": "Pengzhan Guo"
              },
              {
                "name": "Chi-Yeung(Jimmy) Choi"
              },
              {
                "name": "Zuchuan Li"
              }
            ]
          },
          {
            "name": "Statistical modeling",
            "children": [
              {
                "name": "Ming Li"
              },
              {
                "name": "Pengzhan Guo"
              }
            ]
          },
          {
            "name": "Structure health modeling",
            "children": [
              {
                "name": "Ming Li"
              }
            ]
          },
          {
            "name": "Multi-model processing",
            "children": [
              {
                "name": "Ming Li"
              }
            ]
          },
          {
            "name": "health monitoring",
            "children": [
              {
                "name": "Ming Li"
              }
            ]
          },
          {
            "name": "Logic Synthesis",
            "children": [
              {
                "name": "Jiang Long"
              }
            ]
          },
          {
            "name": "Formal Methods",
            "children": [
              {
                "name": "Jiang Long"
              }
            ]
          },
          {
            "name": "Program Analysis",
            "children": [
              {
                "name": "Jiang Long"
              }
            ]
          },
          {
            "name": "EDA tool",
            "children": [
              {
                "name": "Jiang Long"
              }
            ]
          },
          {
            "name": "Computer Architecture",
            "children": [
              {
                "name": "Jiang Long"
              }
            ]
          },
          {
            "name": "SoC design and Verification",
            "children": [
              {
                "name": "Jiang Long"
              }
            ]
          },
          {
            "name": "System on Chip design",
            "children": [
              {
                "name": "Jiang Long"
              }
            ]
          },
          {
            "name": "computer engine",
            "children": [
              {
                "name": "Jiang Long"
              }
            ]
          },
          {
            "name": "Neural network",
            "children": [
              {
                "name": "Feng Tian"
              }
            ]
          },
          {
            "name": "Deep learning",
            "children": [
              {
                "name": "Feng Tian"
              }
            ]
          },
          {
            "name": "Artistic animation rendering",
            "children": [
              {
                "name": "Feng Tian"
              }
            ]
          },
          {
            "name": "Augmented reality",
            "children": [
              {
                "name": "Feng Tian"
              }
            ]
          },
          {
            "name": "Game design",
            "children": [
              {
                "name": "Feng Tian"
              }
            ]
          },
          {
            "name": "Virtual reality",
            "children": [
              {
                "name": "Feng Tian"
              }
            ]
          },
          {
            "name": "IoT",
            "children": [
              {
                "name": "Ming-chun Huang"
              },
              {
                "name": "Bing Luo"
              }
            ]
          },
          {
            "name": "Smart health",
            "children": [
              {
                "name": "Ming-chun Huang"
              }
            ]
          },
          {
            "name": "Machine learning and informatics",
            "children": [
              {
                "name": "Ming-chun Huang"
              }
            ]
          },
          {
            "name": "Motion and physiological signal sensing",
            "children": [
              {
                "name": "Ming-chun Huang"
              }
            ]
          },
          {
            "name": "Automatic algorithm design",
            "children": [
              {
                "name": "Mustafa Misir"
              }
            ]
          },
          {
            "name": "Data mining",
            "children": [
              {
                "name": "Mustafa Misir"
              },
              {
                "name": "Pengzhan Guo"
              }
            ]
          },
          {
            "name": "Evolutionary algorithm",
            "children": [
              {
                "name": "Mustafa Misir"
              }
            ]
          },
          {
            "name": "Combinatorial optimization",
            "children": [
              {
                "name": "Mustafa Misir"
              }
            ]
          },
          {
            "name": "Wireless sensor network",
            "children": [
              {
                "name": "Peng Sun"
              }
            ]
          },
          {
            "name": "Autonomous driving",
            "children": [
              {
                "name": "Peng Sun"
              }
            ]
          },
          {
            "name": "Ad-hoc network",
            "children": [
              {
                "name": "Peng Sun"
              }
            ]
          },
          {
            "name": "Signal processing",
            "children": [
              {
                "name": "Dongmian Zou"
              },
              {
                "name": "Peng Sun"
              }
            ]
          },
          {
            "name": "Sensors",
            "children": [
              {
                "name": "Peng Sun"
              }
            ]
          },
          {
            "name": "Edge learning",
            "children": [
              {
                "name": "Bing Luo"
              }
            ]
          },
          {
            "name": "Networking",
            "children": [
              {
                "name": "Bing Luo"
              }
            ]
          },
          {
            "name": "Game Theory",
            "children": [
              {
                "name": "Bing Luo"
              }
            ]
          },
          {
            "name": "Optimization",
            "children": [
              {
                "name": "Bing Luo"
              }
            ]
          },
          {
            "name": "embedded AI",
            "children": [
              {
                "name": "Bing Luo"
              }
            ]
          },
          {
            "name": "Cancer research",
            "children": [
              {
                "name": "Anastasia Tsigkou"
              },
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "Microbiology",
            "children": [
              {
                "name": "Anastasia Tsigkou"
              },
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "Ovarian cancer",
            "children": [
              {
                "name": "Anastasia Tsigkou"
              }
            ]
          },
          {
            "name": "Translational medicine",
            "children": [
              {
                "name": "Anastasia Tsigkou"
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
                "name": "Linfeng Huang"
              },
              {
                "name": "Yiu Wing Kam"
              }
            ]
          },
          {
            "name": "Biochemistry",
            "children": [
              {
                "name": "Linfeng Huang"
              },
              {
                "name": "Andrew Lin"
              }
            ]
          },
          {
            "name": "Biotechnology",
            "children": [
              {
                "name": "Linfeng Huang"
              },
              {
                "name": "Andrew Lin"
              }
            ]
          },
          {
            "name": "Cellular and Molecular Biology",
            "children": [
              {
                "name": "Linfeng Huang"
              }
            ]
          },
          {
            "name": "Synthetic Biology",
            "children": [
              {
                "name": "Linfeng Huang"
              }
            ]
          },
          {
            "name": "RNA",
            "children": [
              {
                "name": "Linfeng Huang"
              }
            ]
          },
          {
            "name": "Bacteria",
            "children": [
              {
                "name": "Linfeng Huang"
              }
            ]
          },
          {
            "name": "Endosomal trafficking",
            "children": [
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "Autophagy",
            "children": [
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "cell cycle",
            "children": [
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "metastasis",
            "children": [
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "anticancer",
            "children": [
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "immunity",
            "children": [
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "virus infection",
            "children": [
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "Ca2+ signaling",
            "children": [
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "Cancer research",
            "children": [
              {
                "name": "Anastasia Tsigkou"
              },
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "Cell signaling",
            "children": [
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "Immunology",
            "children": [
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "Drug development",
            "children": [
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "reactive oxygen species  (ROS) and drug developmentBiomedical science",
            "children": [
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "drug development",
            "children": [
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "metabolism",
            "children": [
              {
                "name": "Jianbo Yue"
              }
            ]
          },
          {
            "name": "Physiological ecology",
            "children": [
              {
                "name": "Renee Richer"
              }
            ]
          },
          {
            "name": "Human Health and Environment",
            "children": [
              {
                "name": "Renee Richer"
              }
            ]
          },
          {
            "name": "sustainable development",
            "children": [
              {
                "name": "Renee Richer"
              }
            ]
          },
          {
            "name": "Evolutionary biology",
            "children": [
              {
                "name": "Renee Richer"
              }
            ]
          },
          {
            "name": "Plant biologist",
            "children": [
              {
                "name": "Joohyun Lee"
              }
            ]
          },
          {
            "name": "Epigenetics",
            "children": [
              {
                "name": "Joohyun Lee"
              }
            ]
          },
          {
            "name": "Plant physiology",
            "children": [
              {
                "name": "Joohyun Lee"
              }
            ]
          },
          {
            "name": "Genetic engineering",
            "children": [
              {
                "name": "Joohyun Lee"
              }
            ]
          },
          {
            "name": "Ecological genomics",
            "children": [
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "Systems biology",
            "children": [
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "?Bioinformatics",
            "children": [
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "Biocomplexity",
            "children": [
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "Ecology and Evolutionary Biology",
            "children": [
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "Evolutionary Genomics and Speciation",
            "children": [
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "Evolution",
            "children": [
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "Genomics",
            "children": [
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "Genetics",
            "children": [
              {
                "name": "Hyun-Min Kim"
              },
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "Life sciences",
            "children": [
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "Microbiology",
            "children": [
              {
                "name": "Anastasia Tsigkou"
              },
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "Systems Biology",
            "children": [
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "Instrumental analysis",
            "children": [
              {
                "name": "Huansheng Cao"
              },
              {
                "name": "Floyd Beckford"
              }
            ]
          },
          {
            "name": "Inorganic chemistry",
            "children": [
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "bioinorganic chemistry",
            "children": [
              {
                "name": "Huansheng Cao"
              },
              {
                "name": "Floyd Beckford"
              }
            ]
          },
          {
            "name": "Molecular Genetics",
            "children": [
              {
                "name": "Ferdinand Kappes"
              }
            ]
          },
          {
            "name": "Plant Physiology",
            "children": [
              {
                "name": "Ferdinand Kappes"
              }
            ]
          },
          {
            "name": "Medical Chemistry",
            "children": [
              {
                "name": "Ferdinand Kappes"
              }
            ]
          },
          {
            "name": "Biochemical Pharmacology",
            "children": [
              {
                "name": "Ferdinand Kappes"
              }
            ]
          },
          {
            "name": "Biological Sciences",
            "children": [
              {
                "name": "Andrew Lin"
              }
            ]
          },
          {
            "name": "Biomedical Sciences",
            "children": [
              {
                "name": "Andrew Lin"
              }
            ]
          },
          {
            "name": "?RNA interactome",
            "children": [
              {
                "name": "Andrew Lin"
              }
            ]
          },
          {
            "name": "lncRNA function",
            "children": [
              {
                "name": "Andrew Lin"
              }
            ]
          },
          {
            "name": "Trafficking and localization",
            "children": [
              {
                "name": "Andrew Lin"
              }
            ]
          },
          {
            "name": "Cancer Biology",
            "children": [
              {
                "name": "Andrew Lin"
              }
            ]
          },
          {
            "name": "Soft matter",
            "children": [
              {
                "name": "Kai Huang"
              },
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "Nonequilibrium systems",
            "children": [
              {
                "name": "Kai Huang"
              }
            ]
          },
          {
            "name": "Phase transition",
            "children": [
              {
                "name": "Kai Huang"
              }
            ]
          },
          {
            "name": "Collective dynamics",
            "children": [
              {
                "name": "Kai Huang"
              }
            ]
          },
          {
            "name": "Granular materials",
            "children": [
              {
                "name": "Kai Huang"
              },
              {
                "name": "Kai Zhang"
              }
            ]
          },
          {
            "name": "Wetting",
            "children": [
              {
                "name": "Kai Huang"
              }
            ]
          },
          {
            "name": "Impact mechanics",
            "children": [
              {
                "name": "Kai Huang"
              }
            ]
          },
          {
            "name": "Particle tracking",
            "children": [
              {
                "name": "Kai Huang"
              }
            ]
          },
          {
            "name": "Remote sensing (IoTRadar)",
            "children": [
              {
                "name": "Kai Huang"
              }
            ]
          },
          {
            "name": "Digital twin",
            "children": [
              {
                "name": "Kai Huang"
              }
            ]
          },
          {
            "name": "Room acoustics",
            "children": [
              {
                "name": "Kai Huang"
              }
            ]
          },
          {
            "name": "human-machine interfact",
            "children": [
              {
                "name": "Kai Huang"
              }
            ]
          },
          {
            "name": "Materials engineering",
            "children": [
              {
                "name": "Weiwei Shi"
              },
              {
                "name": "Kwang Leong Choy"
              }
            ]
          },
          {
            "name": "Materials manufacturing",
            "children": [
              {
                "name": "Kwang Leong Choy"
              }
            ]
          },
          {
            "name": "Chemical vapor deposition",
            "children": [
              {
                "name": "Kwang Leong Choy"
              }
            ]
          },
          {
            "name": "Biomaterials",
            "children": [
              {
                "name": "Kwang Leong Choy"
              }
            ]
          },
          {
            "name": "Brain research",
            "children": [
              {
                "name": "Pascal Grange"
              },
              {
                "name": "Szechai Kwok"
              },
              {
                "name": "Pedro Rada"
              }
            ]
          },
          {
            "name": "Cognitive neuroscience",
            "children": [
              {
                "name": "Szechai Kwok"
              }
            ]
          },
          {
            "name": "Memory researchGeoscience",
            "children": [
              {
                "name": "Szechai Kwok"
              }
            ]
          },
          {
            "name": "Neuroscience",
            "children": [
              {
                "name": "Pedro Rada"
              }
            ]
          },
          {
            "name": "Behavioral Physiology",
            "children": [
              {
                "name": "Pedro Rada"
              }
            ]
          },
          {
            "name": "Sleep physiology",
            "children": [
              {
                "name": "Pedro Rada"
              }
            ]
          },
          {
            "name": "Hydrology",
            "children": [
              {
                "name": "Pedro Rada"
              },
              {
                "name": "Chuanhui Gu"
              }
            ]
          },
          {
            "name": "Neurobiology",
            "children": [
              {
                "name": "Eric Chen"
              }
            ]
          },
          {
            "name": "Neuropsychology",
            "children": [
              {
                "name": "Eric Chen"
              }
            ]
          },
          {
            "name": "Aging",
            "children": [
              {
                "name": "Eric Chen"
              }
            ]
          },
          {
            "name": "Psychiatry",
            "children": [
              {
                "name": "Eric Chen"
              },
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Psychology",
            "children": [
              {
                "name": "Eric Chen"
              }
            ]
          },
          {
            "name": "Water pollution",
            "children": [
              {
                "name": "Song Gao"
              },
              {
                "name": "Eric Chen"
              },
              {
                "name": "Chuanhui Gu"
              }
            ]
          },
          {
            "name": "Mental and behavioral health",
            "children": [
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Health inequities",
            "children": [
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Child Development",
            "children": [
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Child Health",
            "children": [
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Clinical Research",
            "children": [
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Community Health",
            "children": [
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Community Sociology",
            "children": [
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Developmental Psychology",
            "children": [
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Epidemiology",
            "children": [
              {
                "name": "Rebecca Hock"
              },
              {
                "name": "Sajid Umar"
              }
            ]
          },
          {
            "name": "Family Services",
            "children": [
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Global Health",
            "children": [
              {
                "name": "Rebecca Hock"
              },
              {
                "name": "Sajid Umar"
              }
            ]
          },
          {
            "name": "Health Medicine and Society",
            "children": [
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Health Sciences",
            "children": [
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Human Development",
            "children": [
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Qualitative Methods",
            "children": [
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Land degradation",
            "children": [
              {
                "name": "Rebecca Hock"
              },
              {
                "name": "Chuanhui Gu"
              }
            ]
          },
          {
            "name": "Quantitative Methods",
            "children": [
              {
                "name": "Rebecca Hock"
              }
            ]
          },
          {
            "name": "Global health",
            "children": [
              {
                "name": "Yiu Wing Kam"
              }
            ]
          },
          {
            "name": "Virus-host interaction",
            "children": [
              {
                "name": "Yiu Wing Kam"
              }
            ]
          },
          {
            "name": "Biomarker identification",
            "children": [
              {
                "name": "Yiu Wing Kam"
              }
            ]
          },
          {
            "name": "Immune response in patients",
            "children": [
              {
                "name": "Yiu Wing Kam"
              }
            ]
          },
          {
            "name": "Anti-viral drug development",
            "children": [
              {
                "name": "Yiu Wing Kam"
              }
            ]
          },
          {
            "name": "One Health",
            "children": [
              {
                "name": "Sajid Umar"
              }
            ]
          },
          {
            "name": "Virology",
            "children": [
              {
                "name": "Sajid Umar"
              }
            ]
          },
          {
            "name": "infectious diseases",
            "children": [
              {
                "name": "Sajid Umar"
              }
            ]
          },
          {
            "name": "Pathology",
            "children": [
              {
                "name": "Sajid Umar"
              }
            ]
          },
          {
            "name": "Respiratory viruses",
            "children": [
              {
                "name": "Sajid Umar"
              }
            ]
          },
          {
            "name": "Paras+A51:M59itology",
            "children": [
              {
                "name": "Sajid Umar"
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
                "name": "Hyun-Min Kim"
              }
            ]
          },
          {
            "name": "Genetics",
            "children": [
              {
                "name": "Hyun-Min Kim"
              },
              {
                "name": "Huansheng Cao"
              }
            ]
          },
          {
            "name": "Microbiology and Biochemistry",
            "children": [
              {
                "name": "Hyun-Min Kim"
              }
            ]
          },
          {
            "name": "DNA damage and repair",
            "children": [
              {
                "name": "Hyun-Min Kim"
              }
            ]
          },
          {
            "name": "Biology",
            "children": [
              {
                "name": "Eunyu Kim"
              }
            ]
          },
          {
            "name": "Environmental Sciences",
            "children": [
              {
                "name": "Eunyu Kim"
              }
            ]
          },
          {
            "name": "Plant Molecular Biology",
            "children": [
              {
                "name": "Eunyu Kim"
              }
            ]
          },
          {
            "name": "Plant Biology",
            "children": [
              {
                "name": "Eunyu Kim"
              }
            ]
          },
          {
            "name": "Epigenetic",
            "children": [
              {
                "name": "Eunyu Kim"
              }
            ]
          },
          {
            "name": "Inorganic medicinal chemistry",
            "children": [
              {
                "name": "Floyd Beckford"
              }
            ]
          },
          {
            "name": "Inorganic/Environmental Chemistry",
            "children": [
              {
                "name": "Floyd Beckford"
              }
            ]
          },
          {
            "name": "Catalysts development for environmental science",
            "children": [
              {
                "name": "Floyd Beckford"
              }
            ]
          },
          {
            "name": "Pharmaceutical",
            "children": [
              {
                "name": "Floyd Beckford"
              }
            ]
          },
          {
            "name": "Personal products in the environment",
            "children": [
              {
                "name": "Floyd Beckford"
              }
            ]
          },
          {
            "name": "Natural products chemistry",
            "children": [
              {
                "name": "Floyd Beckford"
              }
            ]
          },
          {
            "name": "Instrumental analysis",
            "children": [
              {
                "name": "Huansheng Cao"
              },
              {
                "name": "Floyd Beckford"
              }
            ]
          },
          {
            "name": "bioinorganic chemistry",
            "children": [
              {
                "name": "Huansheng Cao"
              },
              {
                "name": "Floyd Beckford"
              }
            ]
          },
          {
            "name": "Organic chemistry",
            "children": [
              {
                "name": "Mark Spaller"
              },
              {
                "name": "Xinrong Lin"
              }
            ]
          },
          {
            "name": "Medicinal chemistry",
            "children": [
              {
                "name": "Mark Spaller"
              }
            ]
          },
          {
            "name": "Protein biochemistry",
            "children": [
              {
                "name": "Mark Spaller"
              }
            ]
          },
          {
            "name": "Biophysics of protein-ligand interactions",
            "children": [
              {
                "name": "Mark Spaller"
              }
            ]
          },
          {
            "name": "Molecular therapeutics",
            "children": [
              {
                "name": "Mark Spaller"
              }
            ]
          },
          {
            "name": "Drug discovery",
            "children": [
              {
                "name": "Mark Spaller"
              }
            ]
          },
          {
            "name": "Peptides",
            "children": [
              {
                "name": "Mark Spaller"
              }
            ]
          },
          {
            "name": "Bioorganic",
            "children": [
              {
                "name": "Mark Spaller"
              }
            ]
          },
          {
            "name": "Medicinal",
            "children": [
              {
                "name": "Mark Spaller"
              }
            ]
          },
          {
            "name": "Cancer",
            "children": [
              {
                "name": "Mark Spaller"
              }
            ]
          },
          {
            "name": "Polymer chemistry",
            "children": [
              {
                "name": "Xinrong Lin"
              }
            ]
          },
          {
            "name": "Electrochemical energy storage",
            "children": [
              {
                "name": "Xinrong Lin"
              }
            ]
          },
          {
            "name": "Energy Materials",
            "children": [
              {
                "name": "Xinrong Lin"
              }
            ]
          },
          {
            "name": "Psychology of pain",
            "children": [
              {
                "name": "Shan Wang"
              }
            ]
          },
          {
            "name": "Quantitative psychology",
            "children": [
              {
                "name": "Shan Wang"
              }
            ]
          },
          {
            "name": "Aging research",
            "children": [
              {
                "name": "Shan Wang"
              }
            ]
          },
          {
            "name": "Cognitive psychology",
            "children": [
              {
                "name": "Shan Wang"
              }
            ]
          },
          {
            "name": "Environmental science",
            "children": [
              {
                "name": "Shan Wang"
              },
              {
                "name": "Chuanhui Gu"
              }
            ]
          },
          {
            "name": "Geoscience",
            "children": [
              {
                "name": "Chuanhui Gu"
              }
            ]
          },
          {
            "name": "Hydrology",
            "children": [
              {
                "name": "Pedro Rada"
              },
              {
                "name": "Chuanhui Gu"
              }
            ]
          },
          {
            "name": "Water pollution",
            "children": [
              {
                "name": "Song Gao"
              },
              {
                "name": "Eric Chen"
              },
              {
                "name": "Chuanhui Gu"
              }
            ]
          },
          {
            "name": "Land degradation",
            "children": [
              {
                "name": "Rebecca Hock"
              },
              {
                "name": "Chuanhui Gu"
              }
            ]
          },
          {
            "name": "Environmental management",
            "children": [
              {
                "name": "Chuanhui Gu"
              }
            ]
          },
          {
            "name": "Biodiversity",
            "children": [
              {
                "name": "Chuanhui Gu"
              }
            ]
          },
          {
            "name": "Aqueous geochemistry",
            "children": [
              {
                "name": "Chuanhui Gu"
              }
            ]
          },
          {
            "name": "Ecology",
            "children": [
              {
                "name": "Chuanhui Gu"
              },
              {
                "name": "Chi-Yeung(Jimmy) Choi"
              }
            ]
          },
          {
            "name": "Global change biology",
            "children": [
              {
                "name": "Chi-Yeung(Jimmy) Choi"
              }
            ]
          },
          {
            "name": "Landscape ecology",
            "children": [
              {
                "name": "Chi-Yeung(Jimmy) Choi"
              }
            ]
          },
          {
            "name": "Population biology",
            "children": [
              {
                "name": "Chi-Yeung(Jimmy) Choi"
              }
            ]
          },
          {
            "name": "Ecosystem ecology",
            "children": [
              {
                "name": "Chi-Yeung(Jimmy) Choi"
              }
            ]
          },
          {
            "name": "Ornithology",
            "children": [
              {
                "name": "Chi-Yeung(Jimmy) Choi"
              }
            ]
          },
          {
            "name": "Machine learning",
            "children": [
              {
                "name": "Shixin Xu"
              },
              {
                "name": "Ming Li"
              },
              {
                "name": "Mustafa Misir"
              },
              {
                "name": "Pengzhan Guo"
              },
              {
                "name": "Chi-Yeung(Jimmy) Choi"
              },
              {
                "name": "Zuchuan Li"
              }
            ]
          },
          {
            "name": "Environmental data analysis",
            "children": [
              {
                "name": "Zuchuan Li"
              }
            ]
          },
          {
            "name": "Remote sensing",
            "children": [
              {
                "name": "Zuchuan Li"
              }
            ]
          },
          {
            "name": "Ocean carbon and oxygen cycling",
            "children": [
              {
                "name": "Zuchuan Li"
              }
            ]
          },
          {
            "name": "Ocean physics",
            "children": [
              {
                "name": "Zuchuan Li"
              }
            ]
          },
          {
            "name": "Biogeochemistry",
            "children": [
              {
                "name": "Zuchuan Li"
              }
            ]
          },
          {
            "name": "Statistics",
            "children": [
              {
                "name": "Italo Simonelli"
              },
              {
                "name": "Zuchuan Li"
              }
            ]
          },
          {
            "name": "Water Management in Cities",
            "children": [
              {
                "name": "Ka Leung Lam"
              }
            ]
          },
          {
            "name": "Environmental sustainability",
            "children": [
              {
                "name": "Ka Leung Lam"
              }
            ]
          },
          {
            "name": "Industrial ecology",
            "children": [
              {
                "name": "Ka Leung Lam"
              }
            ]
          },
          {
            "name": "Water Resources",
            "children": [
              {
                "name": "Ka Leung Lam"
              }
            ]
          },
          {
            "name": "Environmental Engineering",
            "children": [
              {
                "name": "Ka Leung Lam"
              }
            ]
          },
          {
            "name": "Environmental Management",
            "children": [
              {
                "name": "Ka Leung Lam"
              }
            ]
          },
          {
            "name": "Environmental Policy",
            "children": [
              {
                "name": "Ka Leung Lam"
              }
            ]
          },
          {
            "name": "Environmental Economics and Policy",
            "children": [
              {
                "name": "Ka Leung Lam"
              }
            ]
          },
          {
            "name": "Sustainability",
            "children": [
              {
                "name": "Ka Leung Lam"
              }
            ]
          },
          {
            "name": "Water Managerment",
            "children": [
              {
                "name": "Ka Leung Lam"
              }
            ]
          },
          {
            "name": "Atmospheric dynamics",
            "children": [
              {
                "name": "Ding Ma"
              }
            ]
          },
          {
            "name": "Climate model",
            "children": [
              {
                "name": "Ding Ma"
              }
            ]
          },
          {
            "name": "Climate variability",
            "children": [
              {
                "name": "Ding Ma"
              }
            ]
          },
          {
            "name": "Extreme weather events",
            "children": [
              {
                "name": "Ding Ma"
              }
            ]
          },
          {
            "name": "Monsoons",
            "children": [
              {
                "name": "Ding Ma"
              }
            ]
          },
          {
            "name": "Madden-Julian Oscillation (MJO)",
            "children": [
              {
                "name": "Ding Ma"
              }
            ]
          },
          {
            "name": "Annular modes",
            "children": [
              {
                "name": "Ding Ma"
              }
            ]
          },
          {
            "name": "Eddy-jet interaction",
            "children": [
              {
                "name": "Ding Ma"
              }
            ]
          },
          {
            "name": "Energy",
            "children": [
              {
                "name": "William Winner"
              }
            ]
          },
          {
            "name": "Environment",
            "children": [
              {
                "name": "William Winner"
              }
            ]
          },
          {
            "name": "sustainability",
            "children": [
              {
                "name": "William Winner"
              }
            ]
          },
          {
            "name": "Air pollution",
            "children": [
              {
                "name": "Song Gao"
              },
              {
                "name": "William Winner"
              }
            ]
          },
          {
            "name": "Plant scientist",
            "children": [
              {
                "name": "William Winner"
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
