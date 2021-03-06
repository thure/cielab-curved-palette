import process from 'process'
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'

import app from './app'
import palettes from './palettes'
import themes from './themes'
import system from './system'
import exportSettings from './exportSettings'

export const store = configureStore({
  reducer: persistReducer(
    {
      key: 'root',
      storage,
    },
    combineReducers({
      app,
      palettes,
      themes,
      system,
      exportSettings,
    })
  ),
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
