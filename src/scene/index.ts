import {
  CustomBlending,
  PerspectiveCamera,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

import { LchColor } from '../lib/color'
import populateAxes from './axes'
import populateGamut from './gamut'
import populateCurve from './curve'

export function mount({ curveUpdateHandler }) {
  const initialState = {
    keyColorLCH: [44.51, 39.05, 288.84],
    darkControl: 2 / 3,
    lightControl: 1 / 3,
    hueTorsion: 0,
    gamutOpacity: 0,
    gamutOutlineEnabled: true,
  }

  window.addEventListener('resize', onWindowResize, false)

  const camera = new PerspectiveCamera(12, 1, 0.01, 4e3)
  camera.position.x = 600
  camera.position.z = 600
  camera.position.y = 300

  const scene = new Scene()
  scene.background = LchColor(50, 0, 0)

  const renderer = new WebGLRenderer({ antialias: true })

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target = new Vector3(0, 50, 0)
  controls.update()

  document.body.appendChild(renderer.domElement)

  const axes = populateAxes({ scene })
  const { gamut, updateGamut } = populateGamut({ scene })
  const { updateCurve } = populateCurve({
    scene,
    initialState,
    onUpdate: curveUpdateHandler,
  })

  const composer = new EffectComposer(renderer)

  composer.addPass(new RenderPass(scene, camera))

  const outlinePass = new OutlinePass(new Vector2(), scene, camera, [gamut])

  outlinePass.edgeGlow = 0
  outlinePass.visibleEdgeColor = LchColor(20, 0, 0)
  outlinePass.overlayMaterial.blending = CustomBlending

  composer.addPass(outlinePass)
  function updateGamutOutline({ enabled }) {
    outlinePass.enabled = enabled
  }

  function onWindowResize() {
    const w = window.innerWidth + 336
    const h = window.innerHeight
    const density = window.devicePixelRatio
    const dw = w * density
    const dh = h * density
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(dw, dh)
    outlinePass.setSize(dw, dh)
    composer.setSize(dw, dh)
  }

  function render() {
    composer.render()
    requestAnimationFrame(render)
  }

  onWindowResize()
  render()

  return {
    initialState,
    updateCurve,
    updateGamut,
    updateGamutOutline,
  }
}
