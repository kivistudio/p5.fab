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
    createCanvas(windowWidth, windowHeight, WEBGL);
    fab = createFab();

    fab.configure(printerSettings);

    speedValueText = createP('Speed Value:' + speed);
    speedValueText.position(200, 20);
    speedInput = createSlider(0, 1000, speed, 20);
    speedInput.position(200, 50);
    speedInput.size(200);
   
    extrudeSliderText = createP('Extrude Percent:' + extrudeRate);
    extrudeSliderText.position(200, 80);

    extrudeSlider = createSlider(0, 1000, extrudeRate);
    extrudeSlider.position(200, 110);
    extrudeSlider.size(80);

    
  
    let connectButton = createButton('connect!');
    connectButton.position(20, 20);
    connectButton.mousePressed(function() {
      fab.serial.requestPort(); // choose the serial port to connect to
    });

    let printButton = createButton('print!');
    printButton.position(20, 60);
    printButton.mousePressed(function() {
      fab.print(); // start streaming the commands to printer
    });

    let stopButton = createButton('stop!');
    stopButton.position(20, 100);
    stopButton.mousePressed(function() {
      fab.stopPrint(); // stop streaming the commands to printer.
    });

    let homeButton = createButton('home!');
    homeButton.position(20, 140);
    homeButton.mousePressed(function() {
      fab.autoHome(); // go to home
      fab.print()
    });

    let drawBlobButton = createButton('draw blob!');
    drawBlobButton.position(20, 180);
    drawBlobButton.mousePressed(function() {
      drawBlob();
      fab.refreshModel();
    });

    let drawInitialLineButton = createButton('draw outer line!');
    drawInitialLineButton.position(20, 220);
    drawInitialLineButton.mousePressed(function() {
      drawInitialLine();
      fab.refreshModel();
    });

    let drawSpiralButton = createButton('draw spiral!');
    drawSpiralButton.position(20, 260);
    drawSpiralButton.mousePressed(function() {
      drawSpiral();
      fab.refreshModel();
    });

    let makeVaseButton = createButton('make vase!');
    makeVaseButton.position(20, 300);
    makeVaseButton.mousePressed(function() {
      makeVase();
      fab.refreshModel();
    });

    let makeCubeButton = createButton('make cube!');
    makeCubeButton.position(20, 340);
    makeCubeButton.mousePressed(function() {
      makeCube();
      fab.refreshModel();
    });

    let makeHollowCubeButton = createButton('make hollow cube!');
    makeHollowCubeButton.position(20, 380);
    makeHollowCubeButton.mousePressed(function() {
      makeHollowCube();
      fab.refreshModel();
    });
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
  let newSpeed = speedInput.value();
  if (newSpeed != speed) {
    console.log('override speed: ' + newSpeed);
    speed = newSpeed;
    fab.overrideFeedrate(speed);
    speedValueText.html('Current speed: ' + speed);
  }

  let newExtrudeRate = extrudeSlider.value();
  if (newExtrudeRate != extrudeRate) {
    extrudeRate = newExtrudeRate;
    fab.overrideExtrudeRate(extrudeRate);
    extrudeSliderText.html('Current extrude rate: ' + extrudeRate);
  }
}

