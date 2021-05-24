// [v-wishow]: Truncated to export only relevant functions and adjusted to export a TypeScript
// module, some additional adjustments to remove alpha support. Retrieved on 24 May 2021
// from https://raw.githubusercontent.com/LeaVerou/css.land/master/lch/lch.js

import { LCH_to_sRGB } from '../csswg/utilities'

export function alpha_to_string(a = 100) {
  return a < 100 ? ` / ${a}%` : ''
}

export function LCH_to_sRGB_string(l, c, h, forceInGamut = false) {
  if (forceInGamut) {
    ;[l, c, h] = force_into_gamut(l, c, h)
  }

  return (
    'rgb(' +
    LCH_to_sRGB([+l, +c, +h])
      .map((x) => {
        return Math.round(x * 10000) / 100 + '%'
      })
      .join(' ') +
    ')'
  )
}

export function force_into_gamut(l, c, h) {
  // Moves an lch color into the sRGB gamut
  // by holding the l and h steady,
  // and adjusting the c via binary-search
  // until the color is on the sRGB boundary.
  if (isLCH_within_sRGB(l, c, h)) {
    return [l, c, h]
  }

  let hiC = c
  let loC = 0
  const ε = 0.0001
  c /= 2

  // .0001 chosen fairly arbitrarily as "close enough"
  while (hiC - loC > ε) {
    if (isLCH_within_sRGB(l, c, h)) {
      loC = c
    } else {
      hiC = c
    }
    c = (hiC + loC) / 2
  }

  return [l, c, h]
}

export function isLCH_within_sRGB(l, c, h) {
  var rgb = LCH_to_sRGB([+l, +c, +h])
  const ε = 0.000005
  return rgb.reduce((a, b) => a && b >= 0 - ε && b <= 1 + ε, true)
}
