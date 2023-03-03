/**
 * Viewer: Application Model
 *
 * Whenever available, use `application-functions` to operate on the model.
 */

import { NUL_STRING } from "./constants.mjs";
import { qsAll } from "./functions.mjs";
import { application as root } from "./roots.mjs";
import {
  ElementModel,
  FormButton,
  FormEntry,
  MenuButton,
  Output,
} from "./models.mjs";

/** Application model. */
export const application = Object.freeze({
  /** Root element. */
  root: new ElementModel(root),
  /** Collapsible fieldsets. */
  accordions: Object.freeze(
    (() => {
      const out = [];
      qsAll(root, "details").forEach((element) =>
        out.push(new ElementModel(element))
      );
      return out;
    })()
  ),
  /** Form buttons. */
  buttons: Object.freeze({
    close: new MenuButton({ id: "close" }),
    load: new MenuButton({ id: "load" }),
    properties: new MenuButton({ id: "properties" }),
    pwa: new MenuButton({ id: "pwa" }),
    resetControls: new FormButton({ id: "reset-controls" }),
  }),
  /** Form entries. */
  entries: Object.freeze({
    /** Core. */
    core: Object.freeze({
      fontFamily: new FormEntry({
        id: "core-font-family",
        preset: "monospace",
      }),
      fontScale: new FormEntry({
        id: "core-font-scale",
        preset: 1,
      }),
      lineHeight: new FormEntry({
        id: "core-line-height",
        preset: 1.2,
      }),
      speed: new FormEntry({
        id: "core-speed",
        preset: 1,
      }),
      withPitch: new FormEntry({
        id: "core-with-pitch",
        preset: true,
      }),
      wordWrap: new FormEntry({
        id: "core-word-wrap",
        preset: false,
      }),
    }),
    /** Display. */
    display: Object.freeze({
      align: new FormEntry({
        id: "display-align",
        preset: "center",
      }),
      blur: new FormEntry({
        id: "display-blur",
        preset: 0,
      }),
      brightness: new FormEntry({
        id: "display-brightness",
        preset: 100,
      }),
      contrast: new FormEntry({
        id: "display-contrast",
        preset: 100,
      }),
      hue: new FormEntry({
        id: "display-hue",
        preset: 0,
      }),
      invert: new FormEntry({
        id: "display-invert",
        preset: 0,
      }),
      justify: new FormEntry({
        id: "display-justify",
        preset: "center",
      }),
      saturation: new FormEntry({
        id: "display-saturation",
        preset: 100,
      }),
      sepia: new FormEntry({
        id: "display-sepia",
        preset: 0,
      }),
    }),
    /** Menu. */
    menu: Object.freeze({
      controls: new FormEntry({
        id: "menu-controls",
        preset: false,
      }),
      forceDark: new FormEntry({
        id: "menu-force-dark",
        preset: false,
      }),
      reverse: new FormEntry({
        id: "menu-reverse",
        preset: false,
      }),
    }),
  }),
  /** Outputs. */
  outputs: Object.freeze({
    audio: new Output({ id: "audio" }),
    frame: new Output({ id: "frame" }),
    image: new Output({ id: "image" }),
    nul: new Output({ id: "nul" }),
    root: new Output(),
    text: new Output({ id: "text" }),
    video: new Output({ id: "video" }),
  }),
  /** File download anchor. */
  anchor: document.createElement("a"),
  /** File reader. */
  reader: new FileReader(),
  /** Source file input. */
  source: new FormEntry({
    id: "file",
    preset: NUL_STRING,
  }),
  /** Current instance. */
  instance: Object.seal({
    file: null,
    view: NUL_STRING,
  }),
});

if (new URLSearchParams(location.search).has("debug")) {
  console.log(application);
}
