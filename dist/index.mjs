import { definePreset } from '@unocss/core';
import { h } from '@unocss/preset-mini/utils';

const CSS_VARIABLE_PREFIX = "--una";
const ENTER_ANIMATION_NAME = "una-in";
const EXIT_ANIMATION_NAME = "una-out";

function normalizeDirection(dir) {
  const dirMap = {
    t: "top",
    b: "bottom",
    l: "left",
    r: "right"
  };
  return dirMap[dir ?? ""] ?? dir;
}
function handleSlide(val, dir) {
  let value = h.cssvar.fraction.rem(val || DEFAULT_SLIDE_TRANSLATE);
  if (!value)
    return [];
  dir = normalizeDirection(dir);
  if (!value.startsWith("var(--") && ["top", "left"].includes(dir ?? "")) {
    if (value.startsWith("-"))
      value = value.slice(1);
    else if (value !== "0")
      value = `-${value}`;
  }
  return [value, dir];
}

const DEFAULT_FADE_OPACITY = "0";
const DEFAULT_ZOOM_SCALE = "0";
const DEFAULT_SPIN_DEGREE = "30deg";
const DEFAULT_SLIDE_TRANSLATE = "100%";
const DIRECTIONS_AUTOCOMPLETE = "(t|b|l|r|top|bottom|left|right)";
const fadeRules = [
  [
    /^fade-in(?:-(.+))?$/,
    ([, op]) => ({
      [`${CSS_VARIABLE_PREFIX}-enter-opacity`]: h.cssvar.percent(op || DEFAULT_FADE_OPACITY)
    }),
    { autocomplete: "fade-(in|out)-<percent>" }
  ],
  [
    /^fade-out(?:-(.+))?$/,
    ([, op]) => ({
      [`${CSS_VARIABLE_PREFIX}-exit-opacity`]: h.cssvar.percent(op || DEFAULT_FADE_OPACITY)
    })
  ]
];
const zoomRules = [
  [
    /^zoom-in(?:-(.+))?$/,
    ([, scale]) => ({
      [`${CSS_VARIABLE_PREFIX}-enter-scale`]: h.cssvar.fraction.percent(scale || DEFAULT_ZOOM_SCALE)
    }),
    { autocomplete: "zoom-(in|out)-<percent>" }
  ],
  [
    /^zoom-out(?:-(.+))?$/,
    ([, scale]) => ({
      [`${CSS_VARIABLE_PREFIX}-exit-scale`]: h.cssvar.fraction.percent(scale || DEFAULT_ZOOM_SCALE)
    })
  ]
];
const spinRules = [
  [
    /^spin-in(?:-(.+))?$/,
    ([, deg]) => ({
      [`${CSS_VARIABLE_PREFIX}-enter-rotate`]: h.cssvar.degree(deg || DEFAULT_SPIN_DEGREE)
    }),
    { autocomplete: "spin-(in|out)-<percent>" }
  ],
  [
    /^spin-out(?:-(.+))?$/,
    ([, deg]) => ({
      [`${CSS_VARIABLE_PREFIX}-exit-rotate`]: h.cssvar.degree(deg || DEFAULT_SPIN_DEGREE)
    })
  ]
];
const slideRules = [
  [
    /^slide-in(?:-from)?-(t|b|l|r|top|bottom|left|right)(?:-(.+))?$/,
    ([, dir, val]) => {
      const [value, direction] = handleSlide(val, dir);
      if (!value)
        return;
      switch (direction) {
        case "top":
        case "bottom": {
          return { [`${CSS_VARIABLE_PREFIX}-enter-translate-y`]: value };
        }
        case "left":
        case "right": {
          return { [`${CSS_VARIABLE_PREFIX}-enter-translate-x`]: value };
        }
        default: {
          return;
        }
      }
    },
    {
      autocomplete: [
        `slide-(in|out)-${DIRECTIONS_AUTOCOMPLETE}-<percent>`,
        `slide-(in|out)-${DIRECTIONS_AUTOCOMPLETE}-full`,
        `slide-in-from-${DIRECTIONS_AUTOCOMPLETE}-<percent>`,
        `slide-in-from-${DIRECTIONS_AUTOCOMPLETE}-full`
      ]
    }
  ],
  [
    /^slide-out(?:-to)?-(t|b|l|r|top|bottom|left|right)(?:-(.+))?$/,
    ([, dir, val]) => {
      const [value, direction] = handleSlide(val, dir);
      if (!value)
        return;
      switch (direction) {
        case "top":
        case "bottom": {
          return { [`${CSS_VARIABLE_PREFIX}-exit-translate-y`]: value };
        }
        case "left":
        case "right": {
          return { [`${CSS_VARIABLE_PREFIX}-exit-translate-x`]: value };
        }
        default: {
          return;
        }
      }
    },
    {
      autocomplete: [
        `slide-out-to-${DIRECTIONS_AUTOCOMPLETE}-<percent>`,
        `slide-out-to-${DIRECTIONS_AUTOCOMPLETE}-full`
      ]
    }
  ]
];
const rules = [
  ...fadeRules,
  ...zoomRules,
  ...spinRules,
  ...slideRules
];

function shortcuts(options) {
  const { unit = "ms" } = options;
  const sharedAnimationProperties = {
    ...options.delay && { "animation-delay": `${options.delay}${unit}` },
    ...options.direction && { "animation-direction": options.direction },
    ...options.fillMode && { "animation-fill-mode": options.fillMode },
    ...options.iterationCount && { "animation-iteration-count": options.iterationCount },
    ...options.playState && { "animation-play-state": options.playState }
  };
  return [
    [
      "animate-in",
      [
        `animate-${ENTER_ANIMATION_NAME}`,
        {
          ...sharedAnimationProperties,
          [`${CSS_VARIABLE_PREFIX}-enter-opacity`]: "initial",
          [`${CSS_VARIABLE_PREFIX}-enter-scale`]: "initial",
          [`${CSS_VARIABLE_PREFIX}-enter-rotate`]: "initial",
          [`${CSS_VARIABLE_PREFIX}-enter-translate-x`]: "initial",
          [`${CSS_VARIABLE_PREFIX}-enter-translate-y`]: "initial"
        }
      ]
    ],
    [
      "animate-out",
      [
        `animate-${EXIT_ANIMATION_NAME}`,
        {
          ...sharedAnimationProperties,
          [`${CSS_VARIABLE_PREFIX}-exit-opacity`]: "initial",
          [`${CSS_VARIABLE_PREFIX}-exit-scale`]: "initial",
          [`${CSS_VARIABLE_PREFIX}-exit-rotate`]: "initial",
          [`${CSS_VARIABLE_PREFIX}-exit-translate-x`]: "initial",
          [`${CSS_VARIABLE_PREFIX}-exit-translate-y`]: "initial"
        }
      ]
    ]
  ];
}

function extendTheme(options) {
  return (theme) => {
    theme.animation ??= {};
    theme.animation.keyframes ??= {};
    theme.animation.durations ??= {};
    theme.animation.timingFns ??= {};
    theme.animation.keyframes[ENTER_ANIMATION_NAME] = `{from{opacity:var(${CSS_VARIABLE_PREFIX}-enter-opacity,1);transform:translate3d(var(${CSS_VARIABLE_PREFIX}-enter-translate-x,0),var(${CSS_VARIABLE_PREFIX}-enter-translate-y,0),0) scale3d(var(${CSS_VARIABLE_PREFIX}-enter-scale,1),var(${CSS_VARIABLE_PREFIX}-enter-scale,1),var(${CSS_VARIABLE_PREFIX}-enter-scale,1)) rotate(var(${CSS_VARIABLE_PREFIX}-enter-rotate,0))}}`;
    theme.animation.keyframes[EXIT_ANIMATION_NAME] = `{to{opacity:var(${CSS_VARIABLE_PREFIX}-exit-opacity,1);transform:translate3d(var(${CSS_VARIABLE_PREFIX}-exit-translate-x,0),var(${CSS_VARIABLE_PREFIX}-exit-translate-y,0),0) scale3d(var(${CSS_VARIABLE_PREFIX}-exit-scale,1),var(${CSS_VARIABLE_PREFIX}-exit-scale,1),var(${CSS_VARIABLE_PREFIX}-exit-scale,1)) rotate(var(${CSS_VARIABLE_PREFIX}-exit-rotate,0))}}`;
    const duration = options.duration ? `${options.duration}${options.unit ?? "ms"}` : theme.duration?.DEFAULT;
    const timingFn = options.timingFunction ?? theme.easing?.DEFAULT;
    for (const name of [ENTER_ANIMATION_NAME, EXIT_ANIMATION_NAME]) {
      if (duration)
        theme.animation.durations[name] = duration;
      if (timingFn)
        theme.animation.timingFns[name] = timingFn;
    }
  };
}

const presetAnimations = definePreset((options = {}) => {
  options.unit = options.unit ?? "ms";
  return {
    name: "unocss-preset-animations",
    shortcuts: shortcuts(options),
    rules,
    extendTheme: extendTheme(options)
  };
});

export { presetAnimations as default, presetAnimations };
