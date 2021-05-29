import {
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  OctahedronBufferGeometry,
} from 'three'
import { LAB_to_sRGB } from '../lib/csswg/utilities'
import { ck, lk } from '../lib/3d'

let shades

const shadeMaterial = new MeshBasicMaterial({ vertexColors: true })
const shadeRadius = 1.5

function updateShades({ scene, shadePoints }) {
  if (shades) scene.remove(shades)
  shades = new Group()
  shadePoints.forEach(([l, a, _b]) => {
    const color = LAB_to_sRGB([l, a, _b])
    const shadeGeo = new OctahedronBufferGeometry(shadeRadius)
    const colors = []

    for (let i = 0; i < shadeGeo.attributes.position.count; i++) {
      Array.prototype.push.apply(colors, color)
    }

    shadeGeo.setAttribute('color', new Float32BufferAttribute(colors, 3))

    const shadeMesh = new Mesh(shadeGeo, shadeMaterial)

    shadeMesh.position.set(a * ck, l * lk, _b * ck)

    shades.add(shadeMesh)
  })
  scene.add(shades)
}

export default function populate({ scene }) {
  return {
    updateShades: function (shadePoints) {
      updateShades({ scene, shadePoints })
    },
  }
}
