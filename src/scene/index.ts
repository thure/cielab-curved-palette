import {
  PerspectiveCamera,
  Scene,
  MeshBasicMaterial,
  PlaneGeometry,
  Mesh,
  TextureLoader,
  WebGLRenderer,
  Vector3,
  DoubleSide,
} from 'three'
import hAxisAsset from '../assets/h-axis.png'
import lcAxesAsset from '../assets/lc-axes.png'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { LchColor } from '../lib/color'
import { rotateAboutPoint } from '../lib/3d'

function populate({ scene }) {
  const hSize = 396

  const hAxisMesh = new Mesh(
    new PlaneGeometry(hSize, hSize, 10, 10),
    new MeshBasicMaterial({
      map: new TextureLoader().load(hAxisAsset),
      transparent: true,
      side: DoubleSide,
      alphaTest: 0.5,
    })
  )

  hAxisMesh.position.set(0, 0, 0)

  hAxisMesh.rotation.set(-Math.PI / 2, 0, 0)

  hAxisMesh.updateMatrix()

  scene.add(hAxisMesh)

  const [lcWidth, lcHeight] = [204.6, 356.4]

  const lcAxesMesh = new Mesh(
    new PlaneGeometry(lcWidth, lcHeight, 10, 10),
    new MeshBasicMaterial({
      map: new TextureLoader().load(lcAxesAsset),
      transparent: true,
      side: DoubleSide,
      alphaTest: 0.5,
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
}

export function init() {
  window.addEventListener('resize', onWindowResize, false)

  const camera = new PerspectiveCamera(
    12,
    window.innerWidth / window.innerHeight,
    0.01,
    4e3
  )
  camera.position.x = 1400
  camera.position.z = 1400
  camera.position.y = 900

  const scene = new Scene()
  scene.background = LchColor(50, 0, 0)

  const renderer = new WebGLRenderer({ antialias: true })

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target = new Vector3(0, 264 / 2, 0)
  controls.update()

  document.body.appendChild(renderer.domElement)

  populate({ scene })

  function onWindowResize() {
    const density = window.devicePixelRatio
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth * density, window.innerHeight * density)
  }

  function render() {
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  onWindowResize()
  render()
}
