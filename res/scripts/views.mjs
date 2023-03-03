/**
 * Viewer: View Actions
 *
 * Functions that modify the view.
 */

import { getAccordions, getOutput } from "./application-functions.mjs";

/** Closes collapsible fieldsets. */
export function collapseAll() {
  return getAccordions().forEach((accordion) => {
    accordion.element.open = false;
  });
}

/** Opens collapsible fieldsets. */
export function expandAll() {
  return getAccordions().forEach((accordion) => {
    accordion.element.open = true;
  });
}

/** Activates the given output view by its key. */
export function activateView(key) {
  return getOutput(key).element.classList.add("active");
}

/** Deactivates the given output view by its key. */
export function deactivateView(key) {
  return getOutput(key).element.classList.remove("active");
}

/** Sets whether the force dark body flag is enabled. */
export function setForceDark(dark = true) {
  dark
    ? document.body.classList.add("dark")
    : document.body.classList.remove("dark");
}
