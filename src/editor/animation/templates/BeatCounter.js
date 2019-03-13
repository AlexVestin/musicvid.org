

import CanvasScene from '../scenes/CanvasScene'
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        const scene = new CanvasScene(this.layersFolder, this.resolution, this.removeScene);
        scene.addItemFromText("BeatCounter");
        this.scenes.push(scene);
    }
}