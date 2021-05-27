import { mount as mountScene } from './scene'
import { mount as mountControls } from './controls'

const sceneControls = mountScene()
const controls = mountControls(sceneControls)
