function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  fab = createFab();
}

function fabDraw() {
  fab.setERelative();
  fab.fanOff();
  fab.autoHome();
  fab.setTemps(210, 50); // wait for nozzle & bed to heat up
  fab.introLine(); // line back and forth to clean nozzle

  let z = 0.2;
  let speed = 5;

  fab.moveRetract(0, 0, z);
  fab.moveExtrude(0, 50, z, speed);
  fab.moveRetract(20, 0, z);
  fab.moveExtrude(20, 50, z, speed);
  fab.moveRetract(40, 0, z);
  fab.moveExtrude(40, 50, z, speed);
  fab.moveRetract(60, 0, z);
  fab.moveExtrude(60, 50, z, speed);
}

function draw() {
  background(255);
  fab.render();
}
