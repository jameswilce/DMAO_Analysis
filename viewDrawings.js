function filterTable() {
    const odourInput = document.getElementById("odourSelect").value.toLowerCase();
    const familiarityInput = document.getElementById("familiaritySelect").value.toLowerCase();
    const hedonicityInput = document.getElementById("hedonicitySelect").value.toLowerCase();
    const intensityInput = document.getElementById("intensitySelect").value.toLowerCase();
    
    const table = document.getElementById("guestTable");
    const cells = table.getElementsByTagName("td");

    let filterCount = 0;

    for (let i = 1; i < cells.length; i++) { // Start from 1 to skip the header row
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
            cells[i].style.display = ""; // Show the row
            filterCount++;

        } else {
            cells[i].style.display = "none"; // Hide the row
        }
    }
    document.getElementById('rowCount').innerText = `Results: ${filterCount}`;

}

fetch("dmao.json")
  .then((response) => response.json())
  .then((data) => {
    const specObj = Object.keys(data.guest).filter(key => typeof data.guest[key] == 'object');
    const tbody = document.querySelector("#guestTable tbody");

    let row = document.createElement("tr");
    let columnCount = 0;

    for (let i = 0; i < specObj.length; i++) {
        const guest = data.guest[specObj[i]]; // Get the guest object
        const excludedKeys = ["age", "gender", "lang", "region"]; // These keys will not be displayed in the table

        // Access the drawingLog
        const drawingLog = data.drawingLog || {};

        // Iterate through the keys of the guest object
        for (const key in guest) {
            if (guest.hasOwnProperty(key) && !excludedKeys.includes(key)) {
                const cell = document.createElement("td");
                if (guest[key].hasOwnProperty("drawingVertices")) {
                    const cellDrawColour = document.createElement("td");
                    cellDrawColour.textContent = guest[key].drawingVertices;
                    const drawingColour = guest[key].RGBACol;
                    cell.appendChild(drawShape(cellDrawColour.textContent, drawingColour));
                } else {
                    const cellDrawColour = document.createElement("td");
                    cellDrawColour.textContent = "No drawing found.";
                    cell.appendChild(cellDrawColour);
                }
                row.appendChild(cell);
                columnCount++;

                // Start a new row after 8 cells
                if (columnCount === 8) {
                    tbody.appendChild(row);
                    row = document.createElement("tr");
                    columnCount = 0;  
                }
            }
        }
    }
    // Append any remaining cells in the last row
    if (columnCount > 0) {
        tbody.appendChild(row);
    }
    updateCellCount();
  })
  .catch((error) => console.error("Error reading dmao.json:", error));

function drawShape(vertices, drawingColour) {
  let reduceScale = 20;
  const canvas = document.createElement("canvas");
  canvas.width = 50;
  canvas.height = 50;
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

// Function to update the row count displayed above the guestTable
function updateCellCount() {
    const table = document.getElementById('guestTable');
    const cellCount = table.getElementsByTagName('tbody')[0].getElementsByTagName('td').length;
    document.getElementById('cellCount').innerText = `Results: ${cellCount}`;
}