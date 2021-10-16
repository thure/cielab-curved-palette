import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NamedPalette, Vec3 } from '../lib/interfaces'

interface PalettesState {
  [paletteId: string]: NamedPalette
}

const initialState = {} as PalettesState

export const palettesSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    create: (
      state,
      { payload }: PayloadAction<NamedPalette & { id: string }>
    ) => {
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
    setName: (
      state,
      { payload: { id, name } }: PayloadAction<{ id: string; name: string }>
    ) => {
      state[id].name = name
    },
  },
})

export default palettesSlice.reducer
