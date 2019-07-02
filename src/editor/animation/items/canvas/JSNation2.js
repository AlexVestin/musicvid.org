
import { smooth, toWebAudioForm, getByteSpectrum } from 'editor/audio/analyse_functions'
import { loadImage } from 'editor/util/ImageLoader'
import Emblem from "./Emblem";
import BaseItem from '../BaseItem'
import { addCanvasControls } from './CanvasControls';

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
        this.emblem = new Emblem("./img/mvlogo.png");   
        this.previousPoints = [];
        this.prevRad = this.minRadius;
    
        this.setUpFolder();

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

        this.resetPoints();
    }

    changeEmblemImage = () => {
        loadImage(this.folder.__root.modalRef, (img) => this.emblem.image = img);

    }


    shake = (multiplier) => {
        let step = this.maxShakeIntensity * multiplier;
        this.waveFrameX += step * this.waveSpeedX;

        if(multiplier === 0) {
            if(Math.abs(this.sumShakeX) > this.displacementThreshold) {
                const l = this.sumShakeX > 0 ? -1 : 1;
                this.sumShakeX += this.returnSpeed * l;
            }if (Math.abs(this.sumShakeY) > 0) {
                const l = this.sumShakeY > 0 ? -1 : 1;
                this.sumShakeY += this.returnSpeed * l;
            }
        } 
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
        this.canvasSettings = addCanvasControls(this, this.ctx, folder, {text: false });     
        this.canvasSettings.shadowBlur = 18;
        const emFolder = folder.addFolder("Emblem");

        this.addController(emFolder, this.emblem, "visible", {path: "emblem"});
        this.addController(emFolder, this.emblem, "alpha", {path: "emblem", min: 0, max: 1});
        this.addController(emFolder, this, "changeEmblemImage", {path: "emblem"});
        this.addController(emFolder, this.emblem, "shouldClipImageToCircle", {path: "emblem"});
        this.addController(emFolder, this.emblem, "emblemSizeScale", {path: "emblem", min: 0.0, max: 4.0});
        this.addController(emFolder, this.emblem, "shouldFillCircle", {path: "emblem"});
        this.addController(emFolder, this.emblem, "circleFillColor", {path: "emblem"});
        this.addController(emFolder, this.emblem, "circleSizeScale", {path: "emblem", min: 0, max: 2.0});

        const moveFolder = folder.addFolder("Movement");
        this.addController(moveFolder, this, "emblemExponential", {min: 0.2, max: 1.6, step: 0.00001})
        this.addController(moveFolder, this, "emblemExaggeration", {min: 0.2, max: 5, step: 0.00001})
        this.addController(moveFolder, this, "minRadius", {min: 10, max: this.canvas.width / 4})
        this.addController(moveFolder, this, "returnSpeed", {min: 0, max: 10});
        this.addController(moveFolder, this, "displacementThreshold", {min: 0, max: 10});
        this.addController(moveFolder, this, "wave_DURATION", {min: 0, max: Math.PI * 16})
        this.addController(moveFolder, this, "movementAmount", {min: 0, max: 12})
        this.addController(moveFolder, this, "maxShakeIntensity", {min: 0, max: 30})
        this.addController(moveFolder, this, "maxShakeDisplacement", {min: 0, max: 180})

        const spFolder = folder.addFolder("Spectrum");
        this.addController(spFolder, this, "alpha", {min: 0.0, max: 1.0});
        this.addController(spFolder, this, "shouldClipSpectrum");
        this.addController(spFolder, this, "clipOffset", {min: 0.0, max: 200, step: 1});
        this.addController(spFolder, this, "drawType", {values: ["fill", "stroke"]});
        this.addController(spFolder, this, "lineWidth", {min: 0, max: 30, step: 1});
        this.addController(spFolder, this, "startBin", {min: 0, max: 1000, step: 1});
        this.addController(spFolder, this, "keepBins", {min: 1, max: 1000, step: 1});
        this.addController(spFolder, this, "smoothingPasses", {values:  [1,2,3,4,5,6,7,8,9]});
        this.addController(spFolder, this, "smoothingPoints", {values:  [1,2,3,4,5,6,7,8,9]});
        this.addController(spFolder, this, "spectrumHeightScalar", {min: 0, max: 1.0});
        this.addController(spFolder, this, "smoothingTimeConstant", {min: 0, max: 0.95});

        const colFolder = spFolder.addFolder("colors");
        
        this.colors.forEach( ( color, i) => {
            this["color" + String(i) + "Enabled"] = true;   
            this["color" + String(i)] = color; 
            this["color" + String(i) + "Exponent"] = this.exponents[i];   
            
            this.addController(colFolder, this, "color" + String(i) + "Enabled");
            this.addController(colFolder, this, "color" + String(i), {color: true});
            this.addController(colFolder, this, "color" + String(i) + "Exponent", {min: 0.5, max: 1.8, step: 0.00001});
        });

        this.addController(folder, this, "x", -2, 2);
        this.addController(folder, this, "y", -2, 2);
        this.addController(folder, this, "scale", 0.01, 6);
        this.addController(folder, this.canvasSettings, "shadowBlur", 0, 100);
        this.addController(folder, this, "spectrumRotation", 0, Math.PI / 2, 0.00001);
        this.addController(folder, this, "invertSpectrum");
        return this.__addFolder(folder);
    }

    resetPoints = () => {
        this.previousPoints = [];
        const invert = this.invertSpectrum ? -1 : 1; 
        for(var i = 0; i < this.colors.length; i++) {
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

    clip = (radius) => {
        const { canvas, ctx } = this;
        ctx.save();
        ctx.globalCompositeOperation="destination-out";
        ctx.beginPath();
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        const offset = this.clipOffset;
        ctx.arc(x, y, radius- offset, 0, Math.PI*2, false); 
        ctx.closePath();
        ctx.fill();
        ctx.restore();

    }

    update = (time, dt, audioData, shouldUpdate = true) => {
        
        const { width, height } = this.canvas;
        this.ctx.translate(Math.floor(this.x * width / 2) + this.sumShakeX, Math.floor(this.y * height / 2) + this.sumShakeY);
        this.canvasSettings.apply(this.ctx);
        let newAudioData = audioData && audioData.frequencyData.length !== 0;
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
        
        
        let oldAlpha = this.ctx.globalAlpha;
        this.ctx.globalAlpha *= this.alpha;

        for (let s = this.maxBufferSize; s >= 0; s--) {            
            if(this["color" + String(s) + "Enabled"]) {
                const exponent = this["color" + String(s) + "Exponent"];
                
                let points = [];
                const col = this["color" + String(s)]
                this.ctx.fillStyle = col;
                this.ctx.strokeStyle = col;
                this.ctx.shadowColor = col;

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
        this.ctx.globalAlpha = oldAlpha;
        this.emblem.draw(this.ctx, this.canvas, curRad);
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

        this.ctx.beginPath();
        let halfWidth = this.canvas.width / 2;
        let halfHeight = this.canvas.height / 2;

        for (let neg = 0; neg <= 1; neg++) {
            let xMult = neg ? -1 : 1;

            this.ctx.moveTo(halfWidth, points[0].y + halfHeight);
            let len = points.length;
            for (let i = 1; i < len - 2; i++) {
                let c = xMult * (points[i].x + points[i + 1].x) / 2 + halfWidth;
                let d = (points[i].y + points[i + 1].y) / 2 + halfHeight;
                this.ctx.quadraticCurveTo(xMult * points[i].x + halfWidth, points[i].y + halfHeight, c, d);
                /*this.ctx.fillStyle = "rgba(255,255,255,1)";
                this.ctx.fillRect(xMult * points[i].x + halfWidth, points[i].y + halfHeight, 10, 10);
                this.ctx.fillStyle = "rgba(0,255,0,1)";
                this.ctx.fillRect(c, d, 10, 10);*/
            }

            const x = xMult * points[len - 2].x + halfWidth + neg * 2;
            const y = points[len - 2].y + halfHeight;
            const c = xMult * points[len - 1].x + halfWidth;
            const d = points[len - 1].y + halfHeight;
            
            this.ctx.quadraticCurveTo(x,y,c,d);
            //this.ctx.arcTo(x, y, halfWidth + xMult*radius, halfHeight, radius);
            //this.ctx.arcTo(halfWidth + xMult*radius, halfHeight, halfWidth, points[0].y + halfHeight, radius);
            if(this.drawType === "fill" && radius - this.clipOffset > 0) 
                this.ctx.arc(halfWidth, halfHeight, radius - this.clipOffset, Math.PI/2, 3*Math.PI/2, xMult > 0)
      
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