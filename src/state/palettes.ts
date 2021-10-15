import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Palette } from '../lib/interfaces'

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
    delete: (state, { payload }: PayloadAction<{ id: string }>) => {
      delete state[payload.id]
    },
  },
})

export const { create } = palettesSlice.actions
export default palettesSlice.reducer
