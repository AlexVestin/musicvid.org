

import CanvasScene from '../common/scenes/CanvasScene'
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        this.fftSize = 2048;
        this.scenes.push(new CanvasScene(this.layersFolder, this.resolution));
        
        const it1 = this.scenes[0].addItemFromText("Polartone2D");
        const it2 = this.scenes[0].addItemFromText("Text2D");

        it1.setUpGUI(this.overviewFolder, "Polartone");
        it2.setUpGUI(this.overviewFolder, "SpriteText");
        this.overviewFolder.onResize();
        
    }

}