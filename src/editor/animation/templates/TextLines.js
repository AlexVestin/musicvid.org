

import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        this.scenes.push(this.addPerspectiveScene());
        const it0 = this.scenes[0].addItemFromText("TextLines");
        it0.mesh.position.y = 30;
        const it1 = this.scenes[0].addItemFromText("TextLines");
        it1.text = "Song"; 
        it1.mesh.position.y = -20;
        it0.updateDisplay();
        it1.updateDisplay();
        this.overviewFolder.onResize();
    }
}