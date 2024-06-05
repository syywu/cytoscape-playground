// TODO: remove global variable
let json = "graph.json";

$.getJSON(json, function (data) {
  var cy = (window.cy = cytoscape({
    container: document.getElementById("cy"),

    boxSelectionEnabled: false,

    style: [
      {
        selector: "node[label]",
        style: {
          content: "data(label)",
          shape: "diamond",
          width: 20,
          height: 20,
          "background-color": "grey",
          "border-width": 0,
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
        selector: "node.gsp",
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
          shape: "round-rectangle",
          "background-color": "#D7D9AE",
          "corner-radius": "50",
          padding: 20,
          width: 70,
          height: 70,
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
          content: function (ele) {
            return (
              ele.data("label") +
              " - " +
              ele.data("winterRating") +
              " - " +
              ele.data("circuitLength")
            );
          },
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

  var addGsp = function () {
    let form = document.getElementById("gsp-form");
    form.style.display = "block";

    var tapHandler = function (e) {
      if (e.target === cy) {
        cy.add({
          group: "nodes",
          data: { label: document.getElementById("gsp-label").value },
          classes: "gsp",
          position: { x: e.position.x, y: e.position.y },
        });

        cy.removeListener("tap", tapHandler);
        tapHandler = null;
        document.getElementById("gsp-label").value = "";
      }
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      cy.on("tap", tapHandler);

      form.style.display = "none";
    });
  };
  document.querySelector("#add-gsp").addEventListener("click", addGsp);

  var addBsp = function () {
    let form = document.getElementById("bsp-form");
    form.style.display = "block";

    let tapHandler = function (e) {
      if (e.target === cy) {
        cy.add({
          group: "nodes",
          data: { label: document.getElementById("bsp-label").value },
          classes: "bsp",
          position: { x: e.position.x, y: e.position.y },
        });

        cy.removeListener("tap", tapHandler);
        tapHandler = null;
        document.getElementById("bsp-label").value = "";
      }
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      cy.on("tap", tapHandler);

      form.style.display = "none";
    });
  };
  document.querySelector("#add-bsp").addEventListener("click", addBsp);

  document.querySelector("#delete").addEventListener("click", function (e) {
    cy.on("dblclick", function (e) {
      if (e.target !== cy) {
        cy.remove(e.target);
      }
    });
  });

  document.querySelector("#save").addEventListener("click", function () {
    console.log(cy.elements().jsons());
  });

  document.querySelector("#add-node").addEventListener("click", function () {
    let form = document.getElementById("node-form");
    form.style.display = "block";

    let tapHandler = function (e) {
      if (e.target === cy) {
        cy.add({
          group: "nodes",
          data: {
            label: document.getElementById("node-label").value,
          },
          position: { x: e.position.x, y: e.position.y },
        });

        cy.removeListener("tap", tapHandler);
        tapHandler = null;
        document.getElementById("node-label").value = "";
      }
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      cy.on("tap", tapHandler);

      form.style.display = "none";
    });
  });

  var editLabel = function () {
    let form = document.getElementById("label-form");
    form.style.display = "block";

    let editHandler = function (e) {
      if (e.target !== cy) {
        cy.$(e.target).data("label", document.getElementById("label").value);
      }
    };
    document.getElementById("label").value = "";

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      cy.on("dblclick", editHandler);

      form.style.display = "none";
    });
  };

  document.querySelector("#edit").addEventListener("click", editLabel);
});
