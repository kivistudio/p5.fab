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
  fab.autoHome(); // go to home
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