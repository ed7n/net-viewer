/**
 * Viewer: Event Setup
 *
 * Application event setup. A single call to `setupEvents` makes the magic
 * happen.
 */

import { NUL_STRING } from "./constants.mjs";
import {
  alertFileProperties,
  loadFile,
  loadReader,
  loadView,
  unloadView,
  update,
  getButton,
  getCoreEntries,
  getDisplayEntries,
  getMenuEntry,
  getOutput,
  getOutputs,
  getReader,
  getRoot,
  getSource,
} from "./application-functions.mjs";
import {
  setBooleanProperty,
  setClassWord,
  setInnerHtml,
  setInnerText,
  setProperty,
  setSrc,
  setStyleVariable,
} from "./edits.mjs";
import { setForceDark } from "./views.mjs";

/** Set post-modification events? */
let anesthesia = true;

/** Undoes and disables setting of post-modification events. */
export function induceAnesthesia() {
  anesthesia = true;
  setModified(false);
  window.removeEventListener("beforeunload", doBeforeUnload);
}

/** Resumes setting of post-modification events. */
export function removeAnesthesia() {
  anesthesia = false;
}

/** Adds event listeners and their handlers to elements. */
export function setupEvents() {
  setupButtonEvents();
  setupEntryEvents();
  setupFileEvents();
  setupFormEvents();
  setupWindowEvents();
  setupViewEvents();
}

/** Adds listeners to buttons that invoke actions. */
function setupButtonEvents() {
  getButton("close").element.addEventListener("click", () => {
    unloadView();
    getSource().value = NUL_STRING;
    loadView("nul");
  });
  getButton("load").element.addEventListener("click", () => {
    getSource().element.click();
  });
  getButton("properties").element.addEventListener("click", alertFileProperties);
  getButton("pwa").element.addEventListener("click", () => {
    location.assign("pwa");
  });
  getButton("resetControls").element.addEventListener("click", () => {
    [getCoreEntries, getDisplayEntries].forEach((getter) => {
      Object.values(getter()).forEach((entry) => {
        entry.value = entry.preset;
      });
    });
    update();
  });
}

/** Adds listeners to entries that update outputs. */
function setupEntryEvents() {
  const core = getCoreEntries();
  const display = getDisplayEntries();
  const output = getOutputs();
  ["audio", "video"].forEach((key) => {
    const element = output[key].element;
    addBooleanListener(core.withPitch, element, "preservesPitch", true);
    addPropertyListener(core.speed, element, "playbackRate");
  });
  addClassListener(core.wordWrap, output.text, "word-wrap");
  addStyleVariableListener(core, "fontFamily");
  addStyleVariableListener(core, "fontScale", "em");
  addStyleVariableListener(core, "lineHeight");
  addStyleVariableListener(display, "align");
  addStyleVariableListener(display, "blur", "px");
  addStyleVariableListener(display, "brightness", "%");
  addStyleVariableListener(display, "contrast", "%");
  addStyleVariableListener(display, "hue", "deg");
  addStyleVariableListener(display, "invert", "%");
  addStyleVariableListener(display, "justify");
  addStyleVariableListener(display, "saturation", "%");
  addStyleVariableListener(display, "sepia", "%");
}

/** Adds listeners to file operators. */
function setupFileEvents() {
  ["audio", "video"].forEach((key) => {
    getOutput(key).element.addEventListener("loadedmetadata", () => {
      getSource().element.disabled = false;
    });
  });
  getReader().addEventListener("load", loadReader);
  getRoot().element.addEventListener("drop", (event) => {
    event.preventDefault();
    loadFile(event.dataTransfer.files);
  });
  getRoot().element.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  getSource().element.addEventListener("change", (event) => {
    loadFile(event.target.files);
  });
}

/** Adds listeners to entries that update entries. */
function setupFormEvents() {}

/** Adds listeners to entries that modifies the view. */
function setupViewEvents() {
  addClassListener(getMenuEntry("controls"), getRoot(), "no-controls", true);
  getMenuEntry("forceDark").element.addEventListener("change", (event) => {
    setForceDark(event.target.checked);
  });
  addClassListener(getMenuEntry("reverse"), getRoot(), "reverse");
}

/** Adds listeners to the window. */
function setupWindowEvents() {}

/**
 * Adds a `beforeunload` event listener to the window by modified flag and the
 * given entry.
 */
function addBeforeUnloadListenerBy(entry) {}

/**
 * Adds a change event listener to the given entry that sets the given boolean
 * property.
 */
function addBooleanListener(entry, object, key, invert) {
  entry.element.addEventListener("change", () => {
    if (setBooleanProperty(entry, object, key, invert) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds a change event listener to the given entry that sets the visibility of
 * the given class word of the given output.
 */
function addClassListener(entry, output, classs = NUL_STRING, invert) {
  entry.element.addEventListener("change", () => {
    if (setClassWord(output, classs, entry, invert) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds an input event listener to the given entry that sets the inner HTML of
 * the given output.
 */
function addHtmlListener(entry, output) {
  entry.element.addEventListener("input", () => {
    if (setInnerHtml(output, entry) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds an input event listener to the given entry that sets the given property.
 */
function addPropertyListener(entry, object, key) {
  entry.element.addEventListener("input", () => {
    if (setProperty(entry, object, key) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds a change event listener to the given entry that sets the source of the
 * given output.
 */
function addSrcListener(entry, output) {
  entry.element.addEventListener("change", () => {
    if (setSrc(output, entry) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds an input event listener to the given entry that sets the given style of
 * the given output.
 */
function addStyleListener(
  entry,
  output,
  style = NUL_STRING,
  suffix = NUL_STRING
) {
  entry.element.addEventListener("input", () => {
    if (setStyle(output, style, entry, suffix) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds an input event listener to the given entry by its key that sets the
 * given style variable of the application root element by the same key.
 */
function addStyleVariableListener(
  entries,
  key = NUL_STRING,
  suffix = NUL_STRING
) {
  const entry = entries[key];
  entry.element.addEventListener("input", () => {
    if (setStyleVariable(key, entry, suffix) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds an input event listener to the given entry that sets the inner text of
 * the given output.
 */
function addTextListener(entry, output) {
  entry.element.addEventListener("input", () => {
    if (setInnerText(output, entry) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/** To be run after modification. */
function doAfterModify(entry) {}

/** For use during the window `beforeunload` event. */
function doBeforeUnload(event) {}

/** Returns whether it is setting post-modification events. */
function hasAnesthesia() {
  return anesthesia;
}
