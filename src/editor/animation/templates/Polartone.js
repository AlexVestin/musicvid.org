

import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        this.fftSize = 2048;
        const scene = this.addSceneFromText("canvas");
        scene.addItemFromText("Polartone2D");
    
        const it2 = scene.addItemFromText("Text2D");
        const it3 = scene.addItemFromText("Text2D");
        it2.positionY = 0.9 ;
        it2.fillStyle = "#000000";
        it2.fontSize = 65;
        it3.positionY = 0.94 ;
        it3.fontSize = 30;
        it3.fillStyle = "#000000";
        
        it2.folder.updateDisplay();
        it3.folder.updateDisplay();
    }
}