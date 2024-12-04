import type { PresetAnimationsOptions } from './index.js'
import type { ThemeExtender } from '@unocss/core'
import type { Theme } from '@unocss/preset-mini'
import { CSS_VARIABLE_PREFIX, ENTER_ANIMATION_NAME, EXIT_ANIMATION_NAME } from '@/constants'


export function extendTheme(options: PresetAnimationsOptions): ThemeExtender<Theme> {
  return (theme) => {
    theme.animation ??= {}
    theme.animation.keyframes ??= {}
    theme.animation.durations ??= {}
    theme.animation.timingFns ??= {}

    theme.animation.keyframes[
      ENTER_ANIMATION_NAME
    ] = `{from{opacity:var(${CSS_VARIABLE_PREFIX}-enter-opacity,1);transform:translate3d(var(${CSS_VARIABLE_PREFIX}-enter-translate-x,0),var(${CSS_VARIABLE_PREFIX}-enter-translate-y,0),0) scale3d(var(${CSS_VARIABLE_PREFIX}-enter-scale,1),var(${CSS_VARIABLE_PREFIX}-enter-scale,1),var(${CSS_VARIABLE_PREFIX}-enter-scale,1)) rotate(var(${CSS_VARIABLE_PREFIX}-enter-rotate,0))}}`
    theme.animation.keyframes[
      EXIT_ANIMATION_NAME
    ] = `{to{opacity:var(${CSS_VARIABLE_PREFIX}-exit-opacity,1);transform:translate3d(var(${CSS_VARIABLE_PREFIX}-exit-translate-x,0),var(${CSS_VARIABLE_PREFIX}-exit-translate-y,0),0) scale3d(var(${CSS_VARIABLE_PREFIX}-exit-scale,1),var(${CSS_VARIABLE_PREFIX}-exit-scale,1),var(${CSS_VARIABLE_PREFIX}-exit-scale,1)) rotate(var(${CSS_VARIABLE_PREFIX}-exit-rotate,0))}}`

    const duration = options.duration
      ? `${options.duration}${options.unit ?? 'ms'}`
      : theme.duration?.DEFAULT
    const timingFn = options.timingFunction ?? theme.easing?.DEFAULT

    for (const name of [ENTER_ANIMATION_NAME, EXIT_ANIMATION_NAME]) {
      if (duration)
        theme.animation.durations[name] = duration


      if (timingFn)
        theme.animation.timingFns[name] = timingFn
    }
  }
}
