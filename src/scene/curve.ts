import {
  Curve,
  CurvePath,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  QuadraticBezierCurve3,
  TubeGeometry,
  Vector3,
} from 'three'
import { ck, lk } from '../lib/3d'
import { LAB_to_sRGB } from '../lib/csswg/utilities'
import { force_into_gamut } from '../lib/lch'
import { Lab_to_LCH } from '../lib/csswg/conversions'

const depth = 1
const rs = 3
const thickness = 0.5

function get_point_within_gamut(t): Vector3 {
  const point = CurvePath.prototype.getPoint.call(this, t)
  const [l, a, b] = force_into_gamut(point.y / lk, point.x / ck, point.z / ck)
  point.set(a * ck, l * lk, b * ck)
  return point
}

export default function populate({ scene }) {
  const black = new Vector3(0, 0, 0)
  const white = new Vector3(0, 100, 0)
  const keyColor = new Vector3(12.61 * ck, 44.51 * lk, -36.96 * ck)

  const curve = new CurvePath()

  curve.add(
    new QuadraticBezierCurve3(
      black,
      new Vector3(keyColor.x, keyColor.y / 6, keyColor.z),
      keyColor
    )
  )

  curve.add(
    new QuadraticBezierCurve3(
      keyColor,
      new Vector3(keyColor.x, keyColor.y + (100 - keyColor.y) / 4, keyColor.z),
      white
    )
  )

  curve.getPoint = get_point_within_gamut

  const tube = new TubeGeometry(
    curve as unknown as Curve<Vector3>,
    Math.ceil(curve.getLength() * depth),
    thickness,
    rs
  )

  const colors = []

  for (let i = 0; i < tube.attributes.position.count; i++) {
    const color = LAB_to_sRGB([
      tube.attributes.position.getY(i) / lk,
      tube.attributes.position.getX(i) / ck,
      tube.attributes.position.getZ(i) / ck,
    ])
    Array.prototype.push.apply(colors, color)
  }

  tube.setAttribute('color', new Float32BufferAttribute(colors, 3))

  scene.add(new Mesh(tube, new MeshBasicMaterial({ vertexColors: true })))
}
