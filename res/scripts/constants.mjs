/**
 * Viewer: Constants
 *
 * Shared independent constants.
 */

export const NUL_ARRAY = Object.freeze([]);
export const NUL_ELEMENT = Object.freeze(document.createElement(null));
export const NUL_FUNCTION = Object.freeze(Function());
export const NUL_OBJECT = Object.freeze({});
export const NUL_STRING = "";
export const SPACE = " ";

/** Messages. */
export const MESSAGES = Object.freeze({
  fileBadType: "Bad file MIME type: ",
  fileEmpty: "File is empty.",
  fileNul: "No file.",
  loadEmpty: "Nothing to load.",
});
/** CSS custom property namespace. */
export const CSS_NAMESPACE = "viewer";
/** Event: "change". */
export const EVENT_CHANGE = Object.freeze(new Event("change"));
/** Event: "input". */
export const EVENT_INPUT = Object.freeze(new Event("input"));
/** Initial document title. */
export const TITLE = document.title;

/** Regular Expressions. */
export const regexps = Object.freeze({
  /** Source file MIME type. */
  fileType: new RegExp(/^(application\/|audio\/|image\/|text\/|video\/)?/),
  /** Line end with trailing and leading blanks. */
  lineEnd: new RegExp(/\s*(\n|\r\n|\r)\s*/g),
});
