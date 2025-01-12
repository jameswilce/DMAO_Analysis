function filterTable() {
    const odourInput = document.getElementById("odourSelect").value.toLowerCase();
    const familiarityInput = document.getElementById("familiaritySelect").value.toLowerCase();
    const hedonicityInput = document.getElementById("hedonicitySelect").value.toLowerCase();
    const intensityInput = document.getElementById("intensitySelect").value.toLowerCase();
    
    const table = document.getElementById("guestTable");
    const rows = table.getElementsByTagName("tr");

    let filterCount = 0;

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        const cells = rows[i].getElementsByTagName("td");
        const odourCell = cells[4] ? cells[4].textContent.toLowerCase() : "";
        const familiarityCell = cells[5] ? cells[5].textContent.toLowerCase() : "";
        const hedonicityCell = cells[6] ? cells[6].textContent.toLowerCase() : "";
        const intensityCell = cells[7] ? cells[7].textContent.toLowerCase() : "";

        const odourMatch = odourCell.includes(odourInput);
        const familiarityMatch = familiarityCell.includes(familiarityInput);
        const hedonicityMatch = hedonicityCell.includes(hedonicityInput);
        const intensityMatch = intensityCell.includes(intensityInput);

        if (odourMatch && familiarityMatch && hedonicityMatch && intensityMatch) {
            rows[i].style.display = ""; // Show the row
            filterCount++;

        } else {
            rows[i].style.display = "none"; // Hide the row
        }
    }
    document.getElementById('rowCount').innerText = `Results: ${filterCount}`;

}

fetch("dmao.json")
  .then((response) => response.json())
  .then((data) => {
    const specObj = Object.keys(data.guest).filter(key => typeof data.guest[key] == 'object');
    const tbody = document.querySelector("#guestTable tbody");

for (let i = 0; i < specObj.length; i++) {
    const guest = data.guest[specObj[i]]; // Get the guest object
    const excludedKeys = ["age", "gender", "lang", "region"]; // These keys will not be displayed in the table

    // Access the drawingLog
    const drawingLog = data.drawingLog || {};

    // Iterate through the keys of the guest object
    for (const key in guest) {
        if (guest.hasOwnProperty(key) && !excludedKeys.includes(key)) {
            const row = document.createElement("tr");
            const cellk1 = document.createElement("td");
            const cellk2 = document.createElement("td");
            cellk1.textContent = specObj[i];
            cellk2.textContent = key;
            row.appendChild(cellk1);
            row.appendChild(cellk2);

            // This filters the RGBACol to show first 3 elements (it removes the ,255 and any right/left tags)
            if (guest[key].hasOwnProperty("RGBACol")) {
                const rgbCol = guest[key].RGBACol;
                const cellrgb = document.createElement("td");
                if (rgbCol.length >= 3) {
                    cellrgb.textContent = rgbCol.slice(0, 3).join(",");
                } else {
                    cellrgb.textContent = "No colour found.";
                }
                row.appendChild(cellrgb);
            } else {
                const cellrgb = document.createElement("td");
                cellrgb.textContent = "No colour found.";
                row.appendChild(cellrgb);
            }

            // Check if the drawingVertices property exists
            if (guest[key].hasOwnProperty("drawingVertices")) {
                const cellDrawColour = document.createElement("td");
                cellDrawColour.textContent = guest[key].drawingVertices;
                const drawingColour = guest[key].RGBACol;
                row.appendChild(drawShape(cellDrawColour.textContent, drawingColour));
            } else {
                const cellDrawColour = document.createElement("td");
                cellDrawColour.textContent = "No drawing found.";
                row.appendChild(cellDrawColour);
            }

            // Check if the odourselection property exists
            if (guest[key].hasOwnProperty("odourselection")) {
                const cellodour = document.createElement("td");
                cellodour.textContent = guest[key].odourselection;
                row.appendChild(cellodour);
            }

            // Check if the Familiarity property exists
            if (guest[key].hasOwnProperty("Familiarity")) {
                const cellFam = document.createElement("td");
                cellFam.textContent = guest[key].Familiarity;
                row.appendChild(cellFam);
            }

            // Check if the Hedonicity property exists
            if (guest[key].hasOwnProperty("Hedonicity")) {
                const cellHed = document.createElement("td");
                cellHed.textContent = guest[key].Hedonicity;
                row.appendChild(cellHed);
            }

            // Check if the Intensity property exists
            if (guest[key].hasOwnProperty("Intensity")) {
                const cellInt = document.createElement("td");
                cellInt.textContent = guest[key].Intensity;
                row.appendChild(cellInt);
            }

               tbody.appendChild(row);
            }
        }
    }
    updateRowCount();
}
 )
  .catch((error) => console.error("Error reading dmao.json:", error));

function drawShape(vertices, drawingColour) {
  let reduceScale = 10;
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext("2d");

  // Clear the canvas before drawing a new shape
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // create array from drawingVertices parameter in guest object
  const drawingPoints = [];
  if (vertices) {
    for (let i = 0; i < vertices.split(",").length; i += 2) {
      drawingPoints.push({
        x: parseFloat(vertices.split(",")[i] / reduceScale),
        y: parseFloat(vertices.split(",")[i + 1] / reduceScale),
      });
    }
  }
  ctx.beginPath();
  ctx.moveTo(drawingPoints[0].x, drawingPoints[0].y);
  for (let i = 1; i < drawingPoints.length; i++) {
    ctx.lineTo(drawingPoints[i].x, drawingPoints[i].y);
  }
  ctx.closePath();

  const colourArray = Object.values(drawingColour || {});
  ctx.fillStyle = `rgba(${colourArray[0]}, ${colourArray[1]}, ${colourArray[2]}, ${colourArray[3]})`;
  ctx.fill();    
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Create a new td element and append the canvas to it
  const newCell = document.createElement("td");
  newCell.appendChild(canvas);

  return newCell;
}

// Function to update the row count displayed above the guestTable
function updateRowCount() {
    const table = document.getElementById('guestTable');
    const rowCount = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr').length;
    document.getElementById('rowCount').innerText = `Results: ${rowCount}`;
}

// Call this function whenever the table is populated or filtered
// For example, you can call it after adding rows to the table