

import WebGLManager from '../WebGLManager'
import PerspectiveScene from '../scenes/PerspectiveScene';

export default class Manager extends WebGLManager {

    setUpScene() {
        this.scenes.push(new PerspectiveScene(this.layersFolder, this.resolution));
        
        const it0 = this.scenes[0].addItemFromText("TextLines");
        it0.mesh.position.y = 30;
        const it1 = this.scenes[0].addItemFromText("TextLines");
        it1.text = "Song"; 
        it1.mesh.position.y = -20;
        it0.setUpGUI(this.overviewFolder, "TextLines");
        it1.setUpGUI(this.overviewFolder, "TextLines");
        
        this.overviewFolder.onResize();
        
    }

}