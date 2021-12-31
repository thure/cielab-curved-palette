import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SystemState {
  name: string
}

const initialState = { name: '' } as SystemState

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setName: (
      state,
      { payload: { name } }: PayloadAction<{ name: string }>
    ) => {
      state.name = name
    },
    reset: (state) => (state = initialState),
  },
})

export const { setName } = systemSlice.actions
export default systemSlice.reducer
