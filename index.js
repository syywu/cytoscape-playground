function getJsonFileName() {
  return "ukpn-eastern-graph.json";
}

async function getJsonData() {
  let json = await constructFilteredJson([
    // "Beddington 132kV GSP",
    // "Bolney 132kV GSP",
    // "Canterbury North 132kV GSP",
    // "Chessington 132kV GSP",
    // "Kemsley 132kV GSP",
    // "Kingsnorth Grid 132kV GSP",
    // "Laleham 132kV GSP",
    // "Littlebrook GIS 132kV GSP",
    // "Ninfield 132kV GSP",
    // "Northfleet East 132kV GSP",
    // "Sellindge 132kV GSP",
    // "West Weybridge 132kV(NEW) GSP",
    // "Barking C 132kV GSP",
    // "Barking West 33kV GSP",
    // "Beddington 132kV GSP",
    // "Brimsdown 132kV GSP",
    // "Chessington 132kV GSP",
    // "City Road 132kV GSP",
    // "Hackney Supergrid 132 kV GSP",
    // "Hackney Sgrid 66kV GSP",
    // "Hurst 132kV GSP",
    // "Littlebrook GIS 132kV GSP",
    // "Lodge Rd B 66kV GSP",
    // "New Cross 132kV GSP",
    // "NEW CROSS SGRID 66KV GSP",
    // "Redbridge Supergrid 33kV GSP",
    // "St Johns Wood 132kV GSP",
    // "West Ham Sgrid 132kV GSP",
    // "Willesden Grid 132kV GSP",
    // "Willesden Grid 66kV GSP",
    // "Wimbledon Sec 1&2 132kV GSP",
    // "Wimbledon Grid 3&4 132kV GSP",
    // "Amersham 132kV GSP",
    // "Barking Grid 132kV GSP",
    // "Braintree 132kV GSP",
    // "Bramford Grid 132kV GSP",
    // "Brimsdown 132kV GSP",
    // "Burwell Main Grid 132kV GSP",
    // "Eaton Socon Grid 132kV GSP",
    // "Elstree 132kV GSP",
    // "Stanmore Grid 132kV GSP",
    // "Grendon 132kV GSP",
    // "Mill Hill 132kV GSP",
    // "Norwich Main 132kV GSP",
    // "Pelham 132kV GSP",
    // "Rayleigh Main 132kV GSP",
    // "Rye House 132kV GSP",
    // "Sundon 132kV GSP",
    // "Tilbury 132kV GSP",
    // "Tottenham 132kV GSP",
    // "Walpole 132kV GSP",
    // "Warley Grid 132kV GSP",
    // "Watford South 132kV GSP",
    // "Willesden Grid 132kV GSP",
    // "Wymondley Main 132kV GSP",
  ]);
  console.log(json.edges, "json");
  return json;
}

async function fetchJSONData() {
  try {
    const res = await fetch("./ukpn.json");
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
      let gspArea = node.data.gspArea;
      if (gspArea) {
        if (gspArea.length > 1) {
          for (let i = 0; i < gspArea.length; i++) {
            if (selectedGspNames.includes(gspArea[i])) {
              filteredJson["nodes"].push(node);
            }
          }
        } else {
          if (selectedGspNames.includes(gspArea[0])) {
            filteredJson["nodes"].push(node);
          }
        }
      }
    }

    for (edge of json.edges) {
      let gspArea = edge.data.gspArea;
      if (gspArea) {
        if (gspArea.length > 1) {
          for (let i = 0; i < gspArea.length; i++) {
            if (selectedGspNames.includes(gspArea[i])) {
              filteredJson["nodes"].push(edge);
            }
          }
        } else {
          if (selectedGspNames.includes(gspArea[0])) {
            filteredJson["edges"].push(edge);
          }
        }
      }
    }
  }

  return filteredJson;
}

document.addEventListener("DOMContentLoaded", async function () {
  const jsonData = await getJsonData();
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
          shape: "rectangle",
          "background-color": function (ele) {
            return ele.data("voltage") == "132"
              ? "#FA8072"
              : ele.data("voltage") == "33"
              ? "#D7D9AE"
              : "#FFBF00";
          },
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
              : "#fffd8d";
          },
          "corner-radius": "50",
          padding: 20,
          width: 70,
          height: 70,
        },
      },
      {
        selector: "node.switch",
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
              : "#fffd8d";
          },
          "corner-radius": "15",
        },
      },
      {
        selector: "edge",
        style: {
          width: 2,
          "line-color": "grey",
          "curve-style": "haystack",
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
            const operatingVoltage = ele.data("operatingVoltage");
            const winterRating = ele.data("winterRating");
            const circuitLength = ele.data("circuitLength");

            if (operatingVoltage || winterRating || circuitLength) {
              return [operatingVoltage, winterRating, circuitLength]
                .filter(Boolean)
                .join(" - ");
            } else {
              return "";
            }
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

    elements: jsonData,

    layout: {
      name: "fcose",
      padding: 5,
    },
  }));

  function makePopper(ele) {
    let ref = ele.popperRef(); // used only for positioning

    ele.tippy = tippy(ref, {
      // tippy options:
      content: () => {
        let content = document.createElement("div");

        if (ele.isEdge()) {
          content.innerHTML = ele.json().data.lineName;
        } else {
          let demand = ele.json().data.currentDemand;
          if (demand) {
            content.innerHTML = demand;
          } else if (label) {
            content.innerHTML = ele.json().data.label;
          } else {
            content.innerHTML = "No data found";
          }
        }

        return content;
      },
      trigger: "manual",
    });
  }

  cy.ready(function () {
    cy.elements().forEach(function (ele) {
      makePopper(ele);
    });
  });

  cy.elements().unbind("mouseover");
  cy.elements().bind("mouseover", (event) => event.target.tippy.show());

  cy.elements().unbind("mouseout");
  cy.elements().bind("mouseout", (event) => event.target.tippy.hide());

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
