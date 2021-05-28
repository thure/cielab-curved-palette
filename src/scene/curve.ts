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
import { ck, lk, rotatePoint } from '../lib/3d'
import { LAB_to_sRGB } from '../lib/csswg/utilities'
import { force_into_gamut } from '../lib/lch'
import { LCH_to_Lab } from '../lib/csswg/conversions'
import throttle from 'lodash/throttle'

const depth = 1
const rs = 3
const thickness = 0.5

let tubeMesh = null

function get_point_within_gamut(t): Vector3 {
  const point = CurvePath.prototype.getPoint.call(this, t)
  const [l, a, b] = force_into_gamut(point.y / lk, point.x / ck, point.z / ck)
  point.set(a * ck, l * lk, b * ck)
  return point
}

function update({ scene, keyColorLCH, darkControl, lightControl, hueTorsion }) {
  if (tubeMesh) scene.remove(tubeMesh)

  const black = new Vector3(0, 0, 0)
  const white = new Vector3(0, 100, 0)
  const [l, a, b] = LCH_to_Lab(keyColorLCH)
  const keyColor = new Vector3(a * ck, l * lk, b * ck)

  const curve = new CurvePath()

  const darkControlPoint = new Vector3(
    keyColor.x,
    keyColor.y * (1 - darkControl),
    keyColor.z
  )

  rotatePoint(
    darkControlPoint,
    keyColor,
    new Vector3(a, 0, b).normalize(),
    hueTorsion
  )

  curve.add(new QuadraticBezierCurve3(black, darkControlPoint, keyColor))

  const lightControlPoint = new Vector3(
    keyColor.x,
    keyColor.y + (100 - keyColor.y) * lightControl,
    keyColor.z
  )

  rotatePoint(
    lightControlPoint,
    keyColor,
    new Vector3(a, 0, b).normalize(),
    hueTorsion
  )

  curve.add(new QuadraticBezierCurve3(keyColor, lightControlPoint, white))

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

  tubeMesh = new Mesh(tube, new MeshBasicMaterial({ vertexColors: true }))

  scene.add(tubeMesh)
}

export default function populate({
  scene,
  initialState: { keyColorLCH, darkControl, lightControl, hueTorsion },
}) {
  update({ scene, keyColorLCH, darkControl, lightControl, hueTorsion })

  return {
    updateCurve: throttle(function (
      l,
      c,
      h,
      darkControl,
      lightControl,
      hueTorsion
    ) {
      update({
        scene,
        keyColorLCH: [l, c, h],
        darkControl,
        lightControl,
        hueTorsion,
      })
    },
    0.2e3),
  }
}
