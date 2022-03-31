//Kickstarter Pledges: https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json

"use strict";

const drawMap = (data) => {
  ///////////////////////////
  ///main canvas sizing
  ///////////////////////////
  const margin = { top: 10, right: 10, bottom: 10, left: 5 },
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

  ///////////////////////////
  //color scale with category name array
  ///////////////////////////
  const bigNames = [];
  data.children.forEach((i) => bigNames.push(i.name));

  const color = d3
    .scaleOrdinal()
    .domain(bigNames)
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

  ///////////////////////////
  //tooltip and mouse functions
  ///////////////////////////
  const tooltip = d3
    .select("#data")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("z-index", "1000")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  const mouseover = function (d) {
    tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "black").style("opacity", 0.8);
  };
  const mousemove = function (d, data) {
    const info = data.data;
    tooltip
      .html(`${info.name} <br>${info.category}`)
      .style("left", d3.pointer(d)[0] + 70 + "px")
      .style("top", d3.pointer(d)[1] + "px")
      .attr("data-value", info.value);
  };
  const mouseleave = function (d) {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 1);
  };

  ///////////////////////////
  //main data canvas
  ///////////////////////////
  const svg = d3
    .select("#data")
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
    .style("fill", (d) => color(d.parent.data.name))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

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

  ///////////////////////////
  ///legend
  ///////////////////////////
  const legend = d3
    .select("#leg")
    .append("svg")
    .attr("width", 200)
    .attr("height", 1000)
    .attr("id", "legend")
    .attr("transform", `translate(10, 10)`);

  legend
    .append("text")
    .attr("x", 10)
    .attr("y", 20)
    .text("Funding Categories")
    .attr("id", "legend");
  var size = 20;

  legend
    .selectAll("rectangles")
    .data(bigNames)
    .enter()
    .append("rect")
    .attr("x", 20)
    .attr("y", function (d, i) {
      return 30 + i * (size + 5);
    })
    .attr("width", size)
    .attr("height", size)
    .attr("class", "legend-item")
    .style("fill", function (d) {
      return color(d);
    });

  legend
    .selectAll("labels")
    .data(bigNames)
    .enter()
    .append("text")
    .attr("x", 20 + size * 1.2)
    .attr("y", function (d, i) {
      return 30 + i * (size + 5) + size / 2;
    })
    .style("fill", function (d) {
      return color(d);
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
};

const fetchApi = async function () {
  const data = await fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
  );
  const res = await data.json();
  drawMap(res);
};
fetchApi();
