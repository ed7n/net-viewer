/**
 * Viewer: Constants
 *
 * Shared independent constants.
 */

import { NUL_STRING } from "./common/constants.mjs";

/** Messages. */
export const MESSAGES = Object.freeze({
  loadLarge: "Its size is greater than 1 MiB, proceed with loading?",
  loadUrl: "Enter its complete form, including scheme and path.",
});
/** CSS custom property prefix. */
export const CSS_PREFIX = "viewer";
/** Data MIME type. */
export const DATA_TYPE = "application/json";
/** Data version. */
export const DATA_VERSION = NUL_STRING;
/** Data file name extension. */
export const FILE_EXTENSION = ".json";
/** Maximum file name length in characters. */
export const FILE_NAME_LENGTH_MAX = 255 - FILE_EXTENSION.length;
/** Default file name. */
export const FILE_NAME = "Unnamed";
/** Maximum safe file size in bytes. */
export const FILE_SIZE_MAX_SAFE = 1048576;

/** Regular Expressions. */
export const regexps = Object.freeze({
  /** Source file name extension. */
  fileExtension: new RegExp(/\.json$/),
  /** Source file MIME type. */
  fileType: new RegExp(/^(application\/|audio\/|image\/|text\/|video\/)?/),
});
