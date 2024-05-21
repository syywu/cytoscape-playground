var cy = (window.cy = cytoscape({
  container: document.getElementById("cy"),

  boxSelectionEnabled: false,

  style: [
    {
      selector: "node",
      css: {
        shape: "ellipse",
        content: "data(id)",
        "text-valign": "center",
        "text-halign": "center",
        label: "data(id)",
      },
    },
    {
      selector: ":parent",
      css: {
        "text-valign": "top",
        "text-halign": "center",
        shape: "round-rectangle",
        "corner-radius": "10",
        padding: 10,
      },
    },
    {
      selector: "node#e",
      css: {
        "corner-radius": "10",
        padding: 5,
      },
    },
    {
      selector: "edge",
      css: {
        "curve-style": "bezier",
        "target-arrow-shape": "triangle",
      },
    },
  ],

  //   elements: {
  //     nodes: [
  //       { data: { id: "a", parent: "b" }, position: { x: 215, y: 85 } },
  //       { data: { id: "b" } },
  //       { data: { id: "c", parent: "b" }, position: { x: 300, y: 85 } },
  //       { data: { id: "d" }, position: { x: 215, y: 175 } },
  //       { data: { id: "e" } },
  //       { data: { id: "f", parent: "e" }, position: { x: 300, y: 175 } },
  //     ],
  //     edges: [
  //       { data: { id: "ad", source: "a", target: "d" } },
  //       { data: { id: "eb", source: "e", target: "b" } },
  //     ],
  //   },

  elements: {
    nodes: [
      { data: { id: "A", label: "A" } },
      { data: { id: "C", label: "C" } },
      { data: { id: "D", label: "D" } },
      { data: { id: "B", label: "B" } },
    ],
    edges: [
      {
        data: {
          id: "AC",
          source: "A",
          target: "C",
          label: "A (aa) - C (ca)",
          siteVoltage: "132kV",
          winterRating: "1",
          circuitLength: "2",
        },
      },
      {
        data: {
          id: "AD",
          source: "A",
          target: "D",
          label: "A (ab) - D (da)",
          siteVoltage: "132kV",
          winterRating: "1",
          circuitLength: "3",
        },
      },
      {
        data: {
          id: "AB",
          source: "A",
          target: "B",
          label: "A (ac) - B (ba)",
          siteVoltage: "132kV",
          winterRating: "1",
          circuitLength: "1",
        },
      },
      {
        data: {
          id: "BC",
          source: "B",
          target: "C",
          label: "B (bb) - C (cb)",
          siteVoltage: "132kV",
          winterRating: "2",
          circuitLength: "3",
        },
      },
      {
        data: {
          id: "BD",
          source: "B",
          target: "D",
          label: "B (bc) - D (db)",
          siteVoltage: "132kV",
          winterRating: "2",
          circuitLength: "1",
        },
      },
      {
        data: {
          id: "CD",
          source: "C",
          target: "D",
          label: "C (cc) - D (dc)",
          siteVoltage: "132kV",
          winterRating: "2",
          circuitLength: "4",
        },
      },
    ],
  },

  layout: {
    name: "random",
    padding: 5,
  },
}));

cy.data();

// cy.nodes().on("click", function (e) {
//   //   var clickedNode = e.target;
//   cy.data();
// });
