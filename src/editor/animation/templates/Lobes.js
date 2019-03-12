

import OrthographicScene from '../scenes/OrthographicScene'
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        this.scenes.push(new OrthographicScene(this.layersFolder, this.resolution));
        
        const it0 = this.scenes[0].addItemFromText("SideLobes");
        this.overviewFolder.onResize();
        
    }

}