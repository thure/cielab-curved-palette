import { configureStore } from '@reduxjs/toolkit'
import system from './system'

export const store = configureStore({
  reducer: {
    system,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
