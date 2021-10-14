import { createSlice } from '@reduxjs/toolkit'

interface SystemState {
  ui: 'light' | 'dark'
}

const initialState = { ui: 'dark' } as SystemState

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    toggleUi: (state) => {
      state.ui = state.ui === 'light' ? 'dark' : 'light'
    }
  },
})

export const { toggleUi } = systemSlice.actions
export default systemSlice.reducer
