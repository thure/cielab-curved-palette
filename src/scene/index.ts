import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Vector3,
  HemisphereLight,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { LchColor } from '../lib/color'
import populateAxes from './axes'
import populateGamut from './gamut'

export function init() {
  window.addEventListener('resize', onWindowResize, false)

  const camera = new PerspectiveCamera(
    12,
    window.innerWidth / window.innerHeight,
    0.01,
    4e3
  )
  camera.position.x = 600
  camera.position.z = 600
  camera.position.y = 400

  const scene = new Scene()
  scene.background = LchColor(50, 0, 0)

  const renderer = new WebGLRenderer({ antialias: true })

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target = new Vector3(0, 50, 0)
  controls.update()

  const light = new HemisphereLight()
  scene.add(light)

  document.body.appendChild(renderer.domElement)

  populateAxes({ scene })
  populateGamut({ scene })

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
