import React, { PureComponent } from "react";
import Typography from "../../modules/components/Typography";
import LayoutBody from "../../modules/components/LayoutBody";
import classes from "./AudioTheory.module.css";
import Sound from "editor/audio/Sound";
import WaveCanvas from "editor/WaveCanvas";
import { Link } from "react-router-dom";
import freqs from "./freqs.PNG";

export default class AudioTheory extends PureComponent {
    constructor() {
        super();

        this.audioWaveCanvasRef = React.createRef();
        this.canvasOverlayRef = React.createRef();
        this.frequencyCanvasRef = React.createRef();

        this.timeCanvasRef = React.createRef();

        this.fftSize = 16384;
    }

    componentDidMount() {
        const url =
            "https://fysiklabb.s3.eu-west-3.amazonaws.com/evenshorterrev.wav";
        const c = this.audioWaveCanvasRef.current;
        this.audio = new Sound(url, null, console.log);
        this.audio.load().then(() => {
            c.generateAudioWave(this.audio.combinedAudioData);
            this.int = requestAnimationFrame(this.update);

            Object.assign(
                this.canvasOverlayRef.current,
                this.audioWaveCanvasRef.current.dimensions
            );
            Object.assign(
                this.timeCanvasRef.current,
                this.audioWaveCanvasRef.current.dimensions
            );

            Object.assign(
                this.frequencyCanvasRef.current,
                this.audioWaveCanvasRef.current.dimensions
            );
        });
    }

    setfftSize = e => {
        const val = e.target.value;
        this.fftSize = val;
        this.audio.setFFTSize(val);
    };

    play = () => {
        if (!this.playing) {
            this.audio.play();
            this.playing = true;
            this.startTime = performance.now();
        }
    };

    stop = () => {
        this.playing = false;
        this.audio.stop();
        const { width, height } = this.frequencyCanvasRef.current;
        this.frequencyCanvasRef.current
            .getContext("2d")
            .clearRect(0, 0, width, height);
        this.timeCanvasRef.current
            .getContext("2d")
            .clearRect(0, 0, width, height);
        this.canvasOverlayRef.current
            .getContext("2d")
            .clearRect(0, 0, width, height);
    };

    updateWindow = time => {
        if (this.canvasOverlayRef.current) {
            const c = this.canvasOverlayRef.current.getContext("2d");

            const {
                width,
                height
            } = this.audioWaveCanvasRef.current.dimensions;
            c.clearRect(0, 0, width, height);
            c.fillStyle = "red";
            const t = time / this.audio.duration;
            const x = Math.floor(t * width);

            c.fillRect(x, 0, 1, height);

            c.globalAlpha = 0.3;
            const w = Math.floor(
                ((this.fftSize / this.audio.sampleRate) * width) /
                    this.audio.duration
            );
            const halfw = w / 2;
            c.fillStyle = "blue";
            c.fillRect(x - halfw, 0, halfw * 2 + 1, height);
            c.globalAlpha = 1.0;
        }
    };

    updateFreqencyCanvas = (time, audioData) => {
        if (this.frequencyCanvasRef.current) {
            const c = this.frequencyCanvasRef.current.getContext("2d");
            const { width, height } = this.frequencyCanvasRef.current;
            c.clearRect(0, 0, width, height);
            const fd = audioData.frequencyData;

            c.strokeStyle = "black";
            c.fillStyle = "white";

            c.beginPath();
            c.moveTo(0, 0);

            for (var i = 0; i < fd.length; i++) {
                const x = (i / fd.length) * width;
                const y = height - fd[i] - 15;
                c.lineTo(x, y);
                c.moveTo((i / fd.length) * width + 1, 0);
            }

            c.stroke();
            c.fillStyle = "red";
            for (let i = 0; i < 24; i++) {
                const dx = i / 24;
                c.fillText(`${Math.floor(dx * 24)}kHz`, dx * width, height - 5);
            }
            c.fillText(`${fd.length} nr of bins`, width - 100, 10);
        }
    };

    updateTimeCanvas = (time, audioData) => {
        const c = this.timeCanvasRef.current.getContext("2d");
        const { width, height } = this.timeCanvasRef.current;
        c.clearRect(0, 0, width, height);
        const fd = audioData.timeData;

        const halfHeight = height / 2;
        c.strokeStyle = "black";
        c.beginPath();
        c.moveTo(0, halfHeight);

        for (var i = 0; i < fd.length; i++) {
            const x = (i / fd.length) * width;
            const y = fd[i] * 40 + halfHeight;
            c.lineTo(x, y);
        }

        c.stroke();
        c.fillText(`${fd.length} nr of samples`, width - 100, 10);
    };

    update = () => {
        const t = (performance.now() - this.startTime) / 1000;
        if (this.playing && t < this.audio.duration) {
            const data = this.audio.getAudioData(t);
            this.updateWindow(t);
            this.updateTimeCanvas(t, data);
            this.updateFreqencyCanvas(t, data);
        }

        requestAnimationFrame(this.update);
    };

    render() {
        return (
            <LayoutBody margin marginBottom>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}
                >
                    <Link to="/tutorial/audio_analysers">{"< Start"}</Link>
                    <Link to="/tutorial/audio_analysers/impact">
                        Impact Analyser >
                    </Link>
                </div>
                <Typography
                    variant="h3"
                    gutterBottom
                    marked="center"
                    align="center"
                >
                    Theory
                </Typography>

                <Typography
                    style={{ marginTop: 40 }}
                    component="h4"
                    variant="h4"
                >
                    Introduction
                </Typography>

                <Typography>
                    There are two main ways to repesent audio viusally; either
                    using the <b>time</b> or <b>frequency</b> representation.
                    You have probably seen these before, either in a DAW,
                    youtube video or on a stereo.
                    <div
                        style={{
                            marginTop: 30,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-evenly"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}
                        >
                            <video loop autoPlay muted>
                                <source
                                    type="video/mp4"
                                    data-reactid=".0.1.0.0.0"
                                    src="/time.mp4"
                                />
                            </video>
                            <i>Time</i>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}
                        >
                            <video loop autoPlay muted>
                                <source
                                    type="video/mp4"
                                    data-reactid=".0.1.0.0.0"
                                    src="/bars.mp4"
                                />
                            </video>
                            <i>Frequency</i>
                        </div>
                    </div>
                    <div style={{ marginTop: 15 }}>
                        This tutorial will focus on how to transform an audio
                        file to achieve these visualizations, and the settings
                        in the editor that can be used to tweak these
                        transforms.
                    </div>
                </Typography>

                <Typography
                    style={{ marginTop: 15 }}
                    component="h4"
                    variant="h4"
                >
                    Audio basics
                </Typography>

                <div className={classes.container}>
                    <Typography className={classes.item}>
                        An audio file is basically a just a long list of
                        numbers. If you zoom in far enough on an audio file in
                        Audacity you can see the points which represents these
                        numbers. The value of each point is the distance from
                        the line, and values below the line are negative.
                    </Typography>
                    <video
                        controls
                        autoPlay
                        loop=""
                        muted=""
                        data-reactid=".0.1.0.0"
                        className={classes.item}
                    >
                        <source
                            type="video/mp4"
                            data-reactid=".0.1.0.0.0"
                            src="/points.mp4"
                        />
                    </video>

                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                    >
                        These points are called <b>samples</b>. Audio files
                        usually have 44100 or 48000 of these samples per second
                        (48khz or 44.1khz samplerate). Samples of an audio file
                        are in the time domain so to animate the time domain
                        example video shown in the introduction we only need to
                        draw lines between these values, which is what the Audio
                        Wave template does.
                        <br />
                        <br />
                        However, since we only want to draw a small portion of
                        the audio file corresponding to the current playback
                        time the samples we need <b>window</b> the samples.
                    </Typography>

                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                        component="h4"
                        variant="h4"
                    >
                        Windowing
                    </Typography>

                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                    >
                        To extract the samples that are relevent for a specific
                        time in a song we use <b>windowing</b>. The window size
                        (fftSize in the audio settings in the editor) determines
                        how many samples we decide to extract. A bigger window
                        size ensures more samples to analyse and a higher
                        precision in the frequency domain, a smaller window size
                        will have higher precision in the time domain. What this
                        means for animations is that a bigger window size will
                        be able to catch a higher level of detail in a sound,
                        but will not be as reactive as a smaller window. Most
                        animations that want to visualize the spectrum of a
                        sound (Trap Nation Circle Spectrum, Monstercat Bar
                        Visualizer) use a large window size, whereas visualizers
                        that use impact (Electric Noise, The Universe Within)
                        are better off with a small window.
                        <br />
                        <br />
                        <i>
                            A window size of 16384 (and audio sample rate of
                            48khz) corresponds to around 0.31 seconds of audio.
                        </i>
                    </Typography>

                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                        component="h4"
                        variant="h4"
                    >
                        From time to frequency
                    </Typography>

                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                    >
                        To get the frequency data of the audio we need to
                        transform the time data. This is done by using the
                        Fourier transform. The Fourier transform is out of scope
                        for this tutorial, but 3Blue1Brown has a great{" "}
                        <a href="https://www.youtube.com/watch?v=spUNpyF58BY">
                            video
                        </a>{" "}
                        on the subject. We send the windowed audio data to the
                        audio fourier transform and get the frequency data,
                        which is half the size of the window, in return.
                        <br />
                        <br />
                        <img
                            style={{ marginBottom: 15 }}
                            src={freqs}
                            alt="Frequencies"
                        />
                        Above you can see the output of a fourier transform.
                        Here 4096 values, called <b>bins</b> in the editor, are
                        output and drawn. Each bin corresponds to a frequency
                        and has a value of how strong that frequency is.
                        <br />
                        <br />
                        <i>
                            The first bin 0 corresponds to 0Hz and the 100th bin
                            corresponds to 586Hz. (bin/totalNrBins) *
                            maxFrequency.
                        </i>
                    </Typography>

                    <Typography
                        variant="h3"
                        gutterBottom
                        marked="center"
                        align="center"
                        style={{ marginTop: 50 }}
                    >
                        Demo
                    </Typography>

                    <Typography
                        style={{ marginTop: 15, marginBottom: 15 }}
                        className={classes.item}
                    >
                        Below is a demonstration of of how the windowing looks.
                        The red line is the playback time and the blue area is
                        the window containing the samples extracted. In the next
                        part we will go over how to use the frequency data in an
                        impact analyser.
                    </Typography>

                    <div
                        style={{
                            width: "100%",
                            margin: 20,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >
                        <div>
                            <button onClick={this.play}>play</button>
                            <button onClick={this.stop}>stop</button>
                        </div>

                        <div>
                            window size:
                            <select onChange={this.setfftSize}>
                                <option>16384</option>
                                <option>8192</option>
                                <option>4096</option>
                                <option>2048</option>
                            </select>
                        </div>
                    </div>

                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                        component="h6"
                        variant="h6"
                    >
                        Time data
                    </Typography>

                    <div
                        style={{
                            position: "relative",
                            height: 120,
                            width: "100%"
                        }}
                    >
                        <WaveCanvas
                            ref={this.audioWaveCanvasRef}
                            classes={classes}
                        />
                        <canvas
                            ref={this.canvasOverlayRef}
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "absolute"
                            }}
                        />
                    </div>
                </div>

                <Typography
                    style={{ marginTop: 15 }}
                    className={classes.item}
                    component="h6"
                    variant="h6"
                >
                    Windowed Time data
                </Typography>
                <canvas
                    style={{ border: "1px solid gray" }}
                    ref={this.timeCanvasRef}
                />

                <Typography
                    style={{ marginTop: 15 }}
                    className={classes.item}
                    component="h6"
                    variant="h6"
                >
                    Windowed Frequency data
                </Typography>

                <canvas
                    style={{ border: "1px solid gray" }}
                    ref={this.frequencyCanvasRef}
                />

                <Typography
                    style={{ marginTop: 15 }}
                    className={classes.item}
                    component="h4"
                    variant="h4"
                >
                    next
                </Typography>

                <Typography
                    style={{ marginTop: 15, marginBottom: 15 }}
                    className={classes.item}
                >
                    Next is the impact analyser where we use the frequency data
                    to generate an impact value which can be used to animate
                    items.
                    <Link to="/tutorial/audio_analysers/impact">
                        Go to the next tutorial
                    </Link>
                </Typography>
            </LayoutBody>
        );
    }
}
