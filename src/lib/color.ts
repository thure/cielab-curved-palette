import { Color } from 'three'
import { LCH_to_sRGB } from './csswg/utilities'

export function LchColor(l, c, h) {
  const [r, g, b] = LCH_to_sRGB([l, c, h])

  return new Color(r, g, b)
}
