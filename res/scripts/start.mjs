/**
 * Viewer: Start
 *
 * Start here.
 */

import { loadView, getMenuEntry } from "./application-functions.mjs";
import { setupEvents } from "./events.mjs";
import { EVENT_CHANGE } from "./common/constants.mjs";
import { reset, update, getEntries } from "./common/application-functions.mjs";

const PARAMS = Object.freeze({
  controls: Object.freeze({
    getter: getMenuEntry,
    key: "viewControls",
    value: true,
  }),
  dark: Object.freeze({
    getter: getMenuEntry,
    key: "viewForceDark",
    value: true,
  }),
  ecc: Object.freeze({
    getter: getMenuEntry,
    key: "applicationEcc",
    value: true,
  }),
  reverse: Object.freeze({
    getter: getMenuEntry,
    key: "viewReverse",
    value: true,
  }),
});

const argumentss = new URLSearchParams(location.search);

setupEvents();
Object.values(getEntries())
  .filter((entry) => entry.element.type === "number")
  .forEach((entry) => {
    entry.element.placeholder = entry.preset;
  });
reset();
update();
Object.entries(PARAMS).forEach(([argument, handle]) => {
  if (argumentss.has(argument)) {
    const entry = handle.getter(handle.key);
    entry.value = handle.value;
    entry.element.dispatchEvent(EVENT_CHANGE);
  }
});
loadView("nul");
