/**
 * Viewer: Start
 *
 * Start here.
 */

import { loadView, getMenuEntry } from "./application-functions.mjs";
import { setupEvents } from "./events.mjs";
import { reset, update, getEntries } from "./common/application-functions.mjs";

const parameters = new URLSearchParams(location.search);

setupEvents();
Object.values(getEntries())
  .filter((entry) => entry.element.type === "number")
  .forEach((entry) => {
    entry.element.placeholder = entry.preset;
  });
reset();
if (parameters.has("controls")) {
  getMenuEntry("viewControls").value = true;
}
if (parameters.has("dark")) {
  getMenuEntry("viewForceDark").value = true;
}
if (parameters.has("ecc")) {
  getMenuEntry("ecc").value = true;
}
update();
loadView("nul");
