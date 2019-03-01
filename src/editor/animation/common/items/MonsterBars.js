
import * as THREE from "three";
import SpectrumAnalyser from '../../../audio/SpectrumAnalyser'
import BaseItem from './BaseItem'

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export default class JSNationSpectrum extends BaseItem {
    constructor(info)  {
        super();
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        
        this.size = 512;
        this.canvas.width = this.size;
        this.canvas.height = this.size;

        this.resMult = info.height / info.width;


        this.scale = 1.0
        this.tex = new THREE.CanvasTexture(this.canvas);
        this.tex.generateMipmaps = false;
        this.tex.magFilter = THREE.LinearFilter;
        this.tex.minFilter = THREE.LinearFilter;
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2 * this.resMult, 2), new THREE.MeshBasicMaterial({map: this.tex, transparent: true}));
        this.barHeightMultiplier = 6.0;

        this.shadowBlur = 12;
        this.shadowOffsetX = 0; 
        this.shadowOffsetY = 0; 

        this.color = "#ff0000";
        this.shadowAlpha = 0.5;
        this.spectrumAnimation = "phase_1";
        this.spectrumSize  = 63;
        this.resRatio = info.width / info.height;
        this.barWidth = 6;
        this.spectrumSpacing = 2;
        this.blockTopPadding = 50 * this.resRatio;
        this.spectrumWidth = this.spectrumSize * (this.barWidth  + this.spectrumSpacing);
        this.spectrumHeight = 256;

        this.folder = this.setUpGUI(info.gui, "Bars");
        this.analyser = new SpectrumAnalyser(this.folder);
        info.scene.add(this.mesh);

        this.__attribution = {
            showAttribution: true,
            name:"vis.js",
            authors: [
                {
                    name: "caseif", 
                    social1: {type: "website", url: "https://caseif.net/"},
                    social2: {type: "github", url: "https://github.com/caseif"},
                },
                {
                    name: "Incept", 
                    social1: {type: "youtube", url: "https://www.youtube.com/channel/UCS12_l2kLigIPaXjRRmbdNA"},
                    social2: {type: "github", url: "https://github.com/itsIncept"},
                }
            ],
            projectUrl: "https://github.com/caseif/vis.js",
            description: "Monstercat visualizer in Javascript and three.js.",
            license: this.LICENSE.REQUIRE_ATTRIBUTION,
            changeDisclaimer: true,
            imageUrl: "img/templates/Monstercat.png"
        }
    }
    stop = () => {
        this.spectrumAnimation = "phase_1";
    }

    changeEmblemImage = () => {
        this.folder.__root.modalRef.toggleModal(3).then(this.emblem.loadImage);
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);        
        folder.add(this.mesh.position, "x", -2, 2, 0.01);
        folder.add(this.mesh.position, "y", -2, 2, 0.01);
        folder.add(this, "scale", -2, 2).onChange(() => this.mesh.scale.set(this.scale, this.scale, 1));

        folder.addColor(this, "color");
        folder.add(this, "shadowBlur", 0, 100);
        folder.add(this, "shadowAlpha", 0, 1, 0.001);

        folder.add(this, "barHeightMultiplier", 0, 12.0, 0.01);
        folder.add(this, "shadowOffsetX", 0, 100);
        folder.add(this, "shadowOffsetY", 0, 100);
        return folder;
    }

    calcRadius = function(multiplier) {
        let minSize = this.minRadius;
        let maxSize = this.size / 2;
        let scalar = multiplier * (maxSize - minSize) + minSize;
        return scalar / 2;
    }

    update = (time, audioData) => {
        const { spectrumHeight, spectrumWidth, resRatio, spectrumSize, spectrumSpacing, barWidth, blockTopPadding } = this;
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        const array = this.analyser.analyse(audioData.frequencyData);
        const rgb = hexToRgb(this.color);
        this.ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.shadowAlpha})`;
        this.ctx.shadowBlur = this.shadowBlur;
        this.ctx.shadowOffsetX = this.shadowOffsetX;
        this.ctx.shadowOffsetY = this.shadowOffsetY;
        this.ctx.fillStyle = this.color;

        let ratio;
        if (this.spectrumAnimation === "phase_1") {
            ratio = time;

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
            for (var i = 0; i < spectrumSize; i++) {
                var value = array[i] * this.barHeightMultiplier * 0.3;
    
                // Used to smooth transiton between bar & full spectrum (lasts 1 sec)
                if (ratio < 1) {
                    value = value / (1 + 9 - 9 * ratio); 
                }
    
                if (value < 2 * resRatio) {
                    value = 2 * resRatio;
                }
    
                this.ctx.fillRect(i * (barWidth + spectrumSpacing), spectrumHeight - value, barWidth, value, value);
            }
        }
        
        this.tex.needsUpdate = true;
        this.ctx.clearRect(0, spectrumHeight, spectrumWidth, blockTopPadding); 
    }
}