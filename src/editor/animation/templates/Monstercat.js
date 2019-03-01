

import Scene3DOrthoGraphic from '../common/scenes/Scene3DOrthoGraphic'
import Scene3DPerspective from '../common/scenes/Scene3DPerspective'
import WebGLManager from '../WebGLManager'

export default class Monstercat extends WebGLManager {

    setUpScene() {
        console.log(this.resolution, "dopifgnio")
        const particlesScene = new Scene3DPerspective(this.gui.__folders["Layers"], this.resolution); 
        const spectrumBarsScene = new Scene3DOrthoGraphic(this.gui.__folders["Layers"], this.resolution); 

        particlesScene.camera.position.z = 300;
        particlesScene.camera.updateMatrixWorld();
        this.scenes.push(particlesScene);

        const bars = spectrumBarsScene.addItemFromText("MonsterBars");
        const artistText = spectrumBarsScene.addItemFromText("SpriteText");
        const songtext = spectrumBarsScene.addItemFromText("SpriteText");


        const image = spectrumBarsScene.addItemFromText("Image");
        image.changeImage();

        artistText.setText("Artist", -0.28, -0.23, {fontSize: 75, textAlign: "left"});
        songtext.setText("Song", -0.28, -0.33, {fontSize: 50, textAlign: "left"});
        artistText.setUpGUI(this.gui.__folders["Overview"], "Artist text");
        songtext.setUpGUI(this.gui.__folders["Overview"], "Song text");

        image.mesh.scale.set(0.16 / this.aspect, 0.16, 0.16);
        image.mesh.position.x = -0.39;
        image.mesh.position.y = -0.22;
        image.setUpGUI(this.gui.__folders["Overview"], "Image");

        this.scenes.push(spectrumBarsScene);
        bars.setUpGUI(this.gui.__folders["Overview"], "Bars")


        const it1 = particlesScene.addItemFromText("ParticlesSideways");
        it1.setUpGUI(this.gui.__folders["Overview"], "Particles");
        this.gui.__folders["Overview"].onResize();
    }

}