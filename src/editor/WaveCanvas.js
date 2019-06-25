import React, { PureComponent } from "react";

export default class WaveCanvas extends PureComponent {
    constructor() {
        super();
        this.audioWaveCanvas = React.createRef();
    }

    get dimensions() {
        return {width: this.audioWaveCanvas.current.clientWidth, height: this.audioWaveCanvas.current.clientHeight};
    }

    get width() {
        return this.audioWaveCanvas.current.clientWidth;
    }

    get height() {
        return this.audioWaveCanvas.current.clientWidth;
    }

    generateAudioWave = audioData => {
        const canvas = this.audioWaveCanvas.current;
        const ctx = canvas.getContext("2d");
        const nrPointsToDraw = canvas.clientWidth;
        const stepSize = Math.floor(audioData.length / nrPointsToDraw);
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        const midPoint = canvas.height / 2;
        ctx.moveTo(0, midPoint);
        for (var i = 0; i < audioData.length; i += stepSize) {
            const x = Math.floor(i / stepSize);
            let sum = 0;

            const ij = 8;
            for (var j = i; j < i + stepSize; j += ij) {
                sum += Math.abs(audioData[j]);
            }
            const y = 1 + Math.floor(((ij * sum) / stepSize) * canvas.height);
            ctx.moveTo(x, midPoint - y);
            ctx.lineTo(x, midPoint + y);
            ctx.moveTo(x + 1, midPoint);
        }

        ctx.stroke();
    };

    render() {
        return (
            <canvas
                ref={this.audioWaveCanvas}
                className={this.props.classes.audioWaveCanvas}
            />
        );
    }
}
