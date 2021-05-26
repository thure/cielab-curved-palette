import { sRGB_to_LAB } from '../lib/csswg/utilities'
import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Mesh,
  MeshPhongMaterial,
  Vector3,
} from 'three'

const center = new Vector3(0, 50, 0)
const depth = 256

const ABComponentScale = 3 / 8 // Why does this seem right? What's the real limit of the LAB space?

enum axisPhase {
  zero,
  inner,
  outer,
  max,
}

const phases = [
  [axisPhase.zero, axisPhase.inner, axisPhase.outer],
  [axisPhase.inner, axisPhase.zero, axisPhase.outer],
  [axisPhase.inner, axisPhase.outer, axisPhase.zero],
  [axisPhase.max, axisPhase.inner, axisPhase.outer],
  [axisPhase.inner, axisPhase.max, axisPhase.outer],
  [axisPhase.inner, axisPhase.outer, axisPhase.max],
]

function getChannel(phase: axisPhase, i, o) {
  switch (phase) {
    case axisPhase.zero:
      return 0
    case axisPhase.max:
      return depth - 1
    case axisPhase.inner:
      return i
    case axisPhase.outer:
      return o
  }
}

function getColor([rPhase, gPhase, bPhase]: axisPhase[], i, o) {
  const r = getChannel(rPhase, i, o)
  const g = getChannel(gPhase, i, o)
  const b = getChannel(bPhase, i, o)

  return [r / (depth - 1), g / (depth - 1), b / (depth - 1)]
}

export default function populate({ scene }) {
  phases.forEach((phase) => {
    const vertices = []
    const indices = []
    const normals = []
    const colors = []

    for (let i = 0; i < depth; i++) {
      for (let o = 0; o < depth; o++) {
        const color = getColor(phase, i, o)
        Array.prototype.push.apply(colors, color)

        const [L, A, B] = sRGB_to_LAB(color)
        const position = new Vector3(
          A * ABComponentScale,
          L,
          B * ABComponentScale
        )
        vertices.push(position.x, position.y, position.z)

        const normal = position.sub(center).normalize()
        normals.push(normal.x, normal.y, normal.z)
      }
    }

    for (let i = 0; i < depth - 1; i++) {
      for (let o = 0; o < depth - 1; o++) {
        const v1 = i * depth + (o + 1)
        const v2 = i * depth + o
        const v3 = (i + 1) * depth + o
        const v4 = (i + 1) * depth + (o + 1)

        indices.push(v1, v2, v4) // face one
        indices.push(v2, v3, v4) // face two
      }
    }

    const geometry = new BufferGeometry()
    geometry.setIndex(indices)
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
    geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3))
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))

    scene.add(
      new Mesh(
        geometry,
        new MeshPhongMaterial({
          side: DoubleSide,
          vertexColors: true,
          transparent: true,
          opacity: 0.1,
        })
      )
    )
  })
}
