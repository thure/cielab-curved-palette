import React, { useRef, useCallback, useMemo } from 'react'
import { CurvePath, Vector3 } from 'three'
import { useAppSelector } from '../../state/hooks'
import { curvePathFromPalette } from '../../lib/paletteShades'
import { init, mount, unmount, SceneRef } from './scene'

function useHookWithRefCallback(deps) {
  const ref = useRef<SceneRef | null>(null)
  const setRef = useCallback((node: HTMLCanvasElement | null) => {
    if (ref.current) {
      unmount(ref.current)
      if (node) {
        mount(ref.current, node)
      }
    } else if (node) {
      ref.current = init(node)
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

  const [$canvas, scene] = useHookWithRefCallback([paletteId])
  const canvasId = `${paletteId}__canvas`

  return (
    <canvas
      className="lchVis"
      id={canvasId}
      ref={$canvas as (node: HTMLCanvasElement) => void}
    />
  )
}
