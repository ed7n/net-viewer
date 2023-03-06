/**
 * Viewer: View Actions
 *
 * Functions that modify the view.
 */

import { getOutput } from "./common/application-functions.mjs";

/** Activates the given output view by its key. */
export function activateView(key) {
  return getOutput(key).element.classList.add("active");
}

/** Deactivates the given output view by its key. */
export function deactivateView(key) {
  return getOutput(key).element.classList.remove("active");
}
