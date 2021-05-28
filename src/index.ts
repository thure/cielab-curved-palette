import { mount as mountScene } from './scene'
import { mount as mountControls, curveUpdateHandler } from './controls'

const sceneControls = mountScene({ curveUpdateHandler })
const controls = mountControls(sceneControls)
