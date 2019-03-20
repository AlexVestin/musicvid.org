
import * as THREE from "three";
import SpectrumAnalyser from 'editor/audio/SpectrumAnalyser'
import BaseItem from '../BaseItem'

export default class SideLobes extends BaseItem {
    constructor(info)  {
        super(info);
        this.name = "Sidelobes";
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        
        this.size = 512;
        this.canvas.width = this.size;
        this.canvas.height = this.size;

        this.colors = ["#FFFFFF", "#FFFF00", "#FF0000", "#FF66FF", "#333399", "#0000FF", "#33CCFF", "#00FF00"];
        this.spectrumCount = 8;
        this.exponents = [1, 1.12, 1.14, 1.30, 1.33, 1.36, 1.50, 1.52];
        this.smoothMargins = [0, 2, 2, 3, 3, 3, 5, 5];
        this.spectrumCache = [];
        this.delays = [0, 1, 2, 3, 4, 5, 6, 7];
        this.maxBufferSize = Math.max.apply(null, this.delays);
        this.resMult = info.height / info.width;

        this.exp = 4
        this.preAmplitude = 1.0;
        this.emblemExaggeration = 1.5;

        this.startBin = 8;
        this.keepBins = 40;
        this.prevArr = [];
        this.minRadius = this.size / 4;

        //SHAKE 
        this.scale = 1.0
        this.tex = new THREE.CanvasTexture(this.canvas);
        this.tex.generateMipmaps = false;
        this.tex.magFilter = THREE.LinearFilter;
        this.tex.minFilter = THREE.LinearFilter;
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2 * this.resMult, 2), new THREE.MeshBasicMaterial({map: this.tex, transparent: true}));
        this.barHeightMultiplier = 1.3;
        this.__setUpFolder();
        
        this.ctx.shadowBlur = 12;

        this.spectrumAnimation = "phase_1";
        this.spectrumSize  = 64;
        this.resRatio = info.width / info.height;
        this.barWidth = 6;
        this.spectrumSpacing = 2;
        this.blockTopPadding = 50 * this.resRatio;
        this.spectrumWidth = this.spectrumSize * (this.barWidth  + this.spectrumSpacing);
        this.spectrumHeight = 256;

        
        
        this.analyser = new SpectrumAnalyser(this.folder);
        this.analyser.minDecibel = -100;
        this.analyser.maxDecibel = -33;
        //this.analyser.enableToWebAudioForm = false;
        
        this.analyser.smoothingTimeConstant = 0.2;


        info.scene.add(this.mesh);
    }
    stop = () => {
        this.spectrumAnimation = "phase_1";
    }


    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);        
        folder.add(this.mesh.position, "x", -2, 2, 0.01);
        folder.add(this.mesh.position, "y", -2, 2, 0.01);
        folder.add(this, "scale", -2, 2).onChange(() => this.mesh.scale.set(this.scale, this.scale, 1));

        folder.add(this.ctx, "shadowBlur", 0, 100);
        folder.add(this, "barHeightMultiplier", 0, 6.0, 0.01);
        folder.add(this.ctx, "shadowOffsetX", 0, 100);
        folder.add(this.ctx, "shadowOffsetY", 0, 100);
        return this.__addFolder(folder);
    }

    calcRadius = function(multiplier) {
        let minSize = this.minRadius;
        let maxSize = this.size / 2;
        let scalar = multiplier * (maxSize - minSize) + minSize;
        return scalar / 2;
    }

    update = (time, audioData) => {
        const { spectrumHeight, spectrumWidth, resRatio, spectrumSize } = this;
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

    
        const array = this.analyser.analyse(audioData.frequencyData);
        
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = this.shadowBlur;
        this.ctx.shadowOffsetX = this.shadowOffsetX;
        this.ctx.shadowOffsetY = this.shadowOffsetY;

        const halfHeight = this.size / 2;
        var ratio;
        if (this.spectrumAnimation === "phase_1") {
            ratio = time;

            this.ctx.fillStyle = "red";

            this.ctx.fillRect(0, spectrumHeight - 2 * resRatio, (spectrumWidth/2) * ratio, 2 * resRatio);
            this.ctx.fillRect(spectrumWidth - (spectrumWidth/2) * ratio, spectrumHeight - 2 * resRatio, (spectrumWidth/2) * ratio, 2 * resRatio);
    
            if (ratio > 1) {
                this.spectrumAnimation = "phase_2";
            }

        } else if (this.spectrumAnimation === "phase_2") {
            ratio = (time - 1.0) / 2.0;
    
            this.ctx.globalAlpha = Math.abs(Math.cos(ratio*10));
    
            this.ctx.fillRect(0, spectrumHeight - 2 * resRatio, spectrumWidth, 2 * resRatio);
    
            this.ctx.globalAlpha = 1;
    
            if (ratio > 1) {
                this.spectrumAnimation = "phase_3";
            }
        } else if (this.spectrumAnimation === "phase_3") {
            ratio = (time - 2) / 2.0;
    
            // drawing pass
            this.ctx.beginPath();
            this.ctx.moveTo(0,halfHeight);
            for (var i = 0; i < spectrumSize; i++) {


                this.ctx.lineTo(this.size * i/ spectrumSize, halfHeight - array[i]);
                /*
                var value = array[i];
                let c = (i / spectrumSize + (i+1) / spectrumSize) / 2;
                let d = (array[i] + array[i + 1]) / 2;

                const cpx = this.size *  i / spectrumSize;
                const cpy = value;
                this.ctx.quadraticCurveTo(cpx, array[i+1], this.size * c, value);*/
            }

            
        }
        this.ctx.fill();
        this.tex.needsUpdate = true;
    }
}