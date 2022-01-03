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
    setFromImport: (state, { payload }: PayloadAction<SystemState>) => {
      Object.keys(payload).forEach((key) => {
        if (payload.hasOwnProperty(key)) {
          state[key] = payload[key]
        }
      })
    },
  },
})

export const { setName } = systemSlice.actions
export default systemSlice.reducer
