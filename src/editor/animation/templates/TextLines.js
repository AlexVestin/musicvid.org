

import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        const scene = this.addSceneFromText("perspective");
        const it0 = scene.addItemFromText("TextLines");
        it0.mesh.position.y = 30;
        const it1 = scene.addItemFromText("TextLines");
        it1.text = "Song"; 
        it1.mesh.position.y = -20;
        it0.updateDisplay();
        it1.updateDisplay();
    }
}