
import * as THREE from "three";
import { smooth, toWebAudioForm, getByteSpectrum } from '../../../audio/analyse_functions'
import { loadImage } from '../../../util/ImageLoader'
import Emblem from "./Emblem";
import BaseItem from './BaseItem'

export default class JSNationSpectrum extends BaseItem {
    constructor(info)  {
        super();
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        
        this.size = 1024;
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

        this.spectrumHeightScalar = 0.4;
        this.smoothingTimeConstant = 0.1;
        this.smoothingPasses = 1;
        this.smoothingPoints = 3;
        this.exp = 4
        this.preAmplitude = 1.0;
        this.emblemExaggeration = 1.5;

        this.drawType = "fill";
        this.lineWidth = 2.0;

        this.startBin = 8;
        this.keepBins = 40;
        this.prevArr = [];
        this.minRadius = this.size / 4;

        //SHAKE 
        this.waveSpeedX = 1;
        this.waveSpeedY = 1;
        this.waveFrameX = 0;
        this.waveFrameY = 0;
        this.waveAmplitudeX = 1;
        this.waveAmplitudeY = 1;
        this.trigX = Math.round(Math.random());
        this.trigY = Math.round(Math.random());
        this.wave_DURATION = Math.PI / 8;
        this.maxShakeIntensity = Math.PI / 3;
        this.maxShakeDisplacement = 4;
        this.minShakeScalar = 0.9;
        this.maxShakeScalar = 1.6;
        this.scale = 1.0
        this.tex = new THREE.CanvasTexture(this.canvas);
        this.tex.generateMipmaps = false;
        this.tex.magFilter = THREE.LinearFilter;
        this.tex.minFilter = THREE.LinearFilter;
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2 * this.resMult, 2), new THREE.MeshBasicMaterial({map: this.tex, transparent: true}));
        this.emblem = new Emblem("./img/mvlogo.png");     
        this.folder = this.setUpGUI(info.gui, "JSNation");
        
        this.ctx.shadowBlur = 12;
        info.scene.add(this.mesh);

        this.__attribution = {
            showAttribution: true,
            name:"Trap Nation Viusalizer",
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
            projectUrl: "https://github.com/caseif/js.nation",
            description: "Trap Nation visualizer emulation in JavaScript.",
            license: this.LICENSE.REQUIRE_ATTRIBUTION,
            changeDisclaimer: true,
            imageUrl: "img/templates/JSNation.png"
        }
    }

    changeEmblemImage = () => {
        loadImage(this.folder.__root.modalRef, (img) => this.emblem.image = img);

    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);        
        const emFolder = folder.addFolder("Emblem");
        emFolder.add(this.emblem, "visible")

        emFolder.add(this, "changeEmblemImage")
        emFolder.add(this.emblem, "shouldClipImageToCircle");
        emFolder.add(this.emblem, "emblemSizeScale", 0.0, 2.0);
        emFolder.add(this.emblem, "shouldFillCircle");
        emFolder.addColor(this.emblem, "circleFillColor");
        emFolder.add(this.emblem, "circleSizeScale", 0, 2.0);
        
        emFolder.add(this, "emblemExaggeration", 0.0, 2.50);


        
        const spFolder = folder.addFolder("Spectrum");
        spFolder.add(this, "drawType", ["fill", "stroke"]);
        spFolder.add(this, "lineWidth", 0, 10.0, 1)
        spFolder.add(this, "startBin", 0, 8192*2, 1)
        spFolder.add(this, "keepBins", 0, 8192*2, 1)

        spFolder.add(this, "smoothingPasses", [1,2,3,4,5,6,7,8,9]);
        spFolder.add(this, "smoothingPoints", [1,2,3,4,5,7,8,9]);
        spFolder.add(this, "spectrumHeightScalar",0, 0.5);
        spFolder.add(this, "smoothingTimeConstant", 0, 0.95);
        folder.add(this.mesh.position, "x", -2, 2, 0.01);
        folder.add(this.mesh.position, "y", -2, 2, 0.01);
        folder.add(this, "scale", -2, 2).onChange(() => this.mesh.scale.set(this.scale, this.scale, 1));

        folder.add(this.ctx, "shadowBlur", 0, 100);
        folder.add(this, "exp", 0, 10);
        return folder;
    }

    calcRadius = function(multiplier) {
        let minSize = this.minRadius;
        let maxSize = this.size / 2;
        let scalar = multiplier * (maxSize - minSize) + minSize;
        return scalar / 2;
    }

    update = (time, audioData) => {
        this.ctx.clearRect(0,0, this.size, this.size);
        if (this.spectrumCache.length >= this.maxBufferSize) {
            this.spectrumCache.shift();
        }

        const subSpectrum = audioData.frequencyData.slice(this.startBin, this.startBin + this.keepBins);
        
        const dbfs = toWebAudioForm(subSpectrum, this.prevArr, this.smoothingTimeConstant, audioData.frequencyData.length);
        
        this.prevArr = dbfs;
        const byteSpectrumArray = getByteSpectrum(dbfs, -40, -30);
        const spectrum  = smooth(byteSpectrumArray, this);
        const mult = Math.pow(this.multiplier(spectrum), 0.8) * this.emblemExaggeration;

        this.shake(mult / 32);
        let curRad = this.calcRadius(mult);
        curRad = curRad > this.minRadius ? curRad : this.minRadius;
        this.spectrumCache.push(spectrum);
        
        for (let s = this.maxBufferSize - 1; s >= 0; s--) {
            let curSpectrum = this.smooth(this.spectrumCache[Math.max(this.spectrumCache.length - this.delays[s] - 1, 0)], this.smoothMargins[s]);
            let points = [];

            this.ctx.fillStyle = this.colors[s];
            this.ctx.strokeStyle = this.colors[s];
            this.ctx.shadowColor = this.colors[s];

            let len = curSpectrum.length;
            for (let i = 0; i < len; i++) {
                let t = Math.PI * (i / (len - 1)) - Math.PI / 2;
                let dropoff  = 1 - Math.pow(i / len, this.exp);
                let r = curRad + Math.pow(curSpectrum[i] * this.spectrumHeightScalar * 1, this.exponents[s]) * dropoff;
                points.push({x: r * Math.cos(t), y: r * Math.sin(t)});
            }

            this.drawPoints(points);
        }

        this.emblem.draw(this.ctx, this.canvas, curRad);
        this.mesh.material.map.needsUpdate = true;

    }
    shake = (multiplier) => {
        this.ctx.save();

        let step = this.maxShakeIntensity * multiplier;
        this.waveFrameX += step * this.waveSpeedX;

        if (this.waveFrameX > this.wave_DURATION) {
            this.waveFrameX = 0;
            this.waveAmplitudeX = this.random(this.minShakeScalar, this.maxShakeScalar);
            this.waveSpeedX = this.random(this.minShakeScalar, this.maxShakeScalar) * (Math.random() < 0.5 ? -1 : 1);
            this.trigX = Math.round(Math.random());
        }
        this.waveFrameY += step * this.waveSpeedY;
        if (this.waveFrameY > this.wave_DURATION) {
            this.waveFrameY = 0;
            this.waveAmplitudeY = this.random(this.minShakeScalar, this.maxShakeScalar);
            this.waveSpeedY = this.random(this.minShakeScalar, this.maxShakeScalar) * (Math.random() < 0.5 ? -1 : 1);
            this.trigY = Math.round(Math.random());
        }

        let trigFuncX = this.trigX === 0 ? Math.cos : Math.sin;
        let trigFuncY = this.trigY === 0 ? Math.cos : Math.sin;

        let dx = trigFuncX(this.waveFrameX) * this.maxShakeDisplacement * this.waveAmplitudeX * multiplier;
        let dy = trigFuncY(this.waveFrameY) * this.maxShakeDisplacement * this.waveAmplitudeY * multiplier;

        this.ctx.translate(dx, dy);
    }

    drawPoints = (points) => {
        if (points.length === 0) {
            return;
        }

        
        this.ctx.beginPath();

        let halfWidth = this.size / 2;
        let halfHeight = this.size / 2;

        for (let neg = 0; neg <= 1; neg++) {
            let xMult = neg ? -1 : 1;

            this.ctx.moveTo(halfWidth, points[0].y + halfHeight);

            let len = points.length;
            for (let i = 1; i < len - 2; i++) {
                let c = xMult * (points[i].x + points[i + 1].x) / 2 + halfWidth;
                let d = (points[i].y + points[i + 1].y) / 2 + halfHeight;
                this.ctx.quadraticCurveTo(xMult * points[i].x + halfWidth, points[i].y + halfHeight, c, d);
            }
            this.ctx.quadraticCurveTo(xMult * points[len - 2].x + halfWidth + neg * 2,
                    points[len - 2].y + halfHeight, xMult * points[len - 1].x + halfWidth,
                    points[len - 1].y + halfHeight);
        }

        if(this.drawType === "fill") {
            this.ctx.fill();
        }else {
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.stroke();
        }
        
        
    }

    multiplier = (spectrum) => {
        let sum = 0;
        let len = spectrum.length;
        for (let i = 0; i < len; i++) {
            sum += spectrum[i];
        }
        let intermediate = sum / this.keepBins / 256;
        let transformer = 1.2;
        return (1 / (transformer - 1)) * (-Math.pow(intermediate, transformer) + transformer * intermediate);
    }

    smooth = (points, margin) => {
        if (margin === 0) {
            return points;
        }

        let newArr = [];
        for (let i = 0; i < points.length; i++) {
            let sum = 0;
            let denom = 0;
            for (let j = 0; j <= margin; j++) {
                if (i - j < 0 || i + j > points.length - 1) {
                    break;
                }
                sum += points[i - j] + points[i + j];
                denom += (margin - j + 1) * 2;
            }
            newArr[i] = sum / denom;
        }
        return newArr;
    }

    random = (min, max) => {
        return Math.random() * (max - min) + min;
    }
}