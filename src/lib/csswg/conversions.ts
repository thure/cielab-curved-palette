import multiplyMatrices from './multiply-matrices'
import { Vec3 } from '../interfaces'

// Sample code for color conversions
// Conversion can also be done using ICC profiles and a Color Management System
// For clarity, a library is used for matrix multiplication (multiply-matrices.js)

// [v-wishow]: Adjusted to export a TypeScript module. Retrieved on 24 May 2021
// from https://drafts.csswg.org/css-color-4/conversions.js

// sRGB-related functions

export function lin_sRGB(RGB) {
  // convert an array of sRGB values
  // where in-gamut values are in the range [0 - 1]
  // to linear light (un-companded) form.
  // https://en.wikipedia.org/wiki/SRGB
  // Extended transfer function:
  // for negative values,  linear portion is extended on reflection of axis,
  // then reflected power function is used.
  return RGB.map(function (val) {
    let sign = val < 0 ? -1 : 1
    let abs = Math.abs(val)

    if (abs < 0.04045) {
      return val / 12.92
    }

    return sign * Math.pow((abs + 0.055) / 1.055, 2.4)
  })
}

export function gam_sRGB(RGB) {
  // convert an array of linear-light sRGB values in the range 0.0-1.0
  // to gamma corrected form
  // https://en.wikipedia.org/wiki/SRGB
  // Extended transfer function:
  // For negative values, linear portion extends on reflection
  // of axis, then uses reflected pow below that
  return RGB.map(function (val) {
    let sign = val < 0 ? -1 : 1
    let abs = Math.abs(val)

    if (abs > 0.0031308) {
      return sign * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055)
    }

    return 12.92 * val
  })
}

export function lin_sRGB_to_XYZ(rgb) {
  // convert an array of linear-light sRGB values to CIE XYZ
  // using sRGB's own white, D65 (no chromatic adaptation)

  var M = [
    [0.41239079926595934, 0.357584339383878, 0.1804807884018343],
    [0.21263900587151027, 0.715168678767756, 0.07219231536073371],
    [0.01933081871559182, 0.11919477979462598, 0.9505321522496607],
  ]
  return multiplyMatrices(M, rgb)
}

export function XYZ_to_lin_sRGB(XYZ) {
  // convert XYZ to linear-light sRGB

  var M = [
    [3.2409699419045226, -1.537383177570094, -0.4986107602930034],
    [-0.9692436362808796, 1.8759675015077202, 0.04155505740717559],
    [0.05563007969699366, -0.20397695888897652, 1.0569715142428786],
  ]

  return multiplyMatrices(M, XYZ)
}

//  display-p3-related functions

export function lin_P3(RGB) {
  // convert an array of display-p3 RGB values in the range 0.0 - 1.0
  // to linear light (un-companded) form.

  return lin_sRGB(RGB) // same as sRGB
}

export function gam_P3(RGB) {
  // convert an array of linear-light display-p3 RGB  in the range 0.0-1.0
  // to gamma corrected form

  return gam_sRGB(RGB) // same as sRGB
}

export function lin_P3_to_XYZ(rgb) {
  // convert an array of linear-light display-p3 values to CIE XYZ
  // using  D65 (no chromatic adaptation)
  // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
  var M = [
    [0.4865709486482162, 0.26566769316909306, 0.1982172852343625],
    [0.2289745640697488, 0.6917385218365064, 0.079286914093745],
    [0.0, 0.04511338185890264, 1.043944368900976],
  ]
  // 0 was computed as -3.972075516933488e-17

  return multiplyMatrices(M, rgb)
}

export function XYZ_to_lin_P3(XYZ) {
  // convert XYZ to linear-light P3
  var M = [
    [2.493496911941425, -0.9313836179191239, -0.40271078445071684],
    [-0.8294889695615747, 1.7626640603183463, 0.023624685841943577],
    [0.03584583024378447, -0.07617238926804182, 0.9568845240076872],
  ]

  return multiplyMatrices(M, XYZ)
}

// prophoto-rgb functions

export function lin_ProPhoto(RGB) {
  // convert an array of prophoto-rgb values
  // where in-gamut colors are in the range [0.0 - 1.0]
  // to linear light (un-companded) form.
  // Transfer curve is gamma 1.8 with a small linear portion
  // Extended transfer function
  const Et2 = 16 / 512
  return RGB.map(function (val) {
    let sign = val < 0 ? -1 : 1
    let abs = Math.abs(val)

    if (abs <= Et2) {
      return val / 16
    }

    return sign * Math.pow(val, 1.8)
  })
}

export function gam_ProPhoto(RGB) {
  // convert an array of linear-light prophoto-rgb  in the range 0.0-1.0
  // to gamma corrected form
  // Transfer curve is gamma 1.8 with a small linear portion
  // TODO for negative values, extend linear portion on reflection of axis, then add pow below that
  const Et = 1 / 512
  return RGB.map(function (val) {
    let sign = val < 0 ? -1 : 1
    let abs = Math.abs(val)

    if (abs >= Et) {
      return sign * Math.pow(abs, 1 / 1.8)
    }

    return 16 * val
  })
}

export function lin_ProPhoto_to_XYZ(rgb) {
  // convert an array of linear-light prophoto-rgb values to CIE XYZ
  // using  D50 (so no chromatic adaptation needed afterwards)
  // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
  var M = [
    [0.7977604896723027, 0.13518583717574031, 0.0313493495815248],
    [0.2880711282292934, 0.7118432178101014, 0.00008565396060525902],
    [0.0, 0.0, 0.8251046025104601],
  ]

  return multiplyMatrices(M, rgb)
}

export function XYZ_to_lin_ProPhoto(XYZ) {
  // convert XYZ to linear-light prophoto-rgb
  var M = [
    [1.3457989731028281, -0.25558010007997534, -0.05110628506753401],
    [-0.5446224939028347, 1.5082327413132781, 0.02053603239147973],
    [0.0, 0.0, 1.2119675456389454],
  ]

  return multiplyMatrices(M, XYZ)
}

// a98-rgb functions

export function lin_a98rgb(RGB) {
  // convert an array of a98-rgb values in the range 0.0 - 1.0
  // to linear light (un-companded) form.
  // negative values are also now accepted
  return RGB.map(function (val) {
    let sign = val < 0 ? -1 : 1
    let abs = Math.abs(val)

    return sign * Math.pow(abs, 563 / 256)
  })
}

export function gam_a98rgb(RGB) {
  // convert an array of linear-light a98-rgb  in the range 0.0-1.0
  // to gamma corrected form
  // negative values are also now accepted
  return RGB.map(function (val) {
    let sign = val < 0 ? -1 : 1
    let abs = Math.abs(val)

    return sign * Math.pow(abs, 256 / 563)
  })
}

export function lin_a98rgb_to_XYZ(rgb) {
  // convert an array of linear-light a98-rgb values to CIE XYZ
  // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
  // has greater numerical precision than section 4.3.5.3 of
  // https://www.adobe.com/digitalimag/pdfs/AdobeRGB1998.pdf
  // but the values below were calculated from first principles
  // from the chromaticity coordinates of R G B W
  // see matrixmaker.html
  var M = [
    [0.5766690429101305, 0.1855582379065463, 0.1882286462349947],
    [0.29734497525053605, 0.6273635662554661, 0.07529145849399788],
    [0.02703136138641234, 0.07068885253582723, 0.9913375368376388],
  ]

  return multiplyMatrices(M, rgb)
}

export function XYZ_to_lin_a98rgb(XYZ) {
  // convert XYZ to linear-light a98-rgb
  var M = [
    [2.0415879038107465, -0.5650069742788596, -0.34473135077832956],
    [-0.9692436362808795, 1.8759675015077202, 0.04155505740717557],
    [0.013444280632031142, -0.11836239223101838, 1.0151749943912054],
  ]

  return multiplyMatrices(M, XYZ)
}

//Rec. 2020-related functions

export function lin_2020(RGB) {
  // convert an array of rec2020 RGB values in the range 0.0 - 1.0
  // to linear light (un-companded) form.
  // ITU-R BT.2020-2 p.4

  const ?? = 1.09929682680944
  const ?? = 0.018053968510807

  return RGB.map(function (val) {
    let sign = val < 0 ? -1 : 1
    let abs = Math.abs(val)

    if (abs < ?? * 4.5) {
      return val / 4.5
    }

    return sign * Math.pow((abs + ?? - 1) / ??, 1 / 0.45)
  })
}

export function gam_2020(RGB) {
  // convert an array of linear-light rec2020 RGB  in the range 0.0-1.0
  // to gamma corrected form
  // ITU-R BT.2020-2 p.4

  const ?? = 1.09929682680944
  const ?? = 0.018053968510807

  return RGB.map(function (val) {
    let sign = val < 0 ? -1 : 1
    let abs = Math.abs(val)

    if (abs > ??) {
      return sign * (?? * Math.pow(abs, 0.45) - (?? - 1))
    }

    return 4.5 * val
  })
}

export function lin_2020_to_XYZ(rgb) {
  // convert an array of linear-light rec2020 values to CIE XYZ
  // using  D65 (no chromatic adaptation)
  // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
  var M = [
    [0.6369580483012914, 0.14461690358620832, 0.1688809751641721],
    [0.2627002120112671, 0.6779980715188708, 0.05930171646986196],
    [0.0, 0.028072693049087428, 1.060985057710791],
  ]
  // 0 is actually calculated as  4.994106574466076e-17

  return multiplyMatrices(M, rgb)
}

export function XYZ_to_lin_2020(XYZ) {
  // convert XYZ to linear-light rec2020
  var M = [
    [1.7166511879712674, -0.35567078377639233, -0.25336628137365974],
    [-0.6666843518324892, 1.6164812366349395, 0.01576854581391113],
    [0.017639857445310783, -0.042770613257808524, 0.9421031212354738],
  ]

  return multiplyMatrices(M, XYZ)
}

// Chromatic adaptation

export function D65_to_D50(XYZ) {
  // Bradford chromatic adaptation from D65 to D50
  // The matrix below is the result of three operations:
  // - convert from XYZ to retinal cone domain
  // - scale components from one reference white to another
  // - convert back to XYZ
  // http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html
  var M = [
    [1.0479298208405488, 0.022946793341019088, -0.05019222954313557],
    [0.029627815688159344, 0.990434484573249, -0.01707382502938514],
    [-0.009243058152591178, 0.015055144896577895, 0.7518742899580008],
  ]

  return multiplyMatrices(M, XYZ)
}

export function D50_to_D65(XYZ) {
  // Bradford chromatic adaptation from D50 to D65
  var M = [
    [0.9554734527042182, -0.023098536874261423, 0.0632593086610217],
    [-0.028369706963208136, 1.0099954580058226, 0.021041398966943008],
    [0.012314001688319899, -0.020507696433477912, 1.3303659366080753],
  ]

  return multiplyMatrices(M, XYZ)
}

// Lab and LCH

export function XYZ_to_Lab(XYZ: Vec3): Vec3 {
  // Assuming XYZ is relative to D50, convert to CIE Lab
  // from CIE standard, which now defines these as a rational fraction
  var ?? = 216 / 24389 // 6^3/29^3
  var ?? = 24389 / 27 // 29^3/3^3
  var white = [0.96422, 1.0, 0.82521] // D50 reference white

  // compute xyz, which is XYZ scaled relative to reference white
  var xyz = XYZ.map((value, i) => value / white[i])

  // now compute f
  var f = xyz.map((value) =>
    value > ?? ? Math.cbrt(value) : (?? * value + 16) / 116
  )

  return [
    116 * f[1] - 16, // L
    500 * (f[0] - f[1]), // a
    200 * (f[1] - f[2]), // b
  ]
}

export function Lab_to_XYZ(Lab: Vec3): Vec3 {
  // Convert Lab to D50-adapted XYZ
  // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
  var ?? = 24389 / 27 // 29^3/3^3
  var ?? = 216 / 24389 // 6^3/29^3
  var white = [0.96422, 1.0, 0.82521] // D50 reference white
  var f = []

  // compute f, starting with the luminance-related term
  f[1] = (Lab[0] + 16) / 116
  f[0] = Lab[1] / 500 + f[1]
  f[2] = f[1] - Lab[2] / 200

  // compute xyz
  var xyz = [
    Math.pow(f[0], 3) > ?? ? Math.pow(f[0], 3) : (116 * f[0] - 16) / ??,
    Lab[0] > ?? * ?? ? Math.pow((Lab[0] + 16) / 116, 3) : Lab[0] / ??,
    Math.pow(f[2], 3) > ?? ? Math.pow(f[2], 3) : (116 * f[2] - 16) / ??,
  ]

  // Compute XYZ by scaling xyz by reference white
  return xyz.map((value, i) => value * white[i]) as Vec3
}

export function Lab_to_LCH(Lab: Vec3): Vec3 {
  // Convert to polar form
  var hue = (Math.atan2(Lab[2], Lab[1]) * 180) / Math.PI
  return [
    Lab[0], // L is still L
    Math.sqrt(Math.pow(Lab[1], 2) + Math.pow(Lab[2], 2)), // Chroma
    hue >= 0 ? hue : hue + 360, // Hue, in degrees [0 to 360)
  ]
}

export function LCH_to_Lab(LCH: Vec3): Vec3 {
  // Convert from polar form
  return [
    LCH[0], // L is still L
    LCH[1] * Math.cos((LCH[2] * Math.PI) / 180), // a
    LCH[1] * Math.sin((LCH[2] * Math.PI) / 180), // b
  ]
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 1] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   rgb      The red, green, and blue color values
 * @return  Array    The HSV representation
 */
export function rgbToHsv(rgb: Vec3) {
  var [r, g, b] = rgb
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  var h,
    s,
    v = max

  var d = max - min
  s = max == 0 ? 0 : d / max

  if (max == min) {
    h = 0 // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return [h, s, v]
}
