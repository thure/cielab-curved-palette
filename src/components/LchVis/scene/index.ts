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

import { LchColor } from '../../../lib/color'
import populateGamut from './gamut'
import { ck, lk } from './constants'

export type SceneRef = {
  pause: () => void
  resume: () => void
  renderer: WebGLRenderer
}

export function init(canvas: HTMLCanvasElement): SceneRef {
  window.addEventListener('resize', onWindowResize, false)

  const camera = new PerspectiveCamera(12, 1, 0.01, 8e3)
  camera.position.x = 1160 * -ck
  camera.position.y = 0
  camera.position.z = 50 * lk

  const scene = new Scene()
  // scene.background = LchColor(50, 0, 0)
  scene.background = null

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target = new Vector3(0, 0, 50 * lk)
  controls.update()

  //const axes = populateAxes({ scene })
  const { gamut, updateGamut } = populateGamut({ scene })

  const composer = new EffectComposer(renderer)

  composer.addPass(new RenderPass(scene, camera))

  const outlinePass = new OutlinePass(new Vector2(), scene, camera, [gamut])

  outlinePass.edgeGlow = 0
  outlinePass.visibleEdgeColor = LchColor(50, 0, 0)
  outlinePass.overlayMaterial.blending = CustomBlending

  composer.addPass(outlinePass)
  function updateGamutOutline({ enabled }) {
    outlinePass.enabled = enabled
  }

  function onWindowResize() {
    const rect = canvas.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    const density = window.devicePixelRatio
    const dw = w * density
    const dh = h * density
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(dw, dh)
    outlinePass.setSize(dw, dh)
    composer.setSize(dw, dh)
  }

  let playing = true

  function render() {
    composer.render()
    if (playing) requestAnimationFrame(render)
  }

  function pause() {
    playing = false
  }

  function resume() {
    playing = true
  }

  onWindowResize()
  render()

  return {
    pause,
    resume,
    renderer,
  }
}

export function unmount({ renderer, pause }) {
  pause()
  renderer.domElement = null
}

export function mount({ renderer, resume }, canvas: HTMLCanvasElement) {
  renderer.domElement = canvas
  resume()
}
