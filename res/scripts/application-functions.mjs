/**
 * Viewer: Application Functions
 *
 * Functions operating on the application model. Whenever unavailable, operate
 * directly on the model.
 */

import { FILE_SIZE_MAX_SAFE, MESSAGES } from "./constants.mjs";
import { application } from "./application-model.mjs";
import { doBeforeUnload } from "./events.mjs";
import { activateView, deactivateView } from "./views.mjs";
import {
  NUL_STRING,
  EVENT_INPUT,
  MESSAGES as COMMON_MESSAGES,
} from "./common/constants.mjs";
import { testFile, setWindowSubtitle } from "./common/functions.mjs";
import {
  getControl,
  getFile,
  getOutput,
  getReader,
  getSource,
} from "./common/application-functions.mjs";

/** Closes the current instance. */
export function close() {
  unloadView();
  getSource().value = NUL_STRING;
  loadView("nul");
}

/**
 * Loads the file at the given index of the given list. If successful, then this
 * may be followed by `loadReader`.
 */
export function loadFile(files = getSource().value, index = 0) {
  getSource().element.disabled = true;
  if (files.length) {
    const file = files[index];
    if (testFile(file)) {
      let type;
      switch (file.type) {
        case "application/pdf":
        case "text/html":
          type = "frame";
          break;
        default:
          type = file.type.slice(0, file.type.indexOf("/")).toLowerCase();
      }
      switch (type) {
        case "audio":
        case "frame":
        case "image":
        case "video":
          prepareOutput(file.name, type);
          getOutput(type).element.src = URL.createObjectURL(file);
          getMediaEntry("speed").element.dispatchEvent(EVENT_INPUT);
          getSource().element.disabled = false;
          break;
        default:
          if (file.size <= FILE_SIZE_MAX_SAFE || confirm(MESSAGES.loadLarge)) {
            prepareOutput(file.name, "text");
            getReader().readAsText(file);
          } else {
            getSource().element.disabled = false;
            return;
          }
      }
      return (application.instance.file = file);
    }
  } else {
    alert(COMMON_MESSAGES.loadEmpty);
  }
  getSource().element.disabled = false;
}

/** Loads the reader contents into the text output. */
export function loadReader() {
  const element = getOutput("text").element;
  element.scroll(0, 0);
  element.innerText = getReader().result;
  getSource().element.disabled = false;
}

/** Loads the given URL into the frame output. */
export function loadUrl(url) {
  unloadView();
  loadView("frame");
  getOutput("frame").element.src = url;
}

/** Loads the given output view by its key. */
export function loadView(key) {
  const element = getOutput(key).element;
  activateView(key);
  if (key === "frame") {
    window.addEventListener("beforeunload", doBeforeUnload);
    getOutput("root").element.appendChild(element);
  }
  element.focus();
  application.instance.view = key;
}

/** Unloads the given output view by its key. */
export function unloadView(key = getView()) {
  const element = getOutput(key).element;
  switch (key) {
    case "frame":
      element.remove();
      window.removeEventListener("beforeunload", doBeforeUnload);
    case "audio":
    case "image":
    case "video":
      if (element.src) {
        URL.revokeObjectURL(element.src);
      }
      element.src = NUL_STRING;
      break;
    case "text":
      element.innerText = NUL_STRING;
      break;
  }
  setWindowSubtitle();
  deactivateView(key);
  application.instance.file = null;
}

/** Returns the given filter form entry by its key. */
export function getFilterEntry(key = NUL_STRING) {
  return getControl(getFilterEntries, key);
}

/** Returns filter form entries. */
export function getFilterEntries() {
  return application.entries.filter;
}

/** Returns the given frame form entry by its key. */
export function getFrameEntry(key = NUL_STRING) {
  return getControl(getFrameEntries, key);
}

/** Returns frame form entries. */
export function getFrameEntries() {
  return application.entries.frame;
}

/** Returns the given media form entry by its key. */
export function getMediaEntry(key = NUL_STRING) {
  return getControl(getMediaEntries, key);
}

/** Returns media form entries. */
export function getMediaEntries() {
  return application.entries.media;
}

/** Returns the given menu form entry by its key. */
export function getMenuEntry(key = NUL_STRING) {
  return getControl(getMenuEntries, key);
}

/** Returns menu form entries. */
export function getMenuEntries() {
  return application.entries.menu;
}

/** Returns the current instance name. */
export function getName() {
  return getFile() ? getFile().name : NUL_STRING;
}

/** Returns the given position form entry by its key. */
export function getPositionEntry(key = NUL_STRING) {
  return getControl(getPositionEntries, key);
}

/** Returns position form entries. */
export function getPositionEntries() {
  return application.entries.position;
}

/** Returns the given text form entry by its key. */
export function getTextEntry(key = NUL_STRING) {
  return getControl(getTextEntries, key);
}

/** Returns text form entries. */
export function getTextEntries() {
  return application.entries.text;
}

/** Returns the given transform form entry by its key. */
export function getTransformEntry(key = NUL_STRING) {
  return getControl(getTransformEntries, key);
}

/** Returns transform form entries. */
export function getTransformEntries() {
  return application.entries.transform;
}

/** Returns the current output view. */
export function getView() {
  return application.instance.view;
}

/** Prepares the given output view with the given title. */
function prepareOutput(title = NUL_STRING, view = "text") {
  unloadView();
  setWindowSubtitle(title);
  loadView(view);
}
