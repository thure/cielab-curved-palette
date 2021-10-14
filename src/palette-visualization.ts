import { mount as mountScene } from './scene'
import { mount as mountControls, curveUpdateHandler } from './controls'

mountControls(mountScene({ curveUpdateHandler }))
