/**
 * Viewer: Application Functions
 *
 * Functions operating on the application model. Whenever unavailable, operate
 * directly on the model.
 */

import {
  NUL_OBJECT,
  NUL_STRING,
  EVENT_CHANGE,
  EVENT_INPUT,
  MESSAGES,
} from "./constants.mjs";
import { defaultOrAsIs, testFile, setWindowSubtitle } from "./functions.mjs";
import { application } from "./application-model.mjs";
import { activateView, deactivateView } from "./views.mjs";

/** For use with `getEntries`. */
const entries = (() => {
  let out = {};
  Object.entries(application.entries).forEach(([key, value]) => {
    Object.entries(value).forEach(([subKey, value]) => {
      out[key + subKey.charAt(0).toUpperCase + subKey.substring(1)] = value;
    });
  });
  return Object.freeze(out);
})();

/** Alerts the current file properties. */
export function alertFileProperties() {
  const file = getFile();
  if (file) {
    alert(
      "Name: " +
        file.name +
        "\nType: " +
        file.type +
        "\nSize: " +
        file.size +
        " bytes\nLast modified: " +
        new Date(file.lastModified).toISOString()
    );
  } else {
    alert(MESSAGES.fileNul);
  }
}

/** Downloads the given file by its name and URL. */
export function download(name = NUL_STRING, url = NUL_STRING) {
  const href = application.anchor.href;
  application.anchor.download = name;
  if (href !== url) {
    if (href) {
      URL.revokeObjectURL(href);
    }
    application.anchor.href = url;
  }
  application.anchor.click();
}

/**
 * Loads the file at the given index of the given list. If successful, then this
 * may be followed by `loadReader`.
 */
export function loadFile(files = getSource().valueOrPreset, index = 0) {
  getSource().element.disabled = true;
  if (files.length) {
    const file = files[index];
    if (testFile(file)) {
      let type = file.type;
      type =
        type === "application/pdf" || type === "text/html"
          ? "frame"
          : type.slice(0, type.indexOf("/")).toLowerCase();
      unloadView();
      setWindowSubtitle(file.name);
      switch (type) {
        case "frame":
        case "image":
          getSource().element.disabled = false;
        case "audio":
        case "video":
          loadView(type);
          getOutput(type).element.src = URL.createObjectURL(file);
          getCoreEntry("speed").element.dispatchEvent(EVENT_INPUT);
          break;
        default:
          loadView("text");
          getReader().readAsText(file);
      }
      return (application.instance.file = file);
    }
  } else {
    alert(MESSAGES.loadEmpty);
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

/** Loads the given output view by its key. */
export function loadView(key) {
  activateView(key);
  getOutput(key).element.focus();
  application.instance.view = key;
}

/** Unloads the given output view by its key. */
export function unloadView(key = getView()) {
  switch (key) {
    case "audio":
    case "frame":
    case "image":
    case "video":
      const element = getOutput(key).element;
      if (element.src) {
        URL.revokeObjectURL(element.src);
      }
      element.src = NUL_STRING;
      break;
    case "text":
      getOutput(key).element.innerText = NUL_STRING;
      break;
  }
  setWindowSubtitle();
  deactivateView(key);
  application.instance.file = null;
}

/**
 * Populates form entries with the given values. This is opposite to `preserve`.
 */
export function populate(values = NUL_OBJECT) {
  return Object.entries(getEntries()).forEach(([key, entry]) => {
    entry.value = defaultOrAsIs(entry.preset, values[key]);
  });
}

/** Returns a snapshot of form entry values. This is opposite to `populate`. */
export function preserve() {
  return Object.freeze(
    Object.entries(getEntries()).forEach(([key, entry]) => {
      out[key] = entry.safeValue;
    })
  );
}

/** Resets form entries. */
export function reset() {
  return Object.values(getEntries()).forEach((entry) => {
    entry.value = entry.preset;
  });
}

/** Dispatches change or input events on form entries. */
export function update() {
  return Object.values(getEntries()).forEach((entry) => {
    entry.element.dispatchEvent(
      entry.element.type === "checkbox" || entry.element.type === "file"
        ? EVENT_CHANGE
        : EVENT_INPUT
    );
  });
}

/** Returns collapsible fieldsets. */
export function getAccordions() {
  return application.accordions;
}

/** Returns the given form button by its key. */
export function getButton(key = NUL_STRING) {
  return getControl(getButtons, key);
}

/** Returns form buttons. */
export function getButtons() {
  return application.buttons;
}

/** Returns the given core form entry by its key. */
export function getCoreEntry(key = NUL_STRING) {
  return getControl(getCoreEntries, key);
}

/** Returns core form entries. */
export function getCoreEntries() {
  return application.entries.core;
}

/** Returns the given display form entry by its key. */
export function getDisplayEntry(key = NUL_STRING) {
  return getControl(getDisplayEntries, key);
}

/** Returns display form entries. */
export function getDisplayEntries() {
  return application.entries.display;
}

/** Returns the given form entry by its key. */
export function getEntry(key = NUL_STRING) {
  return getControl(getEntries, key);
}

/** Returns form entries. */
export function getEntries() {
  return entries;
}

/** Returns the current working file. */
export function getFile() {
  return application.instance.file;
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

/** Returns the given output by its key. */
export function getOutput(key = NUL_STRING) {
  return getControl(getOutputs, key);
}

/** Returns outputs. */
export function getOutputs() {
  return application.outputs;
}

/** Returns the file reader. */
export function getReader() {
  return application.reader;
}

/** Returns the root element. */
export function getRoot() {
  return application.root;
}

/** Returns the source file input. */
export function getSource() {
  return application.source;
}

/** Returns the current output view. */
export function getView() {
  return application.instance.view;
}

/** Returns the given control by its getter and key. */
function getControl(getter, key) {
  return getter()[key];
}
