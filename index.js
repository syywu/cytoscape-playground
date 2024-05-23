$.getJSON("input.json", function (data) {
  var cy = (window.cy = cytoscape({
    container: document.getElementById("cy"),

    boxSelectionEnabled: false,

    style: [
      {
        selector: "node[label]",
        style: {
          content: "data(label)",
          shape: "ellipse",
          width: 20,
          height: 20,
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
          "background-color": "#d3d3d3",
          "corner-radius": "0",
          padding: 10,
        },
      },
      {
        selector: "node.bsp",
        css: {
          "corner-radius": "50",
          padding: 0,
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

    elements: data,

    layout: {
      name: "fcose",
      padding: 5,
    },
  }));

  var eh = cy.edgehandles({ snap: false });

  document.querySelector("#draw-on").addEventListener("click", function () {
    console.log("clicked");
    eh.enableDrawMode();
  });

  cy.on("dblclick", function (e) {
    if (e.target === cy) {
      cy.add({
        group: "nodes",
        data: { width: 20, height: 20 },
        position: { x: e.position.x, y: e.position.y },
      });
    } else {
      console.log("tapped on element");
    }
  });
});

//   cy.on("dblclick", function (e) {
//     cy.remove(e.target);
//   });
// });
