
import SpectrumAnalyser from '../audio/analyser'
import * as THREE from "three";

import { smooth, smoothDropoff, toDBFS } from '../audio/analyse_functions'

export default class JSNationSpectrum {
    constructor(info)  {
        this.folder = info.gui.addFolder("JSNationSpectrum");
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

        this.spectrumHeightScalar = 0.4;
        this.dropoffAmount = 0.1;
        this.smoothingPasses = 1;
        this.smoothingPoints = 3;
        this.exp = 4
        this.preAmplitude = 1.0;
        this.folder.add(this, "preAmplitude");
        this.folder.add(this, "dropoffAmount");
        this.folder.add(this, "spectrumHeightScalar");
        this.folder.add(this, "smoothingPasses");
        this.folder.add(this, "smoothingPoints");
        this.folder.add(this.ctx, "shadowBlur");
        this.folder.add(this, "exp");

        this.tex = new THREE.CanvasTexture(this.canvas);
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2 * this.resMult, 2), new THREE.MeshBasicMaterial({map: this.tex, transparent: true}));
        info.scene.add(this.mesh);
    }

    update = (time, audioData) => {
        
        this.ctx.clearRect(0,0, this.size, this.size);
        if (this.spectrumCache.length >= this.maxBufferSize) {
            
            this.spectrumCache.shift();
        }

        const subSpectrum = audioData.frequencyData.slice(8, 40);

        const dbfs = toDBFS(subSpectrum.map(e => e * this.preAmplitude), audioData.frequencyData.length, -40, -30);
        const dropped = smoothDropoff(dbfs, this);
        this.prevArr = dropped;
        const spectrum = smooth(dropped, this);
        
        this.spectrumCache.push(spectrum);

        //let curRad = Emblem.calcRadius(multiplier);
        let curRad = this.size / 4;

        for (let s = this.maxBufferSize - 1; s >= 0; s--) {
            let curSpectrum = this.smooth(this.spectrumCache[Math.max(this.spectrumCache.length - this.delays[s] - 1, 0)], this.smoothMargins[s]);
            let points = [];

            this.ctx.fillStyle = this.colors[s];
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

        this.mesh.material.map.needsUpdate = true;
    }


    drawPoints = (points) => {
        if (points.length == 0) {
            return;
        }

        //this.ctx.fillRect(100, 100, 200, 200);

        
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
        this.ctx.fill();
        
    }

    smooth = (points, margin) => {
        if (margin == 0) {
            return points;
        }

        let newArr = Array();
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
}