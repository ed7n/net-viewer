/**
 * Viewer: Event Setup
 *
 * A single call to `setupEvents` makes the magic happen.
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
import {
  alertFileProperties,
  reset,
  update,
  getButtons,
  getOutput,
  getOutputs,
  getReader,
  getRoot,
  getSource,
} from "./common/application-functions.mjs";
import * as ECC from "./common/ecc.mjs";
import {
  OPTIONS_COALESCE,
  OPTIONS_COALESCE_INVERT,
  addActionListener,
  addBooleanListener,
  addClassListener,
  addPropertyListener,
  addStyleVariableListener,
} from "./common/events.mjs";
import { collapseAll, expandAll, setForceDark } from "./common/views.mjs";

/** Enable coalescing and append with "deg". */
const OPTIONS_COALESCE_DEG = Object.freeze({ coalesce: true, suffix: "deg" });
/** Enable coalescing and append with "em". */
const OPTIONS_COALESCE_EM = Object.freeze({ coalesce: true, suffix: "em" });
/** Enable coalescing and append with "%". */
const OPTIONS_COALESCE_PERCENT = Object.freeze({ coalesce: true, suffix: "%" });
/** Enable coalescing and append with "px". */
const OPTIONS_COALESCE_PX = Object.freeze({ coalesce: true, suffix: "px" });

/** Adds event listeners and their handlers to elements. */
export function setupEvents() {
  setupApplicationEvents();
  setupButtonEvents();
  setupEntryEvents();
  setupFileEvents();
  setupFormEvents();
  setupWindowEvents();
  setupViewEvents();
}

/** To be run after modification. */
export function doAfterModify(entry) {}

/** For use during the window `beforeunload` event. */
export function doBeforeUnload(event) {}

/** Adds listeners to entries that modify the application. */
function setupApplicationEvents() {
  getMenuEntry("applicationEcc").element.addEventListener("change", (event) => {
    ECC.setBypass(!event.target.checked);
  });
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
  addClassListener(
    text.rightToLeft,
    output.text,
    "right-to-left",
    OPTIONS_COALESCE
  );
  addClassListener(text.wordWrap, output.text, "word-wrap", OPTIONS_COALESCE);
  addClassListener(transform.reverse, output.root, "reverse", OPTIONS_COALESCE);
  addStyleVariableListener(filter, "blur", OPTIONS_COALESCE_PX);
  addStyleVariableListener(filter, "brightness", OPTIONS_COALESCE);
  addStyleVariableListener(filter, "contrast", OPTIONS_COALESCE);
  addStyleVariableListener(filter, "grayscale", OPTIONS_COALESCE_PERCENT);
  addStyleVariableListener(filter, "hueRotate", OPTIONS_COALESCE_DEG);
  addStyleVariableListener(filter, "invert", OPTIONS_COALESCE_PERCENT);
  addStyleVariableListener(filter, "saturate", OPTIONS_COALESCE);
  addStyleVariableListener(filter, "sepia", OPTIONS_COALESCE_PERCENT);
  addStyleVariableListener(position, "align", OPTIONS_COALESCE);
  addStyleVariableListener(position, "justify", OPTIONS_COALESCE);
  addStyleVariableListener(text, "fontFamily", OPTIONS_COALESCE);
  addStyleVariableListener(text, "fontSize", OPTIONS_COALESCE_EM);
  addStyleVariableListener(text, "lineHeight", OPTIONS_COALESCE);
  addStyleVariableListener(transform, "rotate", OPTIONS_COALESCE_DEG);
  addStyleVariableListener(transform, "scale", OPTIONS_COALESCE);
  ["audio", "video"].forEach((key) => {
    const element = output[key].element;
    addBooleanListener(media.autoplay, element, "autoplay");
    addBooleanListener(media.repeat, element, "loop");
    addBooleanListener(
      media.withPitch,
      element,
      "preservesPitch",
      OPTIONS_COALESCE_INVERT
    );
    addPropertyListener(media.speed, element, "playbackRate", OPTIONS_COALESCE);
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

/** Adds listeners to entries that modify the view. */
function setupViewEvents() {
  addClassListener(getMenuEntry("viewControls"), getRoot(), "no-panels", {
    invert: true,
  });
  addClassListener(getMenuEntry("viewReverse"), getRoot(), "reverse");
  getMenuEntry("viewForceDark").element.addEventListener("change", (event) => {
    setForceDark(event.target.checked);
  });
}

/** Adds listeners to the window. */
function setupWindowEvents() {}
