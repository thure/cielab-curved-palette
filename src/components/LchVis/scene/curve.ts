import {
  CurvePath,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  QuadraticBezierCurve3,
  TubeGeometry,
  Vector3,
} from 'three'
import { rotatePoint } from '../../../lib/3d'
import { LAB_to_sRGB } from '../../../lib/csswg/utilities'
import { force_into_gamut } from '../../../lib/lch'
import { LCH_to_Lab } from '../../../lib/csswg/conversions'
import throttle from 'lodash/throttle'
import { ck, lk } from './constants'

const depth = 0.8
const rs = 3
const thickness = 0.4
const resultDepth = 64

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

  const curve = new CurvePath<Vector3>()

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
    curve,
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

  const darkPointsSize = Math.floor((resultDepth * l) / 100)
  const darkPoints = curve.curves[0]
    .getPoints(darkPointsSize)
    .map((point) => [point.y / lk, point.x / ck, point.z / ck])
  const lightPoints = curve.curves[1]
    .getPoints(resultDepth - darkPointsSize)
    .map((point) => [point.y / lk, point.x / ck, point.z / ck])
  lightPoints.splice(0, 1)

  return [...darkPoints, ...lightPoints]
}

export default function populate({
  scene,
  initialState: { keyColorLCH, darkControl, lightControl, hueTorsion },
  onUpdate,
}) {
  let state = { keyColorLCH, darkControl, lightControl, hueTorsion }

  const updateResult = update({ scene, ...state })
  if (onUpdate) onUpdate(updateResult)

  return {
    updateCurve: throttle(function ({
      l = state.keyColorLCH[0],
      c = state.keyColorLCH[1],
      h = state.keyColorLCH[2],
      darkControl = state.darkControl,
      lightControl = state.lightControl,
      hueTorsion = state.hueTorsion,
    }) {
      state = { keyColorLCH: [l, c, h], darkControl, lightControl, hueTorsion }
      const updateResult = update({ scene, ...state })
      if (onUpdate) onUpdate(updateResult)
    },
    200),
  }
}
