var cy = (window.cy = cytoscape({
  container: document.getElementById("cy"),

  boxSelectionEnabled: false,

  style: [
    {
      selector: "node[label]",
      style: {
        content: "data(label)",
        shape: "ellipse",
        width: 25,
        height: 25,
        "background-color": "grey",
        "border-width": 0,
        "border-color": undefined,
      },
    },
    {
      selector: "node:selected",
      style: {
        "overlay-opacity": 0.5,
        "overlay-color": "orange",
        "overlay-padding": "5%",
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
      selector: "node#bsp",
      css: {
        "corner-radius": "10",
        padding: 5,
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "grey",
        "curve-style": "bezier",
      },
    },
    {
      selector: "edge:selected",
      style: {
        "line-color": "orange",
        width: 2,
        "curve-style": "bezier",
        "overlay-opacity": 0.3,
        "overlay-padding": "5px",
        "overlay-color": "orange",
      },
    },
    {
      selector: "edge[label]",
      style: {
        content: "data(label)",
        "font-size": "12px",
        "text-background-opacity": 1,
        "text-background-color": "white",
        "text-background-padding": "3px",
      },
    },
    {
      selector: "node.tjunction",
      style: {
        shape: "ellipse",
        "background-color": "black",
        width: 10,
        height: 10,
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
      { data: { id: "A", label: "A", class: "tjunction" } },
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

cy.on("tap", function (e) {
  if (e.target === cy) {
    if (e.target.length) {
      e.target.json({ selected: false });
      e.target;
      cy.add({
        group: "edges",
        data: { weight: 75 },
        position: { x: e.position.x, y: e.position.y },
      });
    } else {
      cy.add({
        group: "nodes",
        data: { weight: 75 },
        position: { x: e.position.x, y: e.position.y },
      });
    }
  } else {
    console.log("tapped on element");
  }
});

cy.on("dblclick", function (e) {
  cy.remove(e.target);
});

// const handleDoubleClick = useCallback(
//   (event: cytoscape.EventObject) => {
//     if (event.target.length === undefined) {
//       const coords = { x: event.position?.x, y: event.position?.y };
//       handleAddNodeClick(coords);
//     } else if (isTourActive) {
//       return;
//     } else {
//       const element = event.target;
//       element.json({ selected: false });
//       const label = element.data(ELEMENT_DATA_LABEL);
//       const type = element.data(ELEMENT_DATA_TYPE);
//       const elementClasses = element.classes();
//       const style = elementClasses
//         ? elementClasses[elementClasses.length - 1]
//         : DEFAULT_STYLE_DATA.style;
//       const elementType: ElementType = getElementType(element, type);
//       setElementData({ label, style });

// );
