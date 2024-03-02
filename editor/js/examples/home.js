function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  fab = createFab();
}

function fabDraw() {
  fab.setERelative();
  fab.fanOff();
  fab.autoHome();
}

function draw() {
  background(255);
  fab.render();
}
