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
      state[id].backgrounds[paletteId] = {
        range: [0, 20],
        nShades: 3,
        shadeNames: {},
      }
    },
    addForeground: (
      state,
      {
        payload: { id, paletteId },
      }: PayloadAction<{ id: string; paletteId: string }>
    ) => {
      state[id].foregrounds[paletteId] = {
        range: [60, 100],
        nShades: 3,
        shadeNames: {},
      }
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
    setDarkPoint: (
      state,
      {
        payload: { themeId, themeKey, paletteId, value },
      }: PayloadAction<{
        themeId: string
        paletteId: string
        themeKey: string
        value: number
      }>
    ) => {
      state[themeId][themeKey][paletteId].range[0] = value
    },
    setLightPoint: (
      state,
      {
        payload: { themeId, themeKey, paletteId, value },
      }: PayloadAction<{
        themeId: string
        paletteId: string
        themeKey: string
        value: number
      }>
    ) => {
      state[themeId][themeKey][paletteId].range[1] = value
    },
    setNShades: (
      state,
      {
        payload: { themeId, themeKey, paletteId, value },
      }: PayloadAction<{
        themeId: string
        paletteId: string
        themeKey: string
        value: number
      }>
    ) => {
      state[themeId][themeKey][paletteId].nShades = value
    },
    setShadeName: (
      state,
      {
        payload: { themeId, themeKey, paletteId, shade, value },
      }: PayloadAction<{
        themeId: string
        paletteId: string
        themeKey: string
        shade: number
        value: string
      }>
    ) => {
      // todo: immer is bugging, probably because this is an array, it's casting this to an Object
      state[themeId][themeKey][paletteId].shadeNames[shade] = value
    },
    reset: (state) => (state = initialState),
    setFromImport: (state, { payload }: PayloadAction<ThemesState>) => {
      Object.keys(payload).forEach((key) => {
        if (payload.hasOwnProperty(key)) {
          state[key] = payload[key]
        }
      })
    },
  },
})

export default themesSlice.reducer
