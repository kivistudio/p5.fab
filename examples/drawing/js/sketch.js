let fab;

let speedInput;
let speedValueText;

let extrudeSlider;
let extrudeSliderText;

let speed = 300;
let extrudeRate = 100;

const printerSettings = {
  "name": "Q5",
  "baudRate": 115200,
  "radius": 100,
  "maxZ": 200,
  "nozzleDiameter": 1,
  "filamentDiameter": 1.75,
  "coordinateSystem": "delta"
};

function setup() {
    let width = 600;
    let height = 400;
    let canvas = createCanvas(width, height, WEBGL);
    canvas.parent('sketch-container');
    fab = createFab();

    fab.configure(printerSettings);
}

function makeCube() {
  
  // variables for our hollow cube!
  let sideLength = 50; //mm
  let x = fab.centerX; 
  let y = fab.centerY;
  let layerHeight = 0.4; // mm

  // design our hollow cube!
  fab.moveRetract(x, y, layerHeight); // move to the start (x,y,z) position without extruding

  let z = 0;
  for (let i = 0 ; z <= sideLength; i += 1) {
    z= i * layerHeight;
    fab.moveExtrude(x + sideLength, y, z, 10); // move along the bottom side while extruding filament
    fab.moveExtrude(x + sideLength, y + sideLength, z, 10); // right side
    fab.moveExtrude(x, y + sideLength, z, 10); // top side
    fab.moveExtrude(x, y, z, 10); //left side
  }

  fab.presentPart();
}

function fabDraw() {
  // setup!
  fab.setAbsolutePosition(); // set the coordinate system mode
  fab.setERelative(); // it's easier to work with the extruder axis in relative positioning
  fab.autoHome(); // establish a (0,0,0)
  fab.setTemps(210, 60); // (bedTemp, nozzleTemp). hot!
}

function drawBlob() {
  fab.moveRetract(fab.centerX, fab.centerY, 0.5); // moveRetract will move the nozzle without extruding filament
  fab.moveExtrude(fab.centerX, fab.centerY, 2, 0.5, 5);
  fab.presentPart(); // pull the nozzle away, and retract a bit of filament to stop oozing!
}

function drawInitialLine() {
  fab.introLine();
}

function drawSpiral() {
  // make a spiral!
  let r = 80; // outer radius
  let numSpirals = 8; // how many concentric spirals to make
  let center = createVector(fab.centerX, fab.centerY); // center the spiral on the print bed
  let z = 0.2;
  let step = TWO_PI / 100;
  let speed = 10; // move slowly for adhesion

  for (let angle = 0; angle <= numSpirals * TWO_PI; angle += step) {
    let x = r * cos(angle);
    let y = r * sin(angle);

    if (angle == 0) {
      fab.moveRetract(center.x + x, center.y + y, z, 3 * speed);
    } else {
      fab.moveExtrude(center.x + x, center.y + y, z, speed);
    }

    r -= 0.1;
  }
  fab.presentPart();
}

function makeHollowCube() {
  
  // variables for our hollow cube!
  let sideLength = 50; //mm
  let x = fab.centerX; 
  let y = fab.centerY;
  let speed = 10; // mm/sec
  let layerHeight = 0.2; // mm

  // design our hollow cube!
  fab.moveRetract(x, y, layerHeight); // move to the start (x,y,z) position without extruding

  for (let z = layerHeight; z <= sideLength; z += layerHeight) { 
    if (z == layerHeight) { // if it's the first layer
    speed = 10; // slow print speeed down for the first layer
    }
    else {
      speed = 25;
    }
    fab.moveExtrude(x + sideLength, y, z, speed); // move along the bottom side while extruding filament
    fab.moveExtrude(x + sideLength, y + sideLength, z, speed); // right side
    fab.moveExtrude(x, y + sideLength, z, speed); // top side
    fab.moveExtrude(x, y, z, speed); //left side
  }

  fab.presentPart();
  fab.render();
}

function makeVase() {
  // setup printing variables
  // this is a standard setup block:
  fab.fanOff();
    
  /* design your artifact here!
   *  here's a vase line vase, based on LIA's 'Filament Sculptures' 
   * https://www.liaworks.com/theprojects/filament-sculptures/
   */

  let startHeight = 0.2;
  let o = 2;
  let s = 40;
  let x = fab.centerX;
  let y = fab.centerY;
  let sf = 0;
  let maxL = 40;
  let l = 40;
  fab.moveRetract(x, y, startHeight); // move to start
  //for (let h = startHeight; h <= l; h += o) { 
    // lines
    let h = startHeight;
    /*fab.moveExtrude(x + l, y+sf, h);
    fab.moveExtrude(x + l - sf, y + l, h);
    fab.moveExtrude(x, y + l - sf, h);
    fab.moveExtrude(x + sf, y, h);*/

    // dots
    fab.moveExtrude(x, y, h + o, 0.4, 10); // move slowly and extrude lots of filament on the dots
    fab.moveRetract(x + l, y, h, 3 * s); // move quickly from point to point to reduce stringing
    fab.moveExtrude(x + l, y, h + o, 0.4, 10);
    fab.moveRetract(x + l - sf, y + l, h, 3 * s);
    fab.moveExtrude(x + l - sf, y + l, h + o, 0.4, 10);
    fab.moveRetract(x, y + l - sf, h, 3 * s);
    fab.moveExtrude(x, y + l - sf, h + o, 0.4, 10);

    fab.moveRetract(x + sf, y, h + o, s);
  //}
  // end artifact

  fab.presentPart(); // pop the bed out. 
}

function draw() {
  orbitControl(2, 2, 0.1);
  background(255);
  
  fab.render();
}

