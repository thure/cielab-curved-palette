import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ExportType = 'csscp' | 'json'

interface ExportSettingsState {
  type: ExportType
  selector: string
}

const initialState = {
  type: 'csscp',
  selector: 'body',
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
  },
})

export default exportSettingsSlice.reducer
