import SpectrumAnalyser from "../../audio/SpectrumAnalyser";
import BaseItem from "../BaseItem";


/**
 * My Extension of vis.js
 *
 *  Copyright @caseif https://github.com/caseif/vis.js
 *  @license BSD-new (New BSD License)
 */

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

export default class MonsterCat extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Bars";
        this.canvas = info.canvas;
        this.ctx = info.ctx;

        this.barHeightMultiplier = 6.0;
        this.shadowBlur = 12;
        this.shadowOffsetX = 0;
        this.shadowOffsetY = 0;
        this.invertHorizontal = false;
        this.invertVertical = false;


        this.color = "#ff0000";
        this.shadowAlpha = 0.5;
        this.spectrumAnimation = "phase_1";
        this.barsToDraw = 64;
        this.resRatio = info.width / info.height;
        this.barWidth = Math.floor( ( info.width - (info.width * 0.3) ) / this.barsToDraw);
        this.spectrumSpacing = Math.floor(this.barWidth / 5);
        this.blockTopPadding = 50 * this.resRatio;
        this.spectrumWidth = this.barsToDraw * (this.barWidth + this.spectrumSpacing);
        this.spectrumHeight = info.height;
        this.positionX = 0.5;
        this.positionY = 0.5;
        this.animTime = 0.5;
        this.analyser = new SpectrumAnalyser(this.folder, this);
        this.test1 = 0;
        this.test2 = 0;
        this.setUpFolder();
        this.analyser.setUpGUI();
        this.lastArray = [];

        this.__attribution = {
            showAttribution: true,
            name: "vis.js",
            authors: [
                {
                    name: "caseif",
                    social1: { type: "website", url: "https://caseif.net/" },
                    social2: {
                        type: "github",
                        url: "https://github.com/caseif"
                    }
                },
                {
                    name: "Incept",
                    social1: {
                        type: "youtube",
                        url:
                            "https://www.youtube.com/channel/UCS12_l2kLigIPaXjRRmbdNA"
                    },
                    social2: {
                        type: "github",
                        url: "https://github.com/itsIncept"
                    }
                }
            ],
            projectUrl: "https://github.com/caseif/vis.js",
            description: "Monstercat visualizer in Javascript and three.js.",
            license: this.LICENSE.REQUIRE_ATTRIBUTION,
            changeDisclaimer: true,
            imageUrl: "img/templates/Monstercat.png"
        };
    }
    stop = () => {
        this.spectrumAnimation = "phase_1";
    };


    __setUpGUI = (folder) => {
        this.addController(folder, this, "color", {color: true});
        this.addController(folder,this, "barsToDraw", 0, 1000, 1);
        this.addController(folder,this.analyser, "spectrumSize", 0, 1000, 1).onChange(this.analyser.folder.updateDisplay());
        this.addController(folder,this, "invertHorizontal");
        this.addController(folder,this, "invertVertical");
        this.addController(folder,this, "animTime", 0, 10);
        this.addController(folder,this, "barWidth", 0, 20, 1);
        this.addController(folder,this, "positionX");
        this.addController(folder,this, "positionY");
        this.addController(folder,this, "spectrumSpacing", 0, 10, 1);
        this.addController(folder,this, "shadowBlur", 0, 100);
        this.addController(folder,this, "shadowAlpha", 0, 1, 0.001);
        this.addController(folder,this, "barHeightMultiplier", 0, 25.0, 0.01);
        this.addController(folder,this, "shadowOffsetX", -300, 300);
        this.addController(folder,this, "shadowOffsetY", -300, 300);
        
        return this.__addFolder(folder);
    };

    update = (time, dt, audioData, shouldIncrement) => {
        const {
            spectrumHeight,
            spectrumWidth,
            resRatio,
            spectrumSpacing,
            barWidth,
            positionX,
            positionY,
            barsToDraw,
        } = this;

        let spectrumSize = barsToDraw;
        if (barsToDraw > this.analyser.spectrumSize) {
            spectrumSize = this.analyser.spectrumSize;
        }

        let array; 
        if(shouldIncrement) {
            array = this.analyser.analyse(audioData.frequencyData);
            this.lastArray = array;
        }else {
            array = this.lastArray;
        }
        
        const rgb = hexToRgb(this.color);
        this.ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${
            this.shadowAlpha
        })`;
        this.ctx.shadowBlur = this.shadowBlur;
        this.ctx.shadowOffsetX = this.shadowOffsetX;
        this.ctx.shadowOffsetY = this.shadowOffsetY;
        this.ctx.fillStyle = this.color;
        this.spectrumWidth = spectrumSize * (this.barWidth + this.spectrumSpacing);
        let ratio;
        const x = positionX * this.canvas.width - this.spectrumWidth / 2;
        const y = (positionY-1) * this.canvas.height;

        if (this.invertHorizontal) {
            array = array.reverse();
        }

        if (this.spectrumAnimation === "phase_1") {
            ratio = time * 2;

            this.ctx.fillRect(
                x,
                spectrumHeight - 2 * resRatio + y,
                (spectrumWidth / 2) * ratio,
                2 * resRatio
            );
            this.ctx.fillRect(
                x + spectrumWidth - (spectrumWidth / 2) * ratio,
                spectrumHeight - 2 * resRatio + y,
                (spectrumWidth / 2) * ratio,
                2 * resRatio
            );

            if (ratio > this.animTime) {
                this.spectrumAnimation = "phase_2";
            }
        } else if (this.spectrumAnimation === "phase_2") {
            ratio = (time - this.animTime) / (this.animTime * 2);

            this.ctx.globalAlpha = Math.abs(Math.cos(ratio * 10));

            this.ctx.fillRect(
                x,
                spectrumHeight - 2 * resRatio +y,
                spectrumWidth,
                2 * resRatio
            );

            this.ctx.globalAlpha = 1;

            if (ratio > 1) {
                this.spectrumAnimation = "phase_3";
            }
        } else if (this.spectrumAnimation === "phase_3") {
            ratio = (time - (this.amimTime * 2)) / (this.animTime * 2);

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

                if (this.invertVertical) {
                    value = -value;
                }

                this.ctx.fillRect(
                    x  + i * (barWidth + spectrumSpacing),
                    spectrumHeight - value + y,
                    barWidth,
                    value,
                );
            }
        }

        //this.ctx.clearRect(0, spectrumHeight, spectrumWidth, blockTopPadding);
    };
}
