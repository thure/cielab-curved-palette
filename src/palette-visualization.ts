import { mount as mountScene } from './components/LchVis/scene'
import { mount as mountControls, curveUpdateHandler } from './controls'

mountControls(mountScene({ curveUpdateHandler }))
