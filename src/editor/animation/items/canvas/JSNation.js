
import { smooth, toWebAudioForm, getByteSpectrum } from 'editor/audio/analyse_functions'
import { loadImage } from 'editor/util/ImageLoader'
import Emblem from "./Emblem";
import BaseItem from '../BaseItem'

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

    
        this.__setUpFolder();
        this.ctx.shadowBlur = 12;

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

        const moveFolder = folder.addFolder("Movement");
        moveFolder.add(this, "emblemExponential", 0.2, 1.6, 0.00001);
        moveFolder.add(this, "emblemExaggeration", 0.0, 5.0, 0.00001);
        moveFolder.add(this, "minRadius", 10, this.canvas.width / 4);
        moveFolder.add(this, "wave_DURATION", 0, Math.PI * 16);
        moveFolder.add(this, "movementAmount", 0, 12);

        moveFolder.add(this, "maxShakeIntensity", 0, 30);
        moveFolder.add(this, "maxShakeDisplacement", 0, 180);

        const spFolder = folder.addFolder("Spectrum");
        spFolder.add(this, "drawType", ["fill", "stroke"]);
        spFolder.add(this, "lineWidth", 0, 10.0, 1)
        spFolder.add(this, "startBin", 0, 100, 1)
        spFolder.add(this, "keepBins", 10, 300, 1)

        spFolder.add(this, "smoothingPasses", [1,2,3,4,5,6,7,8,9]);
        spFolder.add(this, "smoothingPoints", [1,2,3,4,5,7,8,9]);
        spFolder.add(this, "spectrumHeightScalar",0, 1.0);
        spFolder.add(this, "smoothingTimeConstant", 0, 0.95);
        const colFolder = spFolder.addFolder("colors");
        
        this.colors.forEach( ( color, i) => {
            this["color" + String(i) + "Enabled"] = true;   
            this["color" + String(i)] = color; 
            this["color" + String(i) + "Exponent"] = this.exponents[i];   
            
            colFolder.add(this, "color" + String(i) + "Enabled");
            colFolder.addColor(this, "color" + String(i));
            colFolder.add(this, "color" + String(i) + "Exponent", 0.5, 1.8, 0.000001);
        });

        folder.add(this, "x", -2, 2);
        folder.add(this, "y", -2, 2);
        folder.add(this, "scale", 0.01, 6);

        folder.add(this.ctx, "shadowBlur", 0, 100);
        folder.add(this, "spectrumRotation", 0, Math.PI / 2, 0.00001);
        folder.add(this, "invertSpectrum");

        return this.__addFolder(folder);
    }

    stop = () => {
        this.sumShakeX = 0;
        this.sumShakeY = 0;

    }
    calcRadius = function(multiplier) {
        let minSize = this.minRadius * this.scale;
        let maxSize = this.canvas.width / 4;
        let scalar = multiplier * (maxSize - minSize) + minSize;
        return scalar / 2;
    }

    update = (time, audioData, shouldUpdate = true) => {
        const { width, height } = this.canvas;
        this.ctx.translate(Math.floor(this.x * width / 2) + this.sumShakeX,Math.floor(this.y * height / 2) + this.sumShakeY);

        if(shouldUpdate) {
        
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
            let curRad = this.calcRadius(mult) * this.scale;
            curRad = curRad > this.minRadius * this.scale ? curRad : this.minRadius * this.scale;
            this.spectrumCache.push(spectrum);
    
            
            for (let s = this.maxBufferSize; s >= 0; s--) {
                
                
                if(this["color" + String(s) + "Enabled"]) {
                    const exponent = this["color" + String(s) + "Exponent"];
                    let curSpectrum = this.smooth(this.spectrumCache[Math.max(this.spectrumCache.length - this.delays[s] - 1, 0)], this.smoothMargins[s]);
                    let points = [];
                    const col = this["color" + String(s)]
                    this.ctx.fillStyle = col;
                    this.ctx.strokeStyle = col;
                    this.ctx.shadowColor = col;
        
                    let len = curSpectrum.length;
        
                    const invert = this.invertSpectrum ? -1 : 1; 
                    for (let i = 0; i < len; i++) {
                        let t = Math.PI * (i / (len - 1)) - Math.PI / 2 + this.spectrumRotation;
                        let dropoff  = 1 - Math.pow(i / len, this.exp);
                        let r = curRad + Math.pow(curSpectrum[i] * this.spectrumHeightScalar * 1, exponent) * dropoff;
                        points.push({x: r * Math.cos(t), y: invert * r * Math.sin(t)});
                    }
        
                    this.drawPoints(points);
                }
               
            }

            this.emblem.draw(this.ctx, this.canvas, curRad);
        }
    }


    direction = (cur) => {
        let d =  cur > 0 ? 1 : -1;
        const pull = d * Math.pow(Math.abs(cur), 0.08);
        const dir = pull + Math.random();        
        return dir > 1.0 ? -1 : 1; 
    }

   

    drawPoints = (points) => {
        
        if (points.length === 0) {
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