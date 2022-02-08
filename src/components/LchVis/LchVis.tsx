import React, { useRef, useCallback, MutableRefObject, useEffect } from 'react'
import values from 'lodash/values'

import { init, mount, unmount, setCurve, SceneRef } from './scene'
import { PalettePreview } from '../PalettePreview'
import { usePaletteCurve } from '../../lib/usePaletteCurve'
import { Palette } from '../../lib/interfaces'
import { CurvedHelixPath } from '../../lib/paletteShades'

function useHookWithRefCallback(deps, initialCurve: CurvedHelixPath) {
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

export const LchVis = (props: {
  paletteId: string
  paletteCurve?: CurvedHelixPath
  palette?: Palette
}) => {
  const { paletteId } = props
  const [paletteCurve, palette] =
    [props.paletteCurve, props.palette] ?? usePaletteCurve(paletteId)

  const [$canvas, sceneRef] = useHookWithRefCallback([paletteId], paletteCurve)
  const canvasId = `${paletteId}__canvas`

  useEffect(() => {
    const mutableSceneRef = sceneRef as MutableRefObject<SceneRef>
    if (mutableSceneRef.current)
      mutableSceneRef.current = setCurve(mutableSceneRef.current, paletteCurve)
  }, values(palette))

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
