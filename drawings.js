
let drawingPoints = [{ x: 100.0, y: 50.0 },
  { x: 35.8, y: 34.3 },
  { x: 19.3, y: 96.6 },
  { x: 0, y: 60.2 },
  { x: 19.3, y: 3.4 },
  { x: 76.8, y: 19.7 },
];

const strPoints = "775,682,1000,553,0,651,332,318";
//const drawingPoints_Str = strPoints.split(',').map(vertex => ({ x: parseInt(vertex.split(' ')[0]), y: parseInt(vertex.split(' ')[1])}));

let reduceScale = 10; // value to divide vertices by to reduce size of shape

const drawingPoints_Str = [];
for (let i = 0; i < strPoints.split(',').length; i += 2) {
  drawingPoints_Str.push({ x: parseFloat(strPoints.split(',')[i] / reduceScale), y: parseFloat(strPoints.split(',')[i + 1] / reduceScale) });
}

console.log(drawingPoints_Str);


function setup() {
  createCanvas(100, 100);
  frameRate(60);
  stroke(0);
  strokeWeight(0.5);
  rect(0, 0, 100, 100);
}

function draw() {

  background(255);

  beginShape();
  for (let i = 0; i < drawingPoints_Str.length; i++) {

    vertex(drawingPoints_Str[i].x, drawingPoints_Str[i].y);
  }

  fill(209, 227, 145);

  endShape(CLOSE);

  // this adds circles to the vertices, if set to 0 they are off
  for (let i = 0; i < drawingPoints_Str.length; i++) {
    ellipse(drawingPoints_Str[i].x, drawingPoints_Str[i].y, 0);
  }
}
