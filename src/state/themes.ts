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
  },
})

export default themesSlice.reducer
