/**
 * Viewer: Event Setup
 *
 * Application event setup. A single call to `setupEvents` makes the magic
 * happen.
 */

import {
  close,
  loadFile,
  loadReader,
  getFilterEntries,
  getMediaEntries,
  getMenuEntry,
  getPositionEntries,
  getTextEntries,
  getTransformEntries,
  getView,
} from "./application-functions.mjs";
import { NUL_STRING } from "./common/constants.mjs";
import {
  alertFileProperties,
  reset,
  update,
  getButtons,
  setModified,
  getOutput,
  getOutputs,
  getReader,
  getRoot,
  getSource,
} from "./common/application-functions.mjs";
import {
  setBooleanProperty,
  setClassWord,
  setInnerHtml,
  setInnerText,
  setProperty,
  setSrc,
  setStyleVariable,
} from "./common/edits.mjs";
import { collapseAll, expandAll, setForceDark } from "./common/views.mjs";

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
  const buttons = getButtons();
  const controls = [
    getFilterEntries,
    getMediaEntries,
    getPositionEntries,
    getTextEntries,
    getTransformEntries,
  ];
  addActionListener(buttons.eject, close);
  addActionListener(buttons.load, () => getSource().element.click());
  addActionListener(buttons.properties, alertFileProperties);
  addActionListener(buttons.pwa, () => location.assign("pwa"));
  addActionListener(buttons.resetControls, () => {
    reset(controls);
    update(controls);
  });
  [
    ["filter", getFilterEntries],
    ["media", getMediaEntries],
    ["position", getPositionEntries],
    ["text", getTextEntries],
    ["transform", getTransformEntries],
  ].forEach(([key, getter]) => {
    addActionListener(buttons[key + "Reset"], () => {
      reset([getter]);
      update([getter]);
    });
  });
  [
    ["searchN05", -5],
    ["searchN20", -20],
    ["searchP05", 5],
    ["searchP20", 20],
  ].forEach(([key, operand]) => {
    addActionListener(buttons[key], () => {
      const view = getView();
      if (view === "audio" || view === "video") {
        getOutput(view).element.currentTime += operand;
      }
    });
  });
  addActionListener(buttons.viewCollapse, collapseAll);
  addActionListener(buttons.viewExpand, expandAll);
}

/** Adds listeners to entries that update outputs. */
function setupEntryEvents() {
  const filter = getFilterEntries();
  const media = getMediaEntries();
  const output = getOutputs();
  const position = getPositionEntries();
  const text = getTextEntries();
  const transform = getTransformEntries();
  addClassListener(text.rightToLeft, output.text, "right-to-left");
  addClassListener(text.wordWrap, output.text, "word-wrap");
  addClassListener(transform.reverse, output.root, "reverse");
  addStyleVariableListener(filter, "blur", "px");
  addStyleVariableListener(filter, "brightness");
  addStyleVariableListener(filter, "contrast");
  addStyleVariableListener(filter, "grayscale", "%");
  addStyleVariableListener(filter, "hueRotate", "deg");
  addStyleVariableListener(filter, "invert", "%");
  addStyleVariableListener(filter, "saturate");
  addStyleVariableListener(filter, "sepia", "%");
  addStyleVariableListener(position, "align");
  addStyleVariableListener(position, "justify");
  addStyleVariableListener(text, "fontFamily");
  addStyleVariableListener(text, "fontSize", "em");
  addStyleVariableListener(text, "lineHeight");
  addStyleVariableListener(transform, "rotate", "deg");
  addStyleVariableListener(transform, "scale");
  ["audio", "video"].forEach((key) => {
    const element = output[key].element;
    addBooleanListener(media.autoplay, element, "autoplay");
    addBooleanListener(media.repeat, element, "loop");
    addBooleanListener(media.withPitch, element, "preservesPitch", true);
    addPropertyListener(media.speed, element, "playbackRate");
  });
}

/** Adds listeners to file operators. */
function setupFileEvents() {
  getReader().addEventListener("load", loadReader);
  getRoot().element.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  getRoot().element.addEventListener("drop", (event) => {
    event.preventDefault();
    if (event.dataTransfer.files.length) {
      loadFile(event.dataTransfer.files);
    }
  });
  getSource().element.addEventListener("change", (event) => {
    loadFile(event.target.files);
  });
}

/** Adds listeners to entries that update entries. */
function setupFormEvents() {}

/** Adds listeners to entries that modifies the view. */
function setupViewEvents() {
  addClassListener(getMenuEntry("viewControls"), getRoot(), "no-panels", true);
  addClassListener(getMenuEntry("viewReverse"), getRoot(), "reverse");
  getMenuEntry("viewForceDark").element.addEventListener("change", (event) => {
    setForceDark(event.target.checked);
  });
}

/** Adds listeners to the window. */
function setupWindowEvents() {}

/**
 * Adds a click event listener to the given button that runs the given function.
 */
function addActionListener(button, action) {
  button.element.addEventListener("click", action);
}

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
function addClassListener(entry, output, classs, invert) {
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
