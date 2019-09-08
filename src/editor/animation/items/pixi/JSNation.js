
import SpectrumAnalyser from "../../audio/SpectrumAnalyser";
import { loadImage } from 'editor/animation/util/ImageLoader'
//import Emblem from "./Emblem";
import BaseItem from '../BaseItem'
import *  as PIXI from 'pixi.js';
import { GlowFilter } from 'pixi-filters'
import { smooth, toWebAudioForm, getByteSpectrum } from '../../audio/AnalyseFunctions'

/**
 * My Extension of js.nation
 *
 *  Copyright @caseif https://github.com/caseif/js.nation
 *  @license GPL-3.0
 */

export default class JSNationSpectrum extends BaseItem {
    constructor(info)  {
        super(info);
        this.name = "JSnation";
        this.canvas =info.canvas;
        this.ctx = info.ctx;
        this.x = 0;
        this.y = 0;

        this.spectrumCount = 8;
        this.exponents = [1, 1.12, 1.14, 1.30, 1.33, 1.36, 1.50, 1.52];
        this.smoothMargins = [0, 2, 2, 3, 3, 3, 5, 5];
        this.spectrumCache = [];
        this.delays = [0, 1, 2, 3, 4, 5, 6, 7];
        this.maxBufferSize = Math.max.apply(null, this.delays);
        this.resMult = info.height / info.width;

        this.colors = ["#FFFFFF", "#FFFF00", "#FF0000", "#FF66FF", "#333399", "#0000FF", "#33CCFF", "#00FF00"];
        this.colors.forEach( (color,i) => {
            this[`color${i}Enabled`] = true;
            this[`color${i}Exponent`] = this.exponents[i];
            this[`color${i}`] = color;   
        });

        this.spectrumHeightScalar = 0.31;
        this.smoothingTimeConstant = 0.1;
        this.smoothingPasses = 1;
        this.smoothingPoints = 3;
        this.exp = 4
        this.preAmplitude = 1.0;
        this.emblemExaggeration = 1.5;

        
        this.displacementThreshold = 4;
        this.returnSpeed = 0.1;
        this.clipOffset = 10;
        this.shouldClipSpectrum = false;


        this.drawType = "fill";
        this.lineWidth = 2.0;
        this.alpha = 1.0;
        this.startBin = 8;
        this.keepBins = 40;
        this.prevArr = [];
        this.minRadius = this.canvas.width / 8;
        this.invertSpectrum = false;
        this.spectrumRotation = 0;
        this.scale = 1;
        //SHAKE 
        this.emblemExponential = 0.8;
        this.sumShakeX = 0;
        this.sumShakeY = 0;
        this.movementAmount = 1.0;
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
        this.scale = 1.1;
        this.previousPoints = [];
        this.prevRad = this.minRadius;
    
       
        this.setUpFolder();
        // this.ctx.shadowBlur = 12;

        this.__attribution = {
            showAttribution: true,
            name:"Trap Nation Visualizer",
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

        this.graphics = info.graphics;
        this.container = info.container;
        this.resetPoints();
        this.analyser = new SpectrumAnalyser(this.folder);
        this.analyser.setUpGUI();
        this.container.addChild(this.graphics)
        const filter = new GlowFilter(40, 4, 0, 0xFF0000, 0.5);
        filter.padding = 50;
        this.container.filters = [filter]
    }

    changeEmblemImage = () => {
        loadImage(this.folder.__root.modalRef, (img) => this.emblem.image = img);
    }

    shake = (multiplier) => {

        let step = this.maxShakeIntensity * multiplier;
        this.waveFrameX += step * this.waveSpeedX;
    
        if (Math.abs(this.waveFrameX) > this.wave_DURATION) {
            this.waveFrameX = 0;
            this.waveAmplitudeX = this.random(this.minShakeScalar, this.maxShakeScalar) * this.direction(this.sumShakeX);
            this.waveSpeedX = this.random(this.minShakeScalar, this.maxShakeScalar) * this.direction(this.sumShakeX);
            this.trigX = Math.round(Math.random());
        }
        this.waveFrameY += step * this.waveSpeedY;
        if (Math.abs(this.waveFrameY) > this.wave_DURATION) {
            this.waveFrameY = 0;
            this.waveAmplitudeY = this.random(this.minShakeScalar, this.maxShakeScalar) * this.direction(this.sumShakeY);;
            this.waveSpeedY = this.random(this.minShakeScalar, this.maxShakeScalar) * this.direction(this.sumShakeY);
            this.trigY = Math.round(Math.random());
        }
    
        let trigFuncX = this.trigX === 0 ? Math.cos : Math.sin;
        let trigFuncY = this.trigY === 0 ? Math.cos : Math.sin;
    
        let dx = trigFuncX(this.waveFrameX) * this.maxShakeDisplacement * this.waveAmplitudeX * multiplier * this.movementAmount;
        let dy = trigFuncY(this.waveFrameY) * this.maxShakeDisplacement * this.waveAmplitudeY * multiplier * this.movementAmount;
    
        this.sumShakeX += dx;
        this.sumShakeY += dy;
    }

    __setUpGUI = (folder) => {
     
        return this.__addFolder(folder);
    }

    resetPoints = () => {
        this.previousPoints = [];
        const invert = this.invertSpectrum ? -1 : 1; 
        for(var i = 0; i < 8; i++) {
            const points = [];
            
            for(var j = 0; j < 60; j ++) {
                let t = Math.PI * (j / (60 - 1)) - Math.PI / 2;

                points.push({x: this.scale * this.minRadius * Math.cos(t), y: this.scale * invert * this.minRadius * Math.sin(t)});
            }
            
            this.previousPoints.push(points);
        }
    }

    stop = () => {
        this.sumShakeX = 0;
        this.sumShakeY = 0;
        this.spectrumCache = [];
        this.resetPoints();

    }
    calcRadius = function(multiplier) {
        let minSize = this.minRadius * this.scale;
        let maxSize = this.canvas.width / 4;
        let scalar = multiplier * (maxSize - minSize) + minSize;

        return scalar / 2;
    }

    makePoints  = (curSpectrum, curRad,  exponent) => {
        const invert = this.invertSpectrum ? -1 : 1; 
        let points = [];
        let len = curSpectrum.length;
        for (let i = 0; i < len; i++) {
            let t = Math.PI * (i / (len - 1)) - Math.PI / 2 + this.spectrumRotation;
            let dropoff  = 1 - Math.pow(i / len, this.exp);
            let r = curRad + Math.pow(curSpectrum[i] * this.spectrumHeightScalar * 1, exponent) * dropoff * this.scale;
            points.push({x: r * Math.cos(t), y: invert * r * Math.sin(t)});
        }
        return points;
    }

    update = (time, dt, audioData, shouldUpdate = true) => {
        this.graphics.clear();
        const { width, height } = this.canvas;
        // this.ctx.translate(Math.floor(this.x * width / 2) + this.sumShakeX,Math.floor(this.y * height / 2) + this.sumShakeY);
        let newAudioData = audioData.frequencyData.length !== 0;
        let curRad = this.minRadius * this.scale;
        if(newAudioData && shouldUpdate) {
            if (this.spectrumCache.length >= this.maxBufferSize) {
                this.spectrumCache.shift();
            }

            const subSpectrum = audioData.frequencyData.slice(this.startBin, this.startBin + this.keepBins);
            const dbfs = toWebAudioForm(subSpectrum, this.prevArr, this.smoothingTimeConstant, audioData.frequencyData.length);
    
            this.prevArr = dbfs;
            const byteSpectrumArray = getByteSpectrum(dbfs, -40, -30);
            const spectrum  = smooth(byteSpectrumArray, this);
    
            const mult = Math.pow(this.multiplier(spectrum), this.emblemExponential) * this.emblemExaggeration;
            this.shake(mult / 32);
            curRad = this.calcRadius(mult) * this.scale;
            curRad = curRad > this.minRadius * this.scale ? curRad : this.minRadius * this.scale;
            this.spectrumCache.push(spectrum);
        }

        // let oldAlpha = this.ctx.globalAlpha;
        // this.ctx.globalAlpha *= this.alpha;


        for (let s = this.maxBufferSize; s >= 0; s--) {            
            if(this["color" + String(s) + "Enabled"]) {
                const exponent = this["color" + String(s) + "Exponent"];
                
                let points = [];
                const col = this["color" + String(s)];
                this.graphics.beginFill(0xff0000);
                //this.graphics.lineStyle(2, 0xfff, 1);
                /*this.ctx.fillStyle = col;
                this.ctx.strokeStyle = col;
                this.ctx.shadowColor = col;*/

                let spec = [];
                if(newAudioData && shouldUpdate) {
                    spec = this.spectrumCache[Math.max(this.spectrumCache.length - this.delays[s] - 1, 0)]
                    this.previousPoints[s] =  spec;
                }else {
                    spec = this.previousPoints[s]; 
                }
                const curSpectrum = this.smooth(spec,  this.smoothMargins[s]);
                points = this.makePoints(curSpectrum, curRad, exponent);
                this.drawPoints(points, curRad);
            }
               
        }
        //this.ctx.globalAlpha = oldAlpha;
        //this.emblem.draw(this.ctx, this.canvas, curRad);
        this.prevRad = curRad;
    }


    direction = (cur) => {
        let d =  cur > 0 ? 1 : -1;
        const pull = d * Math.pow(Math.abs(cur), 0.08);
        const dir = pull + Math.random();        
        return dir > 1.0 ? -1 : 1; 
    }

   

    drawPoints = (points, radius) => {
        
        if (!points || points.length === 0) {
            return;
        }
        

        //this.ctx.beginPath();
        let halfWidth = this.canvas.width / 2;
        let halfHeight = this.canvas.height / 2;

        for (let neg = 0; neg <= 1; neg++) {
            let xMult = neg ? -1 : 1;

            this.graphics.moveTo(halfWidth, points[0].y + halfHeight);

            let len = points.length;
            for (let i = 1; i < len - 2; i++) {
                let c = xMult * (points[i].x + points[i + 1].x) / 2 + halfWidth;
                let d = (points[i].y + points[i + 1].y) / 2 + halfHeight;
                this.graphics.quadraticCurveTo(xMult * points[i].x + halfWidth, points[i].y + halfHeight, c, d);
            }
            this.graphics.quadraticCurveTo(xMult * points[len - 2].x + halfWidth + neg * 2,
                    points[len - 2].y + halfHeight, xMult * points[len - 1].x + halfWidth,
                    points[len - 1].y + halfHeight);

            if(this.drawType === "fill" && radius - 5 > 0)  {
                this.graphics.arc(halfWidth, halfHeight, radius - 5, Math.PI/2, 3*Math.PI/2, xMult > 0)
            }
                
        }

        if(this.drawType === "fill") {
            this.graphics.endFill();
        }else {
            // this.ctx.lineWidth = this.lineWidth;
            // this.ctx.stroke();
        }
        
        
    }

    multiplier = (spectrum) => {
        let sum = 0;
        let len = spectrum.length;
        for (let i = 0; i < len; i++) {
            sum += spectrum[i];
        }
        let intermediate = sum / spectrum.length / 256;
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