import SpectrumAnalyser from "../../../../audio/SpectrumAnalyser";
import BaseItem from "../BaseItem";

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

export default class JSNationSpectrum extends BaseItem {
    constructor(info) {
        super();
        this.canvas = info.canvas;
        this.ctx = info.ctx;

        this.barHeightMultiplier = 6.0;
        this.shadowBlur = 12;
        this.shadowOffsetX = 0;
        this.shadowOffsetY = 0;

        this.color = "#ff0000";
        this.shadowAlpha = 0.5;
        this.spectrumAnimation = "phase_1";
        this.spectrumSize = 63;
        this.resRatio = info.width / info.height;
        this.barWidth = Math.floor( ( info.width - (info.width * 0.3) ) / this.spectrumSize);
        this.spectrumSpacing = Math.floor(this.barWidth / 5);
        this.blockTopPadding = 50 * this.resRatio;
        this.spectrumWidth = this.spectrumSize * (this.barWidth + this.spectrumSpacing);
        this.spectrumHeight = info.height;
        this.positionX = 0.5;
        this.positionY = 0.5;

        this.folder = this.setUpGUI(info.gui, "Bars");
        this.analyser = new SpectrumAnalyser(this.folder);

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

    changeEmblemImage = () => {
        this.folder.__root.modalRef.toggleModal(3).then(this.emblem.loadImage);
    };

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);

        folder.addColor(this, "color");

        folder.add(this, "barWidth", 0, 20, 1);
        folder.add(this, "positionX");
        folder.add(this, "positionY");
        folder.add(this, "spectrumSpacing", 0, 10, 1);


        folder.add(this, "shadowBlur", 0, 100);
        folder.add(this, "shadowAlpha", 0, 1, 0.001);

        folder.add(this, "barHeightMultiplier", 0, 12.0, 0.01);
        folder.add(this, "shadowOffsetX", 0, 100);
        folder.add(this, "shadowOffsetY", 0, 100);
        return folder;
    };

    update = (time, audioData) => {
        const {
            spectrumHeight,
            spectrumWidth,
            resRatio,
            spectrumSize,
            spectrumSpacing,
            barWidth,
            blockTopPadding,
            positionX,
            positionY,
        } = this;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const array = this.analyser.analyse(audioData.frequencyData);
        const rgb = hexToRgb(this.color);
        this.ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${
            this.shadowAlpha
        })`;
        this.ctx.shadowBlur = this.shadowBlur;
        this.ctx.shadowOffsetX = this.shadowOffsetX;
        this.ctx.shadowOffsetY = this.shadowOffsetY;
        this.ctx.fillStyle = this.color;


        this.spectrumWidth = this.spectrumSize * (this.barWidth + this.spectrumSpacing);

        let ratio;
        const x = positionX * this.canvas.width - this.spectrumWidth / 2;
        const y = (positionY-1) * this.canvas.height;

        if (this.spectrumAnimation === "phase_1") {
            ratio = time;

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

            if (ratio > 1) {
                this.spectrumAnimation = "phase_2";
            }
        } else if (this.spectrumAnimation === "phase_2") {
            ratio = (time - 1.0) / 2.0;

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
