$.getJSON("graph.json", function (data) {
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
          "background-color": "#ADD8E6",
          "corner-radius": "0",
          padding: 50,
        },
      },
      {
        selector: "node.bsp",
        css: {
          "background-color": "#D7D9AE",
          "corner-radius": "50",
          padding: 20,
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
    eh.enableDrawMode();
    cy.on("ehcomplete", (event, sourceNode, targetNode) => {
      let { position } = event;
      console.log(
        "Edge completed from",
        sourceNode.id(),
        "to",
        targetNode.id(),
        "at position",
        position
      );
      console.log(cy.elements().jsons());
    });
  });

  document.querySelector("#draw-off").addEventListener("click", function () {
    eh.disableDrawMode();
  });

  document.querySelector("#save").addEventListener("click", function () {
    console.log(cy.elements().jsons());
  });

  cy.on("dblclick", function (e) {
    if (e.target === cy) {
      cy.add({
        group: "nodes",
        data: { width: 20, height: 20 },
        position: { x: e.position.x, y: e.position.y },
      });
      console.log(cy.elements().jsons());
    } else {
      console.log("tapped on element");
    }
  });
});

//   cy.on("dblclick", function (e) {
//     cy.remove(e.target);
//   });
// });
