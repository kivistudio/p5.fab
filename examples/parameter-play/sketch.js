let fab;

let speedSlider;
let sliderValueText;

let extrudeSlider;
let extrudeSliderText;

let speed = 10;
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

    speedSlider = createSlider(0, 25, speed);
    speedSlider.position(200, 50);
    speedSlider.size(80);
    sliderValueText = createP('Speed Value:' + speed);
    sliderValueText.position(200, 20);

    extrudeSlider = createSlider(0, 500, extrudeRate);
    extrudeSlider.position(350, 50);
    extrudeSlider.size(80);

    extrudeSliderText = createP('Extrude Percent:' + extrudeRate);
    extrudeSliderText.position(350, 20);
  
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
}

function fabDraw() {
  // setup!
  fab.setAbsolutePosition(); // set the coordinate system mode
  fab.setERelative(); // it's easier to work with the extruder axis in relative positioning
  fab.autoHome(); // establish a (0,0,0)
  fab.setTemps(210, 60); // (bedTemp, nozzleTemp). hot!
  // set defaults
  fab.setFeedrate(speed);
  fab.setExtrudeRate(extrudeRate);
}

function drawBlob() {
  fab.moveRetract(fab.centerX, fab.centerY, 0.2); // moveRetract will move the nozzle without extruding filament
  fab.moveExtrude(fab.centerX, fab.centerY, 1, 0.5, 5);
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

  fab.setFeedrate(speed);
  for (let angle = 0; angle <= numSpirals * TWO_PI; angle += step) {
    let x = r * cos(angle);
    let y = r * sin(angle);

    if (angle == 0) {
      fab.moveRetract(center.x + x, center.y + y, z, 60);
    } else {
      fab.moveExtrude(center.x + x, center.y + y, z);
    }

    r -= 0.1;
  }
  fab.presentPart();
}

function draw() {
  orbitControl(2, 2, 0.1);
  background(255);
  
  fab.render();
  let newSpeed = speedSlider.value();
  if (newSpeed != speed) {
    speed = newSpeed;
    fab.setFeedrate(speed);
    sliderValueText.html('Current speed: ' + speed);
  }

  let newExtrudeRate = extrudeSlider.value();
  if (newExtrudeRate != extrudeRate) {
    extrudeRate = newExtrudeRate;
    fab.setExtrudeRate(extrudeRate);
    extrudeSliderText.html('Current extrude rate: ' + extrudeRate);
  }
}

