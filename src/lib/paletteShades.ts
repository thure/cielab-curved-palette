import { CurvePath, QuadraticBezierCurve3, Vector3 } from 'three'

import { force_into_gamut } from './lch'
import { LAB_to_sRGB } from './csswg/utilities'
import { Palette, Vec3 } from './interfaces'
import { LCH_to_Lab } from './csswg/conversions'
import { rotatePoint } from './3d'

function getTargetLightness(/*linearity, */ t: number): number {
  // const cbrt = 6.3 * Math.cbrt(t * 1000 - 500) + 50
  const line = t * 100
  return Math.max(0, Math.min(100, /*cbrt + (*/ line /* - cbrt) * linearity*/))
}

function getPaletteShades(
  curvePoints: Vector3[],
  /*linearity, */ nShades: number
): Vec3[] {
  if (curvePoints.length <= 2) return []

  const paletteShades = []

  let c = 0

  for (let i = 0; i < nShades - 1; i++) {
    const l = getTargetLightness(/*linearity, */ i / (nShades - 1))

    while (l > curvePoints[c + 1].z) {
      c++
    }

    const a1 = curvePoints[c].x
    const b1 = curvePoints[c].y
    const l1 = curvePoints[c].z

    const a2 = curvePoints[c + 1].x
    const b2 = curvePoints[c + 1].y
    const l2 = curvePoints[c + 1].z

    const u = (l - l1) / (l2 - l1)

    paletteShades[i] = [
      l1 + (l2 - l1) * u,
      a1 + (a2 - a1) * u,
      b1 + (b2 - b1) * u,
    ]
  }

  paletteShades[nShades - 1] = [
    curvePoints[curvePoints.length - 1].z,
    curvePoints[curvePoints.length - 1].x,
    curvePoints[curvePoints.length - 1].y,
  ]

  return paletteShades.map(([l, a, b]) => force_into_gamut(l, a, b))
}

export function paletteShadesFromCurve(
  curve: CurvePath<Vector3>,
  nShades = 8,
  curveDepth = 12
): Vec3[] {
  const curvePoints = curve.getPoints(Math.ceil(curveDepth / 2)) // getPoints gets a depth of 2 * n + 1
  return getPaletteShades(curvePoints, nShades)
}

export function Lab_to_hex(lab: Vec3): string {
  return (
    '#' +
    LAB_to_sRGB(lab)
      .map((x) => {
        const channel = x < 0 ? 0 : Math.floor(x >= 1.0 ? 255 : x * 256)
        return channel.toString(16).padStart(2, '0')
      })
      .join('')
  )
}

export function hex_to_sRGB(hex: string): Vec3 {
  var aRgbHex = hex.match(/#?(..)(..)(..)/)
  return [
    parseInt(aRgbHex[1], 16) / 255,
    parseInt(aRgbHex[2], 16) / 255,
    parseInt(aRgbHex[3], 16) / 255,
  ]
}

function paletteShadesToHex(paletteShades: Vec3[]): string[] {
  return paletteShades.map(Lab_to_hex)
}

function get_point_within_gamut(this: CurvePath<Vector3>, t: number): Vector3 {
  const point = CurvePath.prototype.getPoint.call(this, t)
  const [l, a, b] = force_into_gamut(point.z, point.x, point.y)
  point.set(a, b, l)
  return point
}

export function curvePathFromPalette({
  keyColor,
  darkCp,
  lightCp,
  hueTorsion,
}: Palette): CurvePath<Vector3> {
  const blackPos = new Vector3(0, 0, 0)
  const whitePos = new Vector3(0, 0, 100)
  const [l, a, b] = LCH_to_Lab(keyColor)
  const keyColorPos = new Vector3(a, b, l)

  const curve = new CurvePath<Vector3>()

  const darkControlPos = new Vector3(
    keyColorPos.x,
    keyColorPos.y,
    keyColorPos.z * (1 - darkCp)
  )

  rotatePoint(
    darkControlPos,
    keyColorPos,
    new Vector3(a, b, 0).normalize(),
    hueTorsion
  )

  curve.add(new QuadraticBezierCurve3(blackPos, darkControlPos, keyColorPos))

  const lightControlPos = new Vector3(
    keyColorPos.x,
    keyColorPos.y,
    keyColorPos.z + (100 - keyColorPos.z) * lightCp
  )

  rotatePoint(
    lightControlPos,
    keyColorPos,
    new Vector3(a, b, 0).normalize(),
    hueTorsion
  )

  curve.add(new QuadraticBezierCurve3(keyColorPos, lightControlPos, whitePos))

  curve.getPoint = get_point_within_gamut

  return curve
}

export function cssGradientFromCurve(
  curve: CurvePath<Vector3>,
  nShades = 8,
  curveDepth = 12
) {
  const hexes = paletteShadesToHex(
    paletteShadesFromCurve(curve, curveDepth, nShades)
  )
  return `linear-gradient(to right, ${hexes.join(', ')})`
}
