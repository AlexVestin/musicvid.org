

import OrthographicScene from '../common/scenes/OrthographicScene'
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        this.fftSize = 2048;
        this.scenes.push(new OrthographicScene(this.layersFolder, this.resolution));
        
        const it1 = this.scenes[0].addItemFromText("Polartone");
        const it2 = this.scenes[0].addItemFromText("SpriteText");

        it1.setUpGUI(this.overviewFolder, "Polartone");
        it2.setUpGUI(this.overviewFolder, "SpriteText");
        this.overviewFolder.onResize();
        
    }

}