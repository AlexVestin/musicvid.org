import React, { PureComponent } from "react";
import classes from "./App.module.scss";
import Sidebar from "./components/sidebar/ControllerContainer";
import withHeader from "./components/header/Header";
import * as dat from "./dat.gui.src";
import Canvas from "./components/canvas/Canvas";
import TrackContainer from "./components/track/TrackContainer";
import ModalContainer from "./components/modal/ModalContainer";
import Sound from "./audio/Sound";
import Exporter from "./export/Exporter";
import license from "./util/License";
import ExportScreen from "./components/Export";
import LinearProgress from "@material-ui/core/LinearProgress";

class App extends PureComponent {
    constructor() {
        super();
        this.gui = new dat.GUI({ autoPlace: false, width: "100%" });
        this.layersFolder = this.gui.addFolder("Layers", false);
        this.audioFolder = this.gui.addFolder("Audio", false);
        this.audioFolder.add(this, "loadNewAudioFile");

        this.hideStats = true;
        this.settingsFolder = this.gui.addFolder("Settings", false);
      
        this.exportFolder = this.gui.addFolder("Export", false);
        this.state = {
            videoLoaded: false,
            audioLoaded: false,
            audioDuration: 0,
            time: 0,
            playing: false,
            loaded: false,
            progress: 0,
            encoding: false,
            doneEncoding: false,
            file: null,
            fileName: ""
        };
       
        this.firstLoad = true;
        this.fastLoad = true;
        this.timeOffset = 0;
        this.lastTime = 0;
        this.lastAudioData = {frequencyData: [], timeData: []};

        this.gui.onChange = (d) => console.log(d);

        this.canvasRef = React.createRef();
        this.modalRef = React.createRef();
        this.audioWaveCanvas = React.createRef();
    }

    loadNewAudioFile = () => {
        this.modalRef.current.toggleModal(1, true).then(this.onSelect);
    };


    componentDidMount = () => {
        if (!this.fastLoad) {
            window.onbeforeunload = function(event) {
                // do stuff here
                event.returnValue =
                    "If you leave this page you will lose your unsaved changes.";
                return "If you leave this page you will lose your unsaved changes.";
            };
        }

        document.body.addEventListener("keyup", e => {
            if(!this.state.encoding) {
                if (e.keyCode === 32) {
                    this.play();
                }
                if (e.keyCode === 90 && e.ctrlKey) {
                    this.gui.undo();
                }
            }
          
        });

        this.gui.modalRef = this.modalRef.current;
        this.gui.canvasMountRef = this.canvasRef.current.getMountRef();

        const url = new URL(window.location.href);
        const template = url.searchParams.get("template") || "EmptyTemplate";
        
        import("./animation/templates/" + template + ".js")
            .then(AnimationManager => {
                this.animationManager = new AnimationManager.default(this.gui);
                this.update();
                this.setState({ videoLoaded: true });
            })
            .then(() => {
                if (this.fastLoad) {
                    this.resolution = { width: 1280, height: 720 };
                    this.canvasRef.current.setSize(this.resolution);
                    this.animationManager.init(this.resolution);
                    
                    const rep = this.loadNewAudio(
                        "https://s3.eu-west-3.amazonaws.com/fysiklabb/3buyfour.wav"
                    );
                    rep.then(this.audioReady);
                } else {
                    this.modalRef.current.toggleModal(0).then(this.onSelect);
                }
            });

        this.settingsFolder
        .add(this, "hideStats")
        .onChange(() => {
            this.canvasRef.current.hideStats(this.hideStats) 
        });
    };

    generateAudioWave = (audioData) => {
        const canvas =this.audioWaveCanvas.current; 
        const ctx = canvas.getContext("2d");
        const nrPointsToDraw = canvas.clientWidth;
        const stepSize = Math.floor(audioData.length / nrPointsToDraw);
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        ctx.strokeStyle ="#000";
        ctx.beginPath();
        const midPoint = canvas.height / 2;
        ctx.moveTo(0, midPoint);
        for(var i = 0; i < audioData.length; i+= stepSize) {
            const x = Math.floor(i / stepSize);
            let sum = 0;

            const ij = 8;
            for(var j = i; j < i + stepSize; j+=ij) { 
                sum += Math.abs(audioData[j]);
            }
            const y = 1 + Math.floor((ij * sum / stepSize) * canvas.height);
            ctx.moveTo(x, midPoint-y);
            ctx.lineTo(x, midPoint+y);
            ctx.moveTo(x+1, midPoint);
        }

        ctx.stroke();
    }

    toggleMuted = () => {
        this.audio.toggleMuted();
    }

    audioReady = duration => {
        if (this.firstLoad) {
            this.audioFolder
                .add(this.audio, "fftSize", [1024, 2048, 4096, 8192, 16384])
                .onChange(() => this.audio.setFFTSize(this.audio.fftSize));
            this.firstLoad = false;
        }
        if(duration > 8*60) {
            this.modalRef.current.toggleModal(10)
        }

        this.generateAudioWave(this.audio.combinedAudioData);

        this.animationManager.setAudio(this.audio);
        this.setState({ audioDuration: duration, audioLoaded: true });
    };

    play = () => {
        if (!this.state.playing) {
            this.setState({ playing: true });
            const t = this.state.time;
            this.audio.play(t);
            this.gui.__time = t;
            this.startTime = performance.now();
        } else {    
            this.timeOffset = this.state.time;
            this.setState({ playing: false });
            this.audio.stop();
        }
    };

    componentWillUnmount() {
        this.stop();
    }

    stop = () => {
        if (this.audio) this.audio.stop();
        if (this.animationManager) this.animationManager.stop();
        this.setState({ playing: false, time: 0 });
        this.timeOffset = 0;
        this.lastTime = 0;
        this.gui.__time = 0;
        this.lastAudioData = {frequencyData: [], timeData: []};
    };


    applyAutomation = (time, audioData) => {
        const root = this.gui.getRoot();
        const automations = Object.keys(root.__automations).map(key => root.__automations[key]);
        automations.forEach(item => {
            item.update(time, audioData);    
        });
    }

    update = () => {
        const disabled = !this.state.audioLoaded || !this.state.videoLoaded;
        if (!disabled && this.canvasRef.current) {
            this.canvasRef.current.begin();
            
            let time, audioData;
            if (this.state.playing && this.state.time < this.audio.duration) {
                time = (performance.now() - this.startTime) / 1000 + this.timeOffset;
                audioData = this.audio.getAudioData(time);
                this.setState({ time });
                this.gui.__time = time;

                this.applyAutomation(time, audioData);
                this.animationManager.update(time, audioData, true);
                this.lastTime = time;
                this.lastAudioData = audioData;
            }else {
                this.animationManager.update(this.lastTime, this.lastAudioData, false);

                if(this.state.time >= this.audio.duration && this.state.playing) {
                    this.play();
                }
            }     
            
            this.canvasRef.current.end();
        }


        if(!this.encoding)
            requestAnimationFrame(this.update);
    };

    encoderDone = (file, fileName) => {
        this.file = file;
        this.setState({doneEncoding: true, fileName: fileName})
    };

    cancelEncoder = () => {
        this.exporter.cancel();
        this.setState({ encoding: false, doneEncoding: false }, () => {
            this.encoding = false;
            this.stop();
            this.exporter = null;
            this.update();
            this.audio.exportFrameIdx = 0;
            
            
            this.canvasRef.current.setSize(this.resolution);
            this.gui.canvasMountRef = this.canvasRef.current.getMountRef();
            this.animationManager.refresh( this.gui.canvasMountRef)
        });
     
    };

    encoderReady = () => {
        this.encoding = true;
        this.stop();

        this.exporter.encode();
        this.setState({ encoding: true });
    };

    onProgress = (current, max) => {
        this.setState({ progress: current / max });
    };

    onAudioProgress = e => {
        this.setState({ progress: e });
    };

    startEncoding = selected => {

        this.checkLicense().then(() => {
            const config = {
                video: {
                    width: this.resolution.width,
                    height: this.resolution.height,
                    fps: selected.fps,
                    bitrate: selected.bitrate,
                    presetIdx: selected.preset
                },
                fileName: selected.fileName,
                animationManager: this.animationManager,
                duration: this.state.audioDuration,
                sound: this.audio,
                gui: this.gui
            };
    
            this.exporter = new Exporter(
                config,
                this.encoderDone,
                this.onProgress
            );

            this.exporter.init(this.encoderReady);
            this.encoding = true; 
        });
    };

    seek = time => {
        this.timeOffset = time;
        this.startTime  = performance.now();
        if (this.state.playing) {
            this.audio.play(time);
        }
        
        this.gui.__time = time;
        this.setState({ time: time });
    };

    loadNewAudio = audio => {
        this.stop();
        this.setState({ audioLoaded: false });
        this.audio = new Sound(audio, this.audioFolder, this.onAudioProgress);
        return this.audio.load();
    };

    onSelect = selected => {
        if (!this.resolution) {
            this.resolution = selected;
            this.modalRef.current.toggleModal(1, true).then(this.onSelect);
            this.canvasRef.current.setSize(this.resolution);
            this.animationManager.init(this.resolution);
            
            return;
        }
        this.usingSampleAudio = selected === "https://s3.eu-west-3.amazonaws.com/fysiklabb/Reverie.mp3";
        this.loadNewAudio(selected).then(this.audioReady);
        
    };

    checkLicense = () => {
        return new Promise((resolve, reject) => {
            const items = this.animationManager.getAllItems();
            this.__items = items;
            let attribFound = false;
            items.forEach(item => {
                if (item.license === license.REQUIRE_ATTRIBUTION) {
                    this.modalRef.current.openLicenseModal(
                        items,
                        this.usingSampleAudio,
                        resolve,
                        reject
                    );
                    attribFound = true;
                }
            });

            if (!attribFound) resolve();
        });
    };
    render() {
        const disabled = !this.state.audioLoaded || !this.state.videoLoaded;
        const { progress, fileName } = this.state;

        return (
            <div className={classes.container}>
                {
                    <ModalContainer
                        ref={this.modalRef}
                        onSelect={this.onSelect}
                        gui={this.gui}
                    />
                }

                {this.state.encoding ? (
                    <ExportScreen
                        encoding={this.state.doneEncoding}
                        cancel={this.cancelEncoder}
                        progress={progress}
                        blobFile={this.file}
                        fileName={fileName}
                        items={this.__items}
                        usingSampleAudio={this.usingSampleAudio}
                    />
                ) : (
                    <React.Fragment>
                        {disabled && (
                            <LinearProgress
                                style={{
                                    position: "absolute",
                                    top: 5,
                                    width: "100%",
                                    opacity: 1 - progress / 2
                                }}
                                color="secondary"
                                variant="determinate"
                                value={progress * 100}
                            />
                        )}

                        <div className={classes.leftContainer}>
                            <Sidebar
                                gui={this.gui}
                                startEncoding={this.startEncoding}
                                checkLicense={this.checkLicense}
                                disabled={disabled}
                                loaded={this.state.videoLoaded}
                                firstLoad={this.firstLoad}
                            />
                            <Canvas ref={this.canvasRef} />
                        </div>
                        <div className={classes.rightContainer}>
                            <TrackContainer
                                disabled={disabled}
                                time={this.state.time}
                                audioDuration={this.state.audioDuration}
                                play={this.play}
                                stop={this.stop}
                                seek={this.seek}
                                playing={this.state.playing}
                                audio={this.audio}
                                canvas={this.audioWaveCanvas}
                                toggleMuted={this.toggleMuted}
                            >
                                <canvas ref={this.audioWaveCanvas} className={classes.audioWaveCanvas}></canvas>
                            </TrackContainer>
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    }
}

export default withHeader(App);
