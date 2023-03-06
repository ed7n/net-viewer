/**
 * Viewer: Start
 *
 * Start here.
 */

import { loadView } from "./application-functions.mjs";
import { setupEvents } from "./events.mjs";
import { reset, update, getEntries } from "./common/application-functions.mjs";

setupEvents();
Object.values(getEntries())
  .filter((entry) => entry.element.type === "number")
  .forEach((entry) => {
    entry.element.placeholder = entry.preset;
  });
reset();
update();
loadView("nul");
