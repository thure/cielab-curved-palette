import {
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  IcosahedronBufferGeometry,
} from 'three'
import { LAB_to_sRGB } from '../lib/csswg/utilities'
import { ck, lk } from '../lib/3d'

let shades

const shadeMaterial = new MeshBasicMaterial({ vertexColors: true })
const shadeRadius = 1.5

function updateShades({ scene, shadePoints }) {
  if (!shades || shadePoints.length !== shades.children.length) {
    if (shades) scene.remove(shades)

    shades = new Group()

    shadePoints.forEach(() => {
      const shadeMesh = new Mesh(
        new IcosahedronBufferGeometry(shadeRadius, 1),
        shadeMaterial
      )
      shades.add(shadeMesh)
    })

    scene.add(shades)
  }

  shadePoints.forEach(([l, a, _b], i) => {
    const shadeMesh = shades.children[i]
    const color = LAB_to_sRGB([l, a, _b])
    const colors = []

    for (let i = 0; i < shadeMesh.geometry.attributes.position.count; i++) {
      Array.prototype.push.apply(colors, color)
    }

    shadeMesh.geometry.setAttribute(
      'color',
      new Float32BufferAttribute(colors, 3)
    )

    shadeMesh.position.set(a * ck, l * lk, _b * ck)
  })
}

export default function populate({ scene }) {
  return {
    updateShades: function (shadePoints) {
      updateShades({ scene, shadePoints })
    },
  }
}
