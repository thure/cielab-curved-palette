import {
  CylinderGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  TextureLoader,
  Vector3,
} from 'three'
import hAxisAsset from '../assets/h-axis.png'
import lcAxesAsset from '../assets/lc-axes.png'
import { rotateAboutPoint } from '../lib/3d'

const alphaTest = 0.1

export default function populate({ scene }) {
  const hSize = 150

  const hAxisMesh = new Mesh(
    new PlaneGeometry(hSize, hSize, 10, 10),
    new MeshBasicMaterial({
      map: new TextureLoader().load(hAxisAsset),
      transparent: true,
      side: DoubleSide,
      alphaTest,
    })
  )

  hAxisMesh.position.set(0, 0, 0)

  hAxisMesh.rotation.set(-Math.PI / 2, 0, 0)

  hAxisMesh.updateMatrix()

  scene.add(hAxisMesh)

  const [lcWidth, lcHeight] = [77.5, 135]

  const lcAxesMesh = new Mesh(
    new PlaneGeometry(lcWidth, lcHeight, 10, 10),
    new MeshBasicMaterial({
      map: new TextureLoader().load(lcAxesAsset),
      transparent: true,
      side: DoubleSide,
      alphaTest,
    })
  )

  lcAxesMesh.position.set((-145 / 310) * lcWidth, (165 / 540) * lcHeight, 0)

  rotateAboutPoint(
    lcAxesMesh,
    new Vector3(0, 0, 0),
    new Vector3(0, 1, 0),
    Math.PI / 24
  )

  lcAxesMesh.updateMatrix()

  scene.add(lcAxesMesh)

  const lchGamut = new Mesh(
    new CylinderGeometry(50, 50, 99.9, 360, 1),
    new MeshBasicMaterial({ transparent: true, opacity: 0.1 })
  )

  lchGamut.renderOrder = 9e9
  lchGamut.position.set(0, 50.1, 0)

  lchGamut.updateMatrix()

  // scene.add(lchGamut)
}
