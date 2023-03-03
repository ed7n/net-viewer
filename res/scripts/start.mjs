/**
 * Viewer: Start
 *
 * Start here.
 */

import {
  loadView,
  reset,
  update,
  getEntries,
} from "./application-functions.mjs";
import { setupEvents } from "./events.mjs";

setupEvents();
Object.values(getEntries())
  .filter((entry) => entry.element.type === "number")
  .forEach((entry) => {
    entry.element.placeholder = entry.preset;
  });
reset();
update();
loadView("nul");
