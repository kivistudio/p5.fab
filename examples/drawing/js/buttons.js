function triggerPrintShape() {
  fab.print();
}

function triggerConnectToPrinter() {
  fab.serial.requestPort(); // choose the serial port to connect to
}

function triggerStop() {
  fab.stopPrint(); // stop streaming the commands to printer.
}

function triggerHome() {
  fab.setAbsolutePosition(); // set the coordinate system mode
  fab.setERelative(); // it's easier to work with the extruder axis in relative positioning
  fab.autoHome(); // establish a (0,0,0)
  fab.setTemps(210, 60); // (bedTemp, nozzleTemp). hot!
  fab.print();
}

function triggerDrawSpiral() {
  drawSpiral();
  fab.refreshModel();
}

function triggerDrawHollowCube() {
  makeCube();
  fab.refreshModel();
}

function triggerDrawOuterLine() {
  drawInitialLine();
  fab.refreshModel();
}

function updateFeedrate(newFeedrate) {
  const value = document.querySelector("#feedRate");
  value.textContent = newFeedrate;
  fab.overrideFeedrate(newFeedrate);
}

function updateFlowPercent(newFlowPercent) {
  const value = document.querySelector("#flowPercent");
  value.textContent = newFlowPercent;
  fab.overrideExtrudeRate(newFlowPercent);
}

function triggerDrawingFromVertices() {
  drawVertices();
  fab.refreshModel();
}

function goUp() {
  drawVerticesUp();
  fab.refreshModel();
}

// Drawing

function clearSketch() {
  verticesToDraw = [];
  drawCanvas.clear();
}

function drawTrialCurve() {
  drawCurve();
}