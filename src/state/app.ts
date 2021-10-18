import { createSlice } from '@reduxjs/toolkit'

interface AppState {
  ui: 'light' | 'dark'
}

const initialState = { ui: 'dark' } as AppState

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleUi: (state) => {
      state.ui = state.ui === 'light' ? 'dark' : 'light'
    },
  },
})

export const { toggleUi } = appSlice.actions
export default appSlice.reducer
