let colors = ["#FF8C64", "#FFF587", "#FF665A", "#7D6B7D", "#A3A1A8", "#ffcc4d", "#ee726b", "#56a1c4"];
const SQRT3 = Math.sqrt(3);
let invert; // bool, determines which orientation the lines have
let img;

function setup() {
  createCanvas(500*SQRT3, 500);
  img = createGraphics(width, height, WEBGL);
  noLoop();
  img.strokeWeight(0.8);
  shuffle(colors, true);
  invert = random() < 1/3;
}

function draw() {
  let s = 50;
  let t = s*SQRT3;
  let n = 7;
  for (let i = -n; i <= n; i++) {
    for (let j = -n; j <= n; j++) {
      let y = (j*3/2)*s;
      let x = (i*SQRT3 + j*SQRT3/2)*s;
      let mode = random([0, 1]); // which orientation for the hexagon
      let theta0 = 0;
      let k = 0;
      if (mode == 1) {
        theta0 = PI/3;
        k = 2;
      }
      for (let theta = theta0+PI/6; theta < TWO_PI; theta += TWO_PI/3) {
        img.push();
        img.translate(x + cos(theta)*s/2, y + sin(theta)*s/2);
        img.rotate(theta+PI/2);
        img.fill(colors[(k++)%3]);
        makeRhombus(s, t, pow(2, floor(random(4))));
        img.pop();
      }
    }
  }
  
  image(img, 0, 0);
  
  // grain by Ahmad Moussa/GorillaSun
  loadPixels();
  let d = pixelDensity();
  let halfImage = 4 * (width * d) * (height * d);
  for (let i = 0; i < halfImage; i += 4) {
    grainAmount = random(-20, 20);
    pixels[i] = pixels[i]+grainAmount;
    pixels[i + 1] = pixels[i+1]+grainAmount;
    pixels[i + 2] = pixels[i+2]+grainAmount;
    pixels[i + 3] = pixels[i+3]+grainAmount;
  }
  updatePixels();
}

/*
Make a rhombus centered on (0, 0)
s: long, horizontal diagonal
t: short, vertical disagonal
l: number of lines going accross, minus 1
*/

function makeRhombus(s, t, l) {
  img.noStroke();
  img.beginShape();
  img.vertex(0, -s/2);
  img.vertex(t/2, 0);
  img.vertex(0, s/2);
  img.vertex(-t/2, 0);
  img.endShape(CLOSE);
  
  img.stroke(0);
  let a = [0, -s/2]; // top vertex
  let b = [t/2, 0]; // right vertex
  let c = [0, s/2]; // bottom vertex
  let d = [-t/2, 0]; // left vertex
  
  if (invert) {
    [b, d] = [d, b];
  }
  
  for (let z = 0; z <= 1; z += 1/l) {
    let [x1, y1] = prop(a, b, z);
    let [x2, y2] = prop(d, c, z);
    
    img.line(x1, y1, x2, y2);
  }
}
  
function prop(a, b, k) {
  let xC = (1-k)*a[0] + k*b[0];
  let yC = (1-k)*a[1] + k*b[1];
  return [xC, yC];
}
