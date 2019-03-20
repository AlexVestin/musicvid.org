import createCamera from "perspective-camera";
import lerp from "lerp";
import BaseItem from "../BaseItem";

/*
The MIT License (MIT) Copyright (c) 2015 Matt DesLauriers

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          }
        : null;
}

export default class Polartone extends BaseItem {
    constructor(info) {
        super(info);

        this.name = "Polartone";
        // Cant clear the canvas so create internal canvas for this item
        this.aspect = info.height / info.width;
        this.internalCanvas = document.createElement("canvas");
        this.context = this.internalCanvas.getContext("2d");
        this.internalCanvas.width = info.width;
        this.internalCanvas.height = info.height;
        this.externalCtx = info.ctx;

        const shape = [this.internalCanvas.width, this.internalCanvas.height];
        this.camera = createCamera({
            fov: Math.PI / 4,
            near: 0.01,
            far: 100,
            viewport: [0, 0, ...shape]
        });

        this.positions = [];
        this.cursor = [0, 0, 0];
        this.dpr = window.devicePixelRatio;
        this.songDuration = 250;
        this.cameraX = 0;
        this.cameraY = -3.5;
        this.cameraZ = 0;
        this.extent = 0.25;
        this.capacity = 1000;
        this.distance = 0.1;
        this.scale = 1.0;
        this.backgroundColor = "#FFFFFF";
        this.strokeStyle = "#000000";
        this.baseStrokeAlpha = 0.2;
        this.context.globalAlpha = this.baseStrokeAlpha;

        this.context.strokeStyle = "rgb(0,0,0)";
        this.__setUpFolder();

        this.__attribution = {
            showAttribution: true,
            name: "Polartone",
            authors: [
                {
                    name: "mattdesl",
                    social1: {
                        type: "twitter",
                        url: "https://twitter.com/mattdesl"
                    }
                }
            ],
            projectUrl: "https://github.com/mattdesl/Polartone",
            description:
                "Audio visualizer, rendering waveforms in polar coordinates.",
            license: this.LICENSE.MIT,
            changeDisclaimer: true,
            //TODO change image
            imageUrl: "img/templates/Polartone.png"
        };

        this.context.globalAlpha = 1.0;
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(
            0,
            0,
            this.internalCanvas.width,
            this.internalCanvas.height
        );
        this.context.globalAlpha = this.baseStrokeAlpha;
    }

    stop = () => {
        const { width, height } = this.internalCanvas;
        this.context.clearRect(0, 0, width, height);
        this.context.globalAlpha = 1.0;
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(
            0,
            0,
            this.internalCanvas.width,
            this.internalCanvas.height
        );
        this.context.globalAlpha = this.baseStrokeAlpha;
        this.positions = [];
    };

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "songDuration");
        folder
            .add(this, "baseStrokeAlpha", 0, 1.0)
            .onChange(() => (this.context.globalAlpha = this.baseStrokeAlpha));
        folder.add(this, "cameraX");
        folder.add(this, "cameraY");
        folder.add(this, "cameraZ");
        folder.add(this, "extent");
        folder.add(this, "capacity");
        folder.add(this, "distance");
        folder.addColor(this, "strokeStyle");

        folder.addColor(this, "backgroundColor").onChange(this.stop);
        return this.__addFolder(folder);
    };

    update = (time, data) => {
        const dur = time / this.songDuration;

        const audioData = data.timeData;
        const bufferLength = audioData.length;

        this.camera.identity();
        this.camera.translate([0, 3.5, 0]);
        this.camera.lookAt([0, 0, 0]);
        this.camera.update();

        this.context.save();
        this.context.scale(this.dpr, this.dpr);

        let radius = 1 - dur;
        const startAngle = time;
        const alpha = this.baseStrokeAlpha;
        const rgb = hexToRgb(this.strokeStyle);
        this.context.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${
            rgb.b
        }, ${alpha})`;
        this.context.lineWidth = 1;
        this.context.lineJoin = "round";
        this.context.beginPath();
        for (let i = this.positions.length - 1; i >= 0; i--) {
            var pos = this.positions[i];
            this.context.lineTo(pos[0], pos[1]);
        }
        this.context.stroke();
        this.context.restore();

        for (let i = 0; i < bufferLength; i++) {
            const alpha = i / (bufferLength - 1);
            const angle = lerp(startAngle + this.distance, startAngle, alpha);
            this.cursor[0] = Math.cos(angle) * radius;
            this.cursor[2] = Math.sin(angle) * radius;

            const amplitude =
                Math.floor(((audioData[i] + 1) / 2) * 256) / 128.0;
            const waveY = (amplitude * this.extent) / 2;

            const adjusted = [
                this.cursor[0],
                this.cursor[1] + waveY,
                this.cursor[2]
            ];
            const [x, y] = this.camera.project(adjusted);
            if (this.positions.length > this.capacity) {
                this.positions.shift();
            }
            this.positions.push([x, y]);
        }

        this.externalCtx.drawImage(
            this.internalCanvas,
            0,
            0,
            this.internalCanvas.width,
            this.internalCanvas.height
        );
    };
}
