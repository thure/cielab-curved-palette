import React, {
  useRef,
  useCallback,
  useMemo,
  MutableRefObject,
  useEffect,
} from 'react'
import { CurvePath, Vector3 } from 'three'

import { useAppSelector } from '../../state/hooks'
import { curvePathFromPalette } from '../../lib/paletteShades'
import { init, mount, unmount, setCurve, SceneRef } from './scene'
import { PalettePreview } from '../PalettePreview'

function useHookWithRefCallback(deps, initialCurve: CurvePath<Vector3>) {
  const ref = useRef<SceneRef | null>(null)
  const setRef = useCallback((node: HTMLCanvasElement | null) => {
    if (ref.current) {
      unmount(ref.current)
      if (node) {
        mount(ref.current, node)
      }
    } else if (node) {
      ref.current = init(node, initialCurve)
    }
  }, deps)

  return [setRef, ref]
}

export const LchVis = ({ paletteId }: { paletteId: string }) => {
  const darkCp = useAppSelector((state) => state.palettes[paletteId].darkCp)
  const lightCp = useAppSelector((state) => state.palettes[paletteId].lightCp)
  const keyColor = useAppSelector((state) => state.palettes[paletteId].keyColor)
  const hueTorsion = useAppSelector(
    (state) => state.palettes[paletteId].hueTorsion
  )

  const deps = [darkCp, lightCp, hueTorsion, keyColor]

  const paletteCurve = useMemo(() => {
    return curvePathFromPalette({ keyColor, darkCp, lightCp, hueTorsion })
  }, deps)

  const [$canvas, sceneRef] = useHookWithRefCallback([paletteId], paletteCurve)
  const canvasId = `${paletteId}__canvas`

  useEffect(() => {
    const mutableSceneRef = sceneRef as MutableRefObject<SceneRef>
    if (mutableSceneRef.current)
      mutableSceneRef.current = setCurve(mutableSceneRef.current, paletteCurve)
  }, deps)

  return (
    <>
      <canvas
        className="lchVis"
        id={canvasId}
        ref={$canvas as (node: HTMLCanvasElement) => void}
      />
      <PalettePreview curve={paletteCurve} />
    </>
  )
}
