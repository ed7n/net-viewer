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
  loadDiscard: "This discards any unsaved changes made to the current file.",
  loadEmpty: "Nothing to load.",
  loadLarge: "Its size is greater than 1 MiB, proceed with loading?",
});
/** CSS custom property prefix. */
export const CSS_PREFIX = "viewer";
/** Data MIME type. */
export const DATA_TYPE = "application/json";
/** Data version. */
export const DATA_VERSION = NUL_STRING;
/** Event: "change". */
export const EVENT_CHANGE = Object.freeze(new Event("change"));
/** Event: "input". */
export const EVENT_INPUT = Object.freeze(new Event("input"));
/** Data file name extension. */
export const FILE_EXTENSION = ".json";
/** Maximum file name length in characters. */
export const FILE_NAME_LENGTH_MAX = 255 - FILE_EXTENSION.length;
/** Default file name. */
export const FILE_NAME = "Unnamed";
/** Maximum safe file size in bytes. */
export const FILE_SIZE_MAX_SAFE = 1048576;
/** Initial document title. */
export const TITLE = document.title;

/** Regular Expressions. */
export const regexps = Object.freeze({
  /** Source file name extension. */
  fileExtension: new RegExp(/\.json$/),
  /** Source file MIME type. */
  fileType: new RegExp(/^(application\/|audio\/|image\/|text\/|video\/)?/),
  /** Line end with trailing and leading blanks. */
  lineEnd: new RegExp(/\s*(\n|\r\n|\r)\s*/g),
});
