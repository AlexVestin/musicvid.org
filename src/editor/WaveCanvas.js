import React, { PureComponent } from "react";

export default class WaveCanvas extends PureComponent {
    constructor() {
        super();
        this.audioWaveCanvas = React.createRef();
    }

    get dimensions() {
        return {
            width: this.audioWaveCanvas.current.clientWidth,
            height: this.audioWaveCanvas.current.clientHeight
        };
    }

    get width() {
        return this.audioWaveCanvas.current.clientWidth;
    }

    get height() {
        return this.audioWaveCanvas.current.clientWidth;
    }

    generateAudioWave = (audioData) => {
        const canvas = this.audioWaveCanvas.current;
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        const halfHeight = canvas.height / 2;
        ctx.moveTo(0, halfHeight);
        for (var i = 0; i < audioData.length; i++) {
            const x = i;
            const y = 1 + Math.floor(Math.abs(audioData[i]) * canvas.height);
            ctx.moveTo(x, halfHeight - y);
            ctx.lineTo(x, halfHeight + y);
            ctx.moveTo(x + 1, halfHeight);
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
