import {
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { LchColor } from './lib/color'

let mesh
let renderer
let scene
let camera
let controls

window.addEventListener('resize', onWindowResize, false)

init()
animate()

function init() {
  camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  )
  camera.position.z = 1

  scene = new Scene()
  scene.background = LchColor(50, 0, 0)

  const geometry = new BoxGeometry(0.2, 0.2, 0.2)
  const material = new MeshNormalMaterial()

  mesh = new Mesh(geometry, material)
  scene.add(mesh)

  renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

  controls = new OrbitControls(camera, renderer.domElement)

  document.body.appendChild(renderer.domElement)
}

function animate() {
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
