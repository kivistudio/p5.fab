let fab;

let speedInput;
let speedValueText;

let extrudeSlider;
let extrudeSliderText;

let speed = 300;
let extrudeRate = 100;

let gui;
let connectButton, printButton, stopButton, homeButton, drawInitialLineButton, drawSpiralButton, makeCubeButton;

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
    gui = createGui();
    fab = createFab();

    fab.configure(printerSettings);

    speedValueText = createP('Speed Value:' + speed);
    speedValueText.position(200, 20);
    speedInput = createSlider("Speed", 
    200, // x
    50, // y
    128, // width
    32, // height
    0, // min
    1000); // max
   
    extrudeSliderText = createP('Extrude Percent:' + extrudeRate);
    extrudeSliderText.position(200, 80);

    extrudeSlider = createSlider(
      200, // x
      110, // y
      128, // width
      32, // height
      0, // min
      1000); // max

    
  
    connectButton = createButton('connect!', 20, 20);
    printButton = createButton('print!', 20, 60);
    stopButton = createButton('stop!', 20, 100);
    homeButton = createButton('home!', 20, 140);

    drawInitialLineButton = createButton('draw outer line!', 20, 220);

    drawSpiralButton = createButton('draw spiral!', 20, 260);

    makeCubeButton = createButton('make cube!', 20, 340);
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

function draw() {
  background(255);
  fab.render();
  drawGui();
  if (connectButton.isPressed) {
    // Print a message when Button is pressed.
    fab.serial.requestPort(); // choose the serial port to connect to
  }

  if (printButton.isPressed) {
    fab.print(); // start streaming the commands to printer
  }

  if(stopButton.isPressed) {
    fab.stop(); // stop printing
  }

  if(homeButton.isPressed) {
    fab.autoHome(); // home the printer
    fab.print();
  }

  if (drawInitialLineButton.isPressed) {
    drawInitialLine();
    fab.refreshModel();
  }

  if(drawSpiralButton.isPressed) {
    drawSpiral();
    fab.refreshModel();
  }
  
  let newSpeed = speedInput.value;
  if (newSpeed != speed) {
    console.log('override speed: ' + newSpeed);
    speed = newSpeed;
    fab.overrideFeedrate(speed);
    speedValueText.html('Current speed: ' + speed);
  }

  let newExtrudeRate = extrudeSlider.value;
  if (newExtrudeRate != extrudeRate) {
    extrudeRate = newExtrudeRate;
    fab.overrideExtrudeRate(extrudeRate);
    extrudeSliderText.html('Current extrude rate: ' + extrudeRate);
  }
}

