import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NamedTheme } from '../lib/interfaces'

interface ThemesState {
  [themeId: string]: NamedTheme
}

const initialState = {} as ThemesState

export const themesSlice = createSlice({
  name: 'themes',
  initialState,
  reducers: {
    create: (
      state,
      { payload }: PayloadAction<NamedTheme & { id: string }>
    ) => {
      const { id, ...theme } = payload
      state[id] = theme
    },
    delete: (state, { payload: { id } }: PayloadAction<{ id: string }>) => {
      delete state[id]
    },
    setName: (
      state,
      { payload: { id, name } }: PayloadAction<{ id: string; name: string }>
    ) => {
      state[id].name = name
    },
    addBackground: (
      state,
      {
        payload: { id, paletteId },
      }: PayloadAction<{ id: string; paletteId: string }>
    ) => {
      state[id].backgrounds[paletteId] = { range: [0, 20] }
    },
    addForeground: (
      state,
      {
        payload: { id, paletteId },
      }: PayloadAction<{ id: string; paletteId: string }>
    ) => {
      state[id].foregrounds[paletteId] = { range: [60, 100] }
    },
    removeBackground: (
      state,
      {
        payload: { id, paletteId },
      }: PayloadAction<{ id: string; paletteId: string }>
    ) => {
      delete state[id].backgrounds[paletteId]
    },
    removeForeground: (
      state,
      {
        payload: { id, paletteId },
      }: PayloadAction<{ id: string; paletteId: string }>
    ) => {
      delete state[id].foregrounds[paletteId]
    },
  },
})

export default themesSlice.reducer
