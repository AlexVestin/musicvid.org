

import OrthographicScene from '../common/scenes/OrthographicScene'
import PerspectiveScene from '../common/scenes/PerspectiveScene'
import WebGLManager from '../WebGLManager'

export default class Monstercat extends WebGLManager {

    setUpScene() {
        console.log(this.resolution, "dopifgnio")
        const particlesScene = new PerspectiveScene(this.layersFolder, this.resolution); 
        const spectrumBarsScene = new OrthographicScene(this.layersFolder, this.resolution); 

        particlesScene.camera.position.z = 300;
        particlesScene.camera.updateMatrixWorld();
        this.scenes.push(particlesScene);

        const bars = spectrumBarsScene.addItemFromText("MonsterBars");
        const artistText = spectrumBarsScene.addItemFromText("SpriteText");
        const songtext = spectrumBarsScene.addItemFromText("SpriteText");


        const image = spectrumBarsScene.addItemFromText("Image");
        image.changeImage();

        const textSize = 60;


        artistText.setText("OWL CITY x SAID THE SKY", -0.28, -0.23, {fontSize: textSize, textAlign: "left", textShadow: "0 0 15px rgba(0,0,0,0.4)"});
        songtext.setText("FIREFLIES", -0.28, -0.33, {fontSize: textSize-30, textAlign: "left"});
        artistText.setUpGUI(this.overviewFolder, "Artist text");
        songtext.setUpGUI(this.overviewFolder, "Song text");

        image.mesh.scale.set(0.16 / this.aspect, 0.16, 0.16);
        image.mesh.position.x = -0.39;
        image.mesh.position.y = -0.22;
        image.setUpGUI(this.overviewFolder, "Image");

        this.scenes.push(spectrumBarsScene);
        bars.setUpGUI(this.overviewFolder, "Bars")


        const it1 = particlesScene.addItemFromText("ParticlesSideways");
        it1.setUpGUI(this.overviewFolder, "Particles");
        this.overviewFolder.onResize();
    }

    autoPlaceText = () => {

    }
 
}