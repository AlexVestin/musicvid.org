

import OrthographicScene from '../common/scenes/OrthographicScene'
import WebGLManager from '../WebGLManager'

export default class Stars extends WebGLManager {

    setUpScene() {
        this.scenes.push(new OrthographicScene(this.layersFolder, this.resolution));
        this.scenes.push(new OrthographicScene(this.layersFolder, this.resolution));
        

        const it1 = this.scenes[0].addItemFromText("StarField");
        const it3 = this.scenes[1].addItemFromText("SpriteTextMask");

        it1.setUpGUI(this.overviewFolder, "StarField");
        it3.setUpGUI(this.overviewFolder, "Image");

        this.overviewFolder.onResize();
    }
}