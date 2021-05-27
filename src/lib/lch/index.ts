// [v-wishow]: Truncated to export only relevant functions and adjusted to export a TypeScript
// module, some additional adjustments to remove alpha support. Retrieved on 24 May 2021
// from https://raw.githubusercontent.com/LeaVerou/css.land/master/lch/lch.js

import { LCH_to_sRGB } from '../csswg/utilities'
import { Lab_to_LCH, LCH_to_Lab } from '../csswg/conversions'

export function force_into_gamut(_l, a, b) {
  // Moves an lch color into the sRGB gamut
  // by holding the l and h steady,
  // and adjusting the c via binary-search
  // until the color is on the sRGB boundary.

  let [l, c, h] = Lab_to_LCH([_l, a, b])

  if (isLCH_within_sRGB(l, c, h)) {
    return [_l, a, b]
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

  return LCH_to_Lab([l, c, h])
}

export function isLCH_within_sRGB(l, c, h) {
  var rgb = LCH_to_sRGB([+l, +c, +h])
  const ε = 0.000005
  return rgb.reduce((a, b) => a && b >= 0 - ε && b <= 1 + ε, true)
}
