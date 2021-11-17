import {
  CurvePath,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  TubeGeometry,
  Vector3,
} from 'three'
import { LAB_to_sRGB } from '../../../lib/csswg/utilities'
import { ck, lk } from './constants'
import { SceneRef } from './index'

const depth = 0.7
const rs = 5
const thickness = 0.8

export function setCurveMesh(sceneRef: SceneRef, curve: CurvePath<Vector3>) {
  const { scene, tubeMesh } = sceneRef
  if (tubeMesh) scene.remove(tubeMesh)

  const pointGetter = curve.getPoint

  curve.getPoint = function get_scaled_point(
    this: CurvePath<Vector3>,
    t: number
  ): Vector3 {
    const point = pointGetter.call(this, t)
    point.x *= ck
    point.y *= ck
    point.z *= lk
    return point
  }

  const tube = new TubeGeometry(
    curve,
    Math.ceil(curve.getLength() * depth),
    thickness,
    rs
  )

  curve.getPoint = pointGetter

  const colors = []

  for (let i = 0; i < tube.attributes.position.count; i++) {
    const color = LAB_to_sRGB([
      tube.attributes.position.getZ(i) / lk,
      tube.attributes.position.getX(i) / ck,
      tube.attributes.position.getY(i) / ck,
    ])
    Array.prototype.push.apply(colors, color)
  }

  tube.setAttribute('color', new Float32BufferAttribute(colors, 3))

  const nextTubeMesh = new Mesh(
    tube,
    new MeshBasicMaterial({ vertexColors: true })
  )

  scene.add(nextTubeMesh)

  return {
    ...sceneRef,
    tubeMesh: nextTubeMesh,
  }
}
