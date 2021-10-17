import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NamedPalette, Vec3 } from '../lib/interfaces'

interface PalettesState {
  [themeId: string]: NamedPalette
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
  },
})

export default palettesSlice.reducer
