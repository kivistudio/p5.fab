let fab;

var s = ( p5Instance ) => { // p could be any variable name
  p5Instance.setup = function() {
    p5Instance.createCanvas(600, 400, p5Instance.WEBGL);
    fab = p5Instance.createFab();
    fab.configure(printerSettings);
  };

  p5Instance.fabDraw = function() {
    // setup!
    fab.setAbsolutePosition(); // set the coordinate system mode
    fab.setERelative(); // it's easier to work with the extruder axis in relative positioning
    fab.autoHome(); // establish a (0,0,0)
    fab.setTemps(210, 60); // (bedTemp, nozzleTemp). hot!
  }

  p5Instance.draw = function() {
    p5Instance.orbitControl(2, 2, 0.1);
    p5Instance.background(255);
    fab.render();
  };
}

let myp5 = new p5(s, 'sketch-container');


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

function drawInitialLine() {
  fab.introLine();
}

function drawSpiral() {
  // make a spiral!
  let r = 80; // outer radius
  let numSpirals = 8; // how many concentric spirals to make
  let center = myp5.createVector(fab.centerX, fab.centerY); // center the spiral on the print bed
  let z = 0.2;
  let step = myp5.TWO_PI / 100;
  let speed = 10; // move slowly for adhesion

  for (let angle = 0; angle <= numSpirals * myp5.TWO_PI; angle += step) {
    let x = r * myp5.cos(angle);
    let y = r * myp5.sin(angle);

    if (angle == 0) {
      fab.moveRetract(center.x + x, center.y + y, z, 3 * speed);
    } else {
      fab.moveExtrude(center.x + x, center.y + y, z, speed);
    }

    r -= 0.1;
  }
  fab.presentPart();
}