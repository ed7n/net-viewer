/**
 * Viewer: Event Setup
 *
 * A single call to `setupEvents` makes the magic happen.
 */

import { MESSAGES } from "./constants.mjs";
import { application } from "./application-model.mjs";
import {
  close,
  loadFile,
  loadReader,
  loadUrl,
  doScan,
  undoScan,
  getFilterEntries,
  getFrameEntry,
  getFrameEntries,
  getMediaEntry,
  getMediaEntries,
  getMenuEntry,
  getPositionEntries,
  getTextEntries,
  getTransformEntries,
  getView,
} from "./application-functions.mjs";
import { MESSAGES as COMMON_MESSAGES } from "./common/constants.mjs";
import { getInputSafeValue } from "./common/functions.mjs";
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
  OPTIONS_INVERT,
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
  setupOutputEvents();
  setupViewEvents();
  setupWindowEvents();
}

/** To be run after modification. */
export function doAfterModify(entry) {}

/** For use during the window `beforeunload` event. */
export function doBeforeUnload(event) {
  event.preventDefault();
  event.returnValue = COMMON_MESSAGES.windowUnload;
  return COMMON_MESSAGES.windowUnload;
}

/** Adds listeners to entries that modify the application. */
function setupApplicationEvents() {
  getMenuEntry("applicationEcc").element.addEventListener("change", (event) => {
    ECC.setBypass(!getInputSafeValue(event.target));
  });
}

/** Adds listeners to buttons that invoke actions. */
function setupButtonEvents() {
  const buttons = getButtons();
  const controls = [
    getFilterEntries,
    getFrameEntries,
    getMediaEntries,
    getPositionEntries,
    getTextEntries,
    getTransformEntries,
  ];
  addActionListener(buttons.applicationPwa, () => open("pwa", "_blank"));
  addActionListener(buttons.fileEject, close);
  addActionListener(buttons.fileLoad, () => getSource().element.click());
  addActionListener(buttons.fileLoadUrl, () => {
    const response = prompt(MESSAGES.loadUrl, getOutput("frame").element.src);
    if (response && response.length) {
      loadUrl(response);
    }
  });
  addActionListener(buttons.fileProperties, alertFileProperties);
  [
    ["filter", getFilterEntries],
    ["frame", getFrameEntries],
    ["media", getMediaEntries],
    ["position", getPositionEntries],
    ["text", getTextEntries],
    ["transform", getTransformEntries],
  ].forEach(([key, getter]) => {
    getter = [getter];
    addActionListener(buttons[key + "Reset"], () => {
      reset(getter);
      update(getter);
    });
  });
  [
    ["N05", -5],
    ["N20", -20],
    ["P05", 5],
    ["P20", 20],
  ].forEach(([key, operand]) => {
    addActionListener(buttons["mediaJump" + key], () => {
      const view = getView();
      switch (view) {
        case "audio":
        case "video":
          getOutput(view).element.currentTime += operand;
      }
    });
  });
  addActionListener(buttons.mediaShowControls, () => {
    getOutput("audio").element.controls = true;
    getOutput("video").element.controls = true;
  });
  addActionListener(buttons.resetControls, () => {
    if (confirm(MESSAGES.resetControls)) {
      reset(controls);
      update(controls);
    }
  });
  addActionListener(buttons.viewCollapse, collapseAll);
  addActionListener(buttons.viewExpand, expandAll);
  const release = (event) => {
    undoScan();
    event.target.releasePointerCapture(event.pointerId);
  };
  [
    ["Faster", 2],
    ["Slower", 0.5],
  ].forEach(([key, factor]) => {
    const element = buttons["mediaScan" + key].element;
    element.addEventListener("contextmenu", (event) => event.preventDefault());
    element.addEventListener("lostpointercapture", release);
    element.addEventListener("pointerdown", (event) => {
      doScan(factor);
      event.target.setPointerCapture(event.pointerId);
    });
    element.addEventListener("pointerup", release);
  });
}

/** Adds listeners to entries that update outputs. */
function setupEntryEvents() {
  const filter = getFilterEntries();
  const media = getMediaEntries();
  const output = getOutputs();
  const position = getPositionEntries();
  const text = getTextEntries();
  const transform = getTransformEntries();
  addClassListener(getFrameEntry("solid"), output.frame, "solid");
  addClassListener(
    text.rightToLeft,
    output.text,
    "right-to-left",
    OPTIONS_COALESCE
  );
  addClassListener(text.wordWrap, output.text, "word-wrap", OPTIONS_COALESCE);
  addClassListener(transform.invert, output.root, "invert", OPTIONS_COALESCE);
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
    loadFile(getInputSafeValue(event.target));
  });
}

/** Adds listeners to entries that update entries. */
function setupFormEvents() {}

/* Adds listeners to outputs. */
function setupOutputEvents() {
  const doLoadedMetadata = (event) => {
    if (event.target.autoplay) {
      event.target.play();
    }
  };
  const speed = getMediaEntry("speed");
  const doRateChange = (event) => {
    const playbackRate = event.target.playbackRate;
    if (playbackRate !== parseFloat(speed.valueOrLkgOrPreset)) {
      speed.value = playbackRate;
    }
  };
  ["audio", "video"].forEach((key) => {
    const element = getOutput(key).element;
    element.addEventListener("loadedmetadata", doLoadedMetadata);
    element.addEventListener("ratechange", doRateChange);
  });
}

/** Adds listeners to entries that modify the view. */
function setupViewEvents() {
  addClassListener(
    getMenuEntry("viewControls"),
    getRoot(),
    "no-panels",
    OPTIONS_INVERT
  );
  addClassListener(getMenuEntry("viewReverse"), getRoot(), "reverse");
  getMenuEntry("viewForceDark").element.addEventListener("change", (event) => {
    setForceDark(getInputSafeValue(event.target));
  });
}

/** Adds listeners to the window. */
function setupWindowEvents() {}
