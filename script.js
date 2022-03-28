//Kickstarter Pledges: https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json

"use strict";

const drawMap = (data) => {
  const margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  const color = d3
    .scaleOrdinal()
    // .domain([
    //   "Action",
    //   "Drama",
    //   "Adventure",
    //   "Family",
    //   "Animation",
    //   "Comedy",
    //   "Biography",
    // ])
    .range([
      "#db8a00",
      "#75b0ff",
      "#13ad37",
      "#5d6d00",
      "#757582",
      "#d37cff",
      "#f96868",
      "#ff4500",
      "#3d7c13",
      "#13267c",
      "#8e9435",
      "#f008f8",
      "#023015",
      "#797705",
      "#4400ff",
      "#ff0000",
      "#33ff00",
      "#610461",
      "#41011c",
    ]);

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const root = d3.hierarchy(data).sum(function (d) {
    return d.value;
  });

  d3.treemap().size([width, height]).padding(2)(root);

  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)

    .attr("x", function (d) {
      return d.x0;
    })
    .attr("y", function (d) {
      return d.y0;
    })
    .attr("width", function (d) {
      return d.x1 - d.x0;
    })
    .attr("height", function (d) {
      return d.y1 - d.y0;
    })
    .style("fill", (d) => color(d.parent.data.name));

  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .selectAll("tspan")
    .data((d) => {
      return d.data.name
        .split(/(?=[A-Z][^A-Z])/g) // split the name of movie
        .map((v) => {
          return {
            text: v,
            x0: d.x0, // keep x0 reference
            y0: d.y0, // keep y0 reference
          };
        });
    })
    .enter()
    .append("tspan")
    .attr("x", (d) => d.x0 + 5)
    .attr("y", (d, i) => d.y0 + 15 + i * 10)
    .text((d) => d.text)
    .attr("font-size", "10px")
    .attr("fill", "white");
};

const fetchApi = async function () {
  const data = await fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
    // "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram_full.json"
  );
  const res = await data.json();
  console.log(res);
  drawMap(res);
};
fetchApi();
