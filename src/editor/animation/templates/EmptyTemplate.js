

import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {
    setUpScene() {
        this.fftSize = 2048;
    }
}