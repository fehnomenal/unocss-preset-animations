import type { PresetAnimationsOptions } from '@/index'
import type { Theme } from '@unocss/preset-mini'
import type { CSSObject, UserShortcuts } from 'unocss'
import { CSS_VARIABLE_PREFIX, ENTER_ANIMATION_NAME, EXIT_ANIMATION_NAME } from '@/constants'


export function shortcuts(options: PresetAnimationsOptions): UserShortcuts<Theme> {
  const { unit = 'ms' } = options

  const sharedAnimationProperties: CSSObject = {
    ...options.delay && { 'animation-delay': `${options.delay}${unit}` },
    ...options.direction && { 'animation-direction': options.direction },
    ...options.fillMode && { 'animation-fill-mode': options.fillMode },
    ...options.iterationCount && { 'animation-iteration-count': options.iterationCount },
    ...options.playState && { 'animation-play-state': options.playState },
  }

  return [
    [
      'animate-in',
      [
        `animate-${ENTER_ANIMATION_NAME}`,
        {
          ...sharedAnimationProperties,
          [`${CSS_VARIABLE_PREFIX}-enter-opacity`]: 'initial',
          [`${CSS_VARIABLE_PREFIX}-enter-scale`]: 'initial',
          [`${CSS_VARIABLE_PREFIX}-enter-rotate`]: 'initial',
          [`${CSS_VARIABLE_PREFIX}-enter-translate-x`]: 'initial',
          [`${CSS_VARIABLE_PREFIX}-enter-translate-y`]: 'initial',
        },
      ],
    ],
    [
      'animate-out',
      [
        `animate-${EXIT_ANIMATION_NAME}`,
        {
          ...sharedAnimationProperties,
          [`${CSS_VARIABLE_PREFIX}-exit-opacity`]: 'initial',
          [`${CSS_VARIABLE_PREFIX}-exit-scale`]: 'initial',
          [`${CSS_VARIABLE_PREFIX}-exit-rotate`]: 'initial',
          [`${CSS_VARIABLE_PREFIX}-exit-translate-x`]: 'initial',
          [`${CSS_VARIABLE_PREFIX}-exit-translate-y`]: 'initial',
        },
      ],
    ],
  ]
}
