import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Palette, Vec3 } from '../lib/interfaces'

interface PallettesState {
  [paletteId: string]: Palette
}

const initialState = {} as PallettesState

export const palettesSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    create: (state, { payload }: PayloadAction<Palette & { id: string }>) => {
      const { id, ...palette } = payload
      state[id] = palette
    },
    delete: (state, { payload: { id } }: PayloadAction<{ id: string }>) => {
      delete state[id]
    },
    setKeyColor: (
      state,
      {
        payload: { id, keyColor },
      }: PayloadAction<{ id: string; keyColor: Vec3 }>
    ) => {
      state[id].keyColor = keyColor
    },
    setDarkCp: (
      state,
      { payload: { id, darkCp } }: PayloadAction<{ id: string; darkCp: number }>
    ) => {
      state[id].darkCp = darkCp
    },
    setLightCp: (
      state,
      {
        payload: { id, lightCp },
      }: PayloadAction<{ id: string; lightCp: number }>
    ) => {
      state[id].lightCp = lightCp
    },
    setHueTorsion: (
      state,
      {
        payload: { id, hueTorsion },
      }: PayloadAction<{ id: string; hueTorsion: number }>
    ) => {
      state[id].hueTorsion = hueTorsion
    },
  },
})

export default palettesSlice.reducer
