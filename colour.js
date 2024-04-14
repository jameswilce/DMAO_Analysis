let cellcolour = "134,212,232,255";

const str = cellcolour;
const arr = str.split(",");
let rgbValue = cellcolour.split(",");
//.splice(0, 3).join(",");

console.log(rgbValue[0]);

function setup() {
  createCanvas(50, 50);
}

function draw() {
  noStroke();

  fill(rgbValue[0], rgbValue[1], rgbValue[2]);
  //fill(134,212,232);
 // fill(rgbValue[0]+", "+rgbValue[1]+" , "+rgbValue[2]);
  ellipse(width / 2, height / 2, 30, 30);
}
