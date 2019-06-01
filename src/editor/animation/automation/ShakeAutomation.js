
import Automation from './Automation'
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'

export default class AudioReactiveAutomation extends Automation {
    constructor(gui) {
        super(gui);
        this.type = "shake";
        this.name = "Audio Reactive Thing";
        this.folder = gui.addFolder("my folder", false); 

        this.values = ["x", "y"];

        this.waveDuration = 2 * Math.PI;
        this.maxShakeIntensity = Math.PI / 3;
        this.maxShakeDisplacement = 8;
        this.minShakeScalar = 0.9;
        this.maxShakeScalar = 1.6;
        this.waveDuration  = Math.PI * 2;
        
        // X
        this.waveFrameX = 0;
        this.waveSpeedX = 1;
        this.waveAmplitudeX = 1;
        this.trigX = Math.round(Math.random());

        // Y
        this.waveFrameY = 0;
        this.waveSpeedY = 1;
        this.waveAmplitudeY = 1;
        this.trigY = Math.round(Math.random());

        this.x = 0;
        this.y = 0;
        this.impactAnalyser = new ImpactAnalyser(this.folder, this, true);
    }

    random = function(min, max) {
        return Math.random() * (max - min) + min;
    }

    stop = () => {
        this.x = 0;
        this.y = 0;
    }

    __serialize = () => {
        const obj = this.__serializeControllers();
        obj.type = this.type;
        obj.name = this.name;
        obj.__id = this.__id;
        return obj;
    }

    __setUpGUI = (folder) => {
        this.addController(folder, this, )
    }

    update = (time, audioData) => {
        const multiplier = this.impactAnalyser.analyse(audioData.frequencyData);

        let step = this.maxShakeIntensity * multiplier;
        this.waveFrameX += step * this.waveSpeedX;
        if (this.waveFrameX > this.waveDuration) {
            this.waveFrameX = 0;
            this.waveAmplitudeX = this.random(this.minShakeScalar, this.maxShakeScalar);
            this.waveSpeedX = this.random(this.minShakeScalar, this.maxShakeScalar) * (Math.random() < 0.5 ? -1 : 1);
            this.trigX = Math.round(Math.random());
        }
        
        this.waveFrameY += step * this.waveSpeedY;
        if (this.waveFrameY > this.waveDuration) {
            this.waveFrameY = 0;
            this.waveAmplitudeY = this.random(this.minShakeScalar, this.maxShakeScalar);
            this.waveSpeedY = this.random(this.minShakeScalar, this.maxShakeScalar) * (Math.random() < 0.5 ? -1 : 1);
            this.trigY = Math.round(Math.random());
        }

        let trigFuncX = this.trigX === 0 ? Math.cos : Math.sin;
        let trigFuncY = this.trigY === 0 ? Math.cos : Math.sin;

        let dx = trigFuncX(this.waveFrameX) * this.maxShakeDisplacement * this.waveAmplitudeX * multiplier;
        let dy = trigFuncY(this.waveFrameY) * this.maxShakeDisplacement * this.waveAmplitudeY * multiplier;

        console.log(multiplier, this.waveFrameX, this.maxShakeDisplacement,dx,dy,this.x,this.y)
        this.x += dx;
        this.y += dy;
    }
}