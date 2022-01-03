import range from 'lodash/range'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NamedTheme } from '../lib/interfaces'

export type ExportType = 'csscp' | 'json'

interface ThemeCollectionInlucde {
  [paletteId: string]: number[]
}

interface ExportSettingsState {
  type: ExportType
  selector: string
  include: {
    [themeId: string]: {
      backgrounds: ThemeCollectionInlucde
      foregrounds: ThemeCollectionInlucde
    }
  }
}

const initialState = {
  type: 'csscp',
  selector: 'body',
  include: {},
} as ExportSettingsState

export const exportSettingsSlice = createSlice({
  name: 'exportSettings',
  initialState,
  reducers: {
    setType: (state, { payload: type }: PayloadAction<ExportType>) => {
      state.type = type
    },
    setSelector: (state, { payload: selector }: PayloadAction<string>) => {
      state.selector = selector
    },
    reset: (state) => (state = initialState),
    setFromImport: (state, { payload }: PayloadAction<ExportSettingsState>) => {
      Object.keys(payload).forEach((key) => {
        if (payload.hasOwnProperty(key)) {
          state[key] = payload[key]
        }
      })
    },
    includeTheme: (
      state,
      {
        payload: { themeId, theme },
      }: PayloadAction<{ themeId: string; theme: NamedTheme }>
    ) => {
      state.include[themeId] = {
        backgrounds: Object.keys(theme.backgrounds).reduce((acc, paletteId) => {
          acc[paletteId] = range(0, theme.backgrounds[paletteId].nShades)
          return acc
        }, {}),
        foregrounds: Object.keys(theme.foregrounds).reduce((acc, paletteId) => {
          acc[paletteId] = range(0, theme.foregrounds[paletteId].nShades)
          return acc
        }, {}),
      }
    },
    excludeTheme: (
      state,
      { payload: { themeId } }: PayloadAction<{ themeId: string }>
    ) => {
      delete state.include[themeId]
    },
    includeShade: (
      state,
      {
        payload: { themeId, themeKey, paletteId, shade },
      }: PayloadAction<{
        themeId: string
        themeKey: 'backgrounds' | 'foregrounds'
        paletteId: string
        shade: number
      }>
    ) => {
      const shades = new Set(state.include[themeId][themeKey][paletteId])
      shades.add(shade)
      state.include[themeId][themeKey][paletteId] = Array.from(shades)
    },
    excludeShade: (
      state,
      {
        payload: { themeId, themeKey, paletteId, shade },
      }: PayloadAction<{
        themeId: string
        themeKey: 'backgrounds' | 'foregrounds'
        paletteId: string
        shade: number
      }>
    ) => {
      const shades = new Set(state.include[themeId][themeKey][paletteId])
      shades.delete(shade)
      state.include[themeId][themeKey][paletteId] = Array.from(shades)
    },
  },
})

export default exportSettingsSlice.reducer
