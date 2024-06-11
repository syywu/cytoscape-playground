function getJsonFileName() {
  return "graph.json";
}

async function getJsonData() {
  let json = await constructFilteredJson([
    "Beddington 132kV GSP",
    "Bolney 132kV GSP",
  ]);
  console.log(json.edges, "json");
  return json;
}

async function fetchJSONData() {
  try {
    const res = await fetch("./ukpn-south-eastern-graph.json");
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Unable to fetch data:", error);
  }
}

async function getGspNames() {
  const gspNames = new Set();
  const json = await fetchJSONData();
  for (let node of json.nodes) {
    gspNames.add(node.data.gspArea);
  }

  for (let edge of json.edges) {
    gspNames.add(edge.data.gspArea);
  }
  return gspNames;
}

async function constructFilteredJson(selectedGspNames) {
  filteredJson = {};
  filteredJson["nodes"] = [];
  filteredJson["edges"] = [];

  const json = await fetchJSONData();
  if (json && json.nodes && json.edges) {
    for (node of json.nodes) {
      if (node.data.gspArea && selectedGspNames.includes(node.data.gspArea)) {
        filteredJson["nodes"].push(node);
      }
    }

    for (edge of json.edges) {
      if (edge.data.gspArea && selectedGspNames.includes(edge.data.gspArea)) {
        filteredJson["edges"].push(edge);
      }
    }
  }

  return filteredJson;
}

$.getJSON(getJsonFileName(), function (data) {
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
          "background-color": function (ele) {
            return ele.data("voltage") == "132"
              ? "#FA8072"
              : ele.data("voltage") == "33"
              ? "#D7D9AE"
              : ele.data("voltage") == "11"
              ? "#FFBF00"
              : "#ADD8E6";
          },
          "corner-radius": "0",
          padding: 50,
        },
      },
      {
        selector: "node.bsp",
        css: {
          shape: "round-rectangle",
          "background-color": function (ele) {
            return ele.data("voltage") == "400"
              ? "#89CFF0"
              : ele.data("voltage") == "275"
              ? "#FF474D"
              : ele.data("voltage") == "132"
              ? "#475c6c"
              : ele.data("voltage") == "66"
              ? "#9FE2BF"
              : ele.data("voltage") == "33"
              ? "#FFD580"
              : ele.data("voltage") == "11"
              ? "#fffd8d"
              : "#d3d3d3";
          },
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
        selector: "edge",
        style: {
          content: function (ele) {
            return (
              ele.data("operatingVoltage") +
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
        selector: 'edge[type="Underground"]',
        style: {
          "line-style": "dashed",
          "line-color": function (ele) {
            return ele.data("operatingVoltage") == "400 kV"
              ? "##00308F"
              : ele.data("operatingVoltage") == "275 kV"
              ? "#C70039"
              : ele.data("operatingVoltage") == "132 kV"
              ? "#000000"
              : ele.data("operatingVoltage") == "66 kV"
              ? "#008000"
              : ele.data("operatingVoltage") == "33 kV"
              ? "#FF7F50"
              : "#808080";
          },
        },
      },
      {
        selector: 'edge[type="Overhead"]',
        style: {
          width: 4,
          "line-color": function (ele) {
            return ele.data("operatingVoltage") == "400 kV"
              ? "##00308F"
              : ele.data("operatingVoltage") == "275 kV"
              ? "#C70039"
              : ele.data("operatingVoltage") == "132 kV"
              ? "#000000"
              : ele.data("operatingVoltage") == "66 kV"
              ? "#008000"
              : ele.data("operatingVoltage") == "33 kV"
              ? "#FF7F50"
              : "#808080";
          },
        },
      },
      {
        selector: "node.tjunction",
        style: {
          shape: "diamond",
          "background-color": "black",
          width: 20,
          height: 20,
        },
      },
    ],

    elements: getJsonData(),

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
        cy.removeListener("dblclick", editHandler);
        editHandler = null;
        document.getElementById("label").value = "";
      }
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      cy.on("dblclick", editHandler);

      form.style.display = "none";
    });
  };
  document.querySelector("#edit").addEventListener("click", editLabel);

  document.querySelector("#save").addEventListener("click", function () {
    console.log(cy.elements().jsons());
  });

  document.querySelector("#delete").addEventListener("click", function (e) {
    cy.on("dblclick", function (e) {
      if (e.target !== cy) {
        cy.remove(e.target);
      }
    });
  });

  let gspNames = getGspNames().then((names) => {
    return names;
  });
  console.log(gspNames);
});
