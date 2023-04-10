/**
 * Viewer: Application Model
 *
 * Whenever available, use `application-functions` to operate on the model.
 */

import { application as root } from "./roots.mjs";
import { NUL_STRING } from "./common/constants.mjs";
import { qsAll } from "./common/functions.mjs";
import {
  ElementModel,
  FormButton,
  FormEntry,
  MenuButton,
  Output,
} from "./common/models.mjs";

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
    applicationPwa: new MenuButton({ id: "application-pwa" }),
    fileEject: new MenuButton({ id: "file-eject" }),
    fileLoad: new MenuButton({ id: "file-load" }),
    fileLoadUrl: new MenuButton({ id: "file-load-url" }),
    fileProperties: new MenuButton({ id: "file-properties" }),
    filterReset: new FormButton({ id: "filter-reset" }),
    frameReset: new FormButton({ id: "frame-reset" }),
    mediaJumpN05: new FormButton({ id: "media-jump-n05" }),
    mediaJumpN20: new FormButton({ id: "media-jump-n20" }),
    mediaJumpP05: new FormButton({ id: "media-jump-p05" }),
    mediaJumpP20: new FormButton({ id: "media-jump-p20" }),
    mediaReset: new FormButton({ id: "media-reset" }),
    mediaScanFaster: new FormButton({ id: "media-scan-faster" }),
    mediaScanSlower: new FormButton({ id: "media-scan-slower" }),
    mediaShowControls: new FormButton({ id: "media-show-controls" }),
    positionReset: new FormButton({ id: "position-reset" }),
    resetControls: new FormButton({ id: "reset-controls" }),
    textReset: new FormButton({ id: "text-reset" }),
    transformReset: new FormButton({ id: "transform-reset" }),
    viewCollapse: new MenuButton({ id: "view-collapse" }),
    viewExpand: new MenuButton({ id: "view-expand" }),
  }),
  /** Form entries. */
  entries: Object.freeze({
    /** Filter. */
    filter: Object.freeze({
      blur: new FormEntry({
        id: "filter-blur",
        preset: 0,
      }),
      brightness: new FormEntry({
        id: "filter-brightness",
        preset: 1,
      }),
      contrast: new FormEntry({
        id: "filter-contrast",
        preset: 1,
      }),
      grayscale: new FormEntry({
        id: "filter-grayscale",
        preset: 0,
      }),
      hueRotate: new FormEntry({
        id: "filter-hue-rotate",
        preset: 0,
      }),
      invert: new FormEntry({
        id: "filter-invert",
        preset: 0,
      }),
      saturate: new FormEntry({
        id: "filter-saturate",
        preset: 1,
      }),
      sepia: new FormEntry({
        id: "filter-sepia",
        preset: 0,
      }),
    }),
    frame: Object.freeze({
      solid: new FormEntry({
        id: "frame-solid",
        preset: false,
      }),
    }),
    /** Media. */
    media: Object.freeze({
      autoplay: new FormEntry({
        id: "media-autoplay",
        preset: true,
      }),
      repeat: new FormEntry({
        id: "media-repeat",
        preset: false,
      }),
      speed: new FormEntry({
        id: "media-speed",
        preset: 1,
      }),
      withPitch: new FormEntry({
        id: "media-with-pitch",
        preset: true,
      }),
    }),
    /** Menu. */
    menu: Object.freeze({
      applicationEcc: new FormEntry({
        id: "menu-application-ecc",
        preset: false,
      }),
      viewControls: new FormEntry({
        id: "menu-view-controls",
        preset: false,
      }),
      viewForceDark: new FormEntry({
        id: "menu-view-force-dark",
        preset: false,
      }),
      viewReverse: new FormEntry({
        id: "menu-view-reverse",
        preset: false,
      }),
    }),
    /** Position. */
    position: Object.freeze({
      align: new FormEntry({
        id: "position-align",
        preset: "center",
      }),
      justify: new FormEntry({
        id: "position-justify",
        preset: "center",
      }),
    }),
    /** Text. */
    text: Object.freeze({
      fontFamily: new FormEntry({
        id: "text-font-family",
        preset: "monospace",
      }),
      fontSize: new FormEntry({
        id: "text-font-size",
        preset: 1,
      }),
      lineHeight: new FormEntry({
        id: "text-line-height",
        preset: 1.2,
      }),
      rightToLeft: new FormEntry({
        id: "text-right-to-left",
        preset: false,
      }),
      wordWrap: new FormEntry({
        id: "text-word-wrap",
        preset: false,
      }),
    }),
    /** Transform. */
    transform: Object.freeze({
      invert: new FormEntry({
        id: "transform-invert",
        preset: false,
      }),
      reverse: new FormEntry({
        id: "transform-reverse",
        preset: false,
      }),
      rotate: new FormEntry({
        id: "transform-rotate",
        preset: 0,
      }),
      scale: new FormEntry({
        id: "transform-scale",
        preset: 1,
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
    modified: false,
    scanBaseSpeed: 1,
    view: NUL_STRING,
  }),
});

if (new URLSearchParams(location.search).has("debug")) {
  console.log(application);
}
