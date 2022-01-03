import { RootState } from '../../state/store'
import { render as renderCSS } from './csscp'

export function renderExport(state: RootState) {
  switch (state.exportSettings.type) {
    case 'csscp':
      return renderCSS(state)
    default:
      return ''
  }
}
