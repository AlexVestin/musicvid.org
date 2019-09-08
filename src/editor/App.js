import React, { PureComponent } from "react";
import classes from "./App.module.scss";
import Sidebar from "./components/sidebar/ControllerContainer";
import withHeader from "./components/header/Header";
import * as dat from "./dat.gui.src";
import Canvas from "./components/canvas/Canvas";
import TrackContainer from "./components/track/TrackContainer";
import ModalContainer from "./components/modal/ModalContainer";
import Sound from "./audio/Sound";
import Exporter from "./export/CopiedExporter";
import ExportScreen from "./components/Export";
import LinearProgress from "@material-ui/core/LinearProgress";
import { base } from "backend/firebase";
import { connect } from "react-redux";
import WaveCanvas from "./WaveCanvas";
import OverviewgGroup from "./OverviewGroup";
import { setFatalError } from "fredux/actions/error";
import { Redirect } from "react-router-dom";

class App extends PureComponent {
    constructor() {
        super();
        this.gui = new dat.GUI({ autoPlace: false, width: "100%" });
        this.overviewFolder = this.gui.addFolder("Overview", { useTitleRow: false });

        this.layersFolder = this.gui.addFolder("Layers", { useTitleRow: false });
        this.audioFolder = this.gui.addFolder("Audio", { useTitleRow: false });
        this.audioFolder.add(this, "loadNewAudioFile");
        this.settingsFolder = this.gui.addFolder("Settings", { useTitleRow: false });
        this.exportFolder = this.gui.addFolder("Export", { useTitleRow: false });
        this.state = {
            shouldLoadProject: false,
            videoLoaded: false,
            audioLoaded: false,
            audioDuration: 0,
            time: 0,
            playing: false,
            loaded: false,
            progress: 0,
            encoding: false,
            doneEncoding: false,
            advanced: true
        };

        this.firstLoad = true;
        this.fastLoad = true;
        this.timeOffset = 0;

        this.trackRef = React.createRef();
        this.canvasRef = React.createRef();
        this.modalRef = React.createRef();
        this.audioWaveCanvasRef = React.createRef();
    }

    addFolderToOverview = () => {
        new OverviewgGroup(this.overviewFolder);
    };

    loadNewAudioFile = () => {
        return this.modalRef.current.toggleModal(1, true).then(this.onSelect);
    };

    keyBindings = (e) => {

        if (e.keyCode === 17) {
            this.ctrlKeyDown = false;
        }

        if (!this.state.encoding && this.state.audioLoaded && this.state.videoLoaded) {

            if (e.ctrlKey || this.ctrlKeyDown) {
                switch(e.keyCode) {
                    // Left key
                    case 37:
                        this.time -= 20;
                        if(this.time < 0)
                            this.time = 0;
                        
                        this.seek(this.time);     
                    break;
                    // right key
                    case 39:
                    this.time += 20;
                    if(this.time < this.state.duration)
                        this.time = this.state.duation;
                    
                    this.seek(this.time);     
                    break;
                    // spacebar
                    case 32:
                        this.stop();
                        break;

                    default:
                        console.log()
                }
            } else if(e.shiftKey) {
                switch(e.keyCode) {
                    // Left key
                    case 37:
                        
                    break;
                    // right key
                    case 39:
                
                    break;
                    // spacebar
                    case 32:
                        this.stop();
                        this.play();
                    break;
                    default:
                        console.log()
                }
            }else {
                switch(e.keyCode) {
                    // Left key
                    case 37:
                        this.time -= 5;
                        if(this.time < 0)
                            this.time = 0;
                        
                        this.seek(this.time);     
                    break;
                    // right key
                    case 39:
                    this.time += 5;
                    if(this.time < this.state.duration)
                        this.time = this.state.duation;
                    
                    this.seek(this.time);     
                    break;
                    // spacebar
                    case 32:
                        this.play();
                    break;
                    default:
                        console.log()
                }
            }
        }
      
    }

    toggleAdvancedMode = advanced => {
        if (advanced) {
            this.addOverviewFolderButton = this.overviewFolder
                .addWithMeta(this, "addFolderToOverview", {}, { first: true })
                .name("Add group")
                .disableAll();
        } else {
            try {
                this.overviewFolder.remove(this.addOverviewFolderButton);
            } catch (err) {
                console.log("Failed to remove folder")
            }
        }

        this.gui.toggleAdvancedMode(advanced);
        this.setState({ advanced });
    };

    async loadProject(uid) {
        let proj;
        try {
            proj = await base
                .collection("projects")
                .doc(uid)
                .get();
        } catch (err) {

            setFatalError({
                code: -1,
                message:
                    "Project doesn't exist or you have insufficient permissions",
                title: "Error fetching project"
            });
            this.setState({ redirectTo: "/error" });
            return;
        }

        return proj;
    }

    clearOverviewFolder = () => {
        const _of = this.gui.__folders["Overview"];

        _of.__controllers.forEach(c => {
            _of.remove(c);
            delete _of.__controllers[c.__id];
        });
        Object.values(_of.__folders).forEach(f => {
            _of.removeFolder(f);
            delete _of.__folders[f.__id];
        });
    };

    initFromProjectFile = projectFile => {
        this.resolution = {
            width: projectFile.width,
            height: projectFile.height
        };
        this.canvasRef.current.setSize(this.resolution);

        this.animationManager.init(this.resolution);
        this.animationManager.loadProject(projectFile);
        this.loadNewAudioFile();
        this.setState({ shouldLoadProject: false });
    };

    async componentWillReceiveProps(props) {
        if (!props.authFetching && this.state.shouldLoadProject) {
            const url = new URL(window.location.href);
            const project = url.searchParams.get("project");
            let projectFile = await this.loadProject(project);
            if (projectFile) {
                this.initFromProjectFile(projectFile.data());
            }
        }
    }

    componentDidMount = async () => {
        window.onkeydown = (e) => {
   

            if (e.keyCode === 17) {
                this.ctrlKeyDown = true;
            }
            // s
            if (e.keyCode === 83 && e.ctrlKey) {
                e.preventDefault();
                this.animationManager.saveProjectToProfile();
            }

            // e
            if (e.keyCode === 69 && e.ctrlKey) {
                e.preventDefault();
                this.animationManager.enableAllControls();
            }
            // r
            if (e.keyCode === 82 && e.ctrlKey) {
                e.preventDefault();
                this.animationManager.disableAllControls();
            }
            // y
            if (e.keyCode === 89 && e.ctrlKey) {
                e.preventDefault();
                this.animationManager.resetAllCameras();
            }
        }

        
        
        window.onkeyup = this.keyBindings;
        
        if (!this.fastLoad) {
            window.onbeforeunload = function(event) {
                // do stuff here
                event.returnValue =
                    "If you leave this page you will lose your unsaved changes.";
                return "If you leave this page you will lose your unsaved changes.";
            };
        }

        this.gui.modalRef = this.modalRef.current;
        this.gui.canvasMountRef = this.canvasRef.current.getMountRef();
        this.gui.canvasContainerRef = this.canvasRef.current.getContainerRef();
        this.gui.toggleFullscreen = this.canvasRef.current.toggleFullscreen;

        const url = new URL(window.location.href);
        const template = url.searchParams.get("template") || "EmptyTemplate";
        const project = url.searchParams.get("project");
        let projectFile;

        window.__onError = this.onExportError;
        import("./animation/templates/" + template + ".js").then(
            async AnimationManager => {
                this.animationManager = new AnimationManager.default(this);
                this.update();
                this.setState({ videoLoaded: true });

                if (project && !this.props.authFetching) {
                    projectFile = await this.loadProject(project);
                    if (projectFile) {
                        this.initFromProjectFile(projectFile.data());
                    }
                } else if (project && this.props.authFetching) {
                    this.setState({ shouldLoadProject: true });
                } else {
                    this.modalRef.current.toggleModal(0).then(this.onSelect);
                }
            }
        );
    };

    onExportError = (code, message) => {
        setFatalError({ code, message });
        this.setState({ redirectTo: "/error" });
    };

    toggleMuted = () => {
        this.audio.toggleMuted();
    };

    setUnmuted = () => {
        this.audio.setUnmuted();
    }

    setFFTSize = () => {
        this.audio.setFFTSize(this.audio.fftSize)
    }

    audioReady = duration => {
        console.log(duration)
        if (this.firstLoad) {
            this.audioFolder
                .add(this.audio, "fftSize", [1024, 2048, 4096, 8192, 16384,32768])
                .onChange(this.setFFTSize);
            this.firstLoad = false;
        }
        if (duration > 8 * 60) {
            this.modalRef.current.toggleModal(10);
        }

        if(this.audioWaveCanvasRef.current) {
            this.audioWaveCanvasRef.current.generateAudioWave(
                this.audio.combinedAudioData
            );
    
            this.animationManager.setAudio(this.audio);
            this.setState({ audioDuration: duration, audioLoaded: true });
        }
       
    };

    play = () => {
        if (!this.state.playing) {
            this.setState({ playing: true });
            const t = this.time;
            this.audio.play(t);
            this.gui.__time = t;
            this.startTime = performance.now();
            if (this.animationManager) this.animationManager.play(t);
        } else {
            this.timeOffset = this.time;
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
        this.time = 0;
        this.setState({ playing: false });
        if (this.trackRef.current) {
            this.trackRef.current.setTime(this.time);
        }

        this.timeOffset = 0;
        this.gui.__time = 0;
    };

    applyAutomation = (time, audioData) => {
        const root = this.gui.getRoot();
        const automations = root.getAutomations();
            
        automations.forEach(item => {
            item.update(time, audioData);
        });
    };

    update = () => {
        const disabled = !this.state.audioLoaded || !this.state.videoLoaded;

        if (!disabled && this.canvasRef.current !== null) {

            let time, audioData;

            if (this.state.playing && this.time < this.audio.duration) {

                
                time =
                    (performance.now() - this.startTime) / 1000 +
                    this.timeOffset;
                audioData = this.audio.getAudioData(time);

                this.trackRef.current.setTime(time);
                //this.setState({ time });
                this.gui.__time = time;
                this.time = time;

                this.applyAutomation(time, audioData);
                this.animationManager.update(time, audioData, true);
            } else {
                this.animationManager.redoUpdate();
                if (this.time >= this.audio.duration && this.state.playing) {
                    this.play();
                }
            }
        }

        if (!this.encoding) requestAnimationFrame(this.update);
    };

    encoderDone = (file, fileName) => {
        this.file = file;
        this.setState({ doneEncoding: true, fileName: fileName });
    };

    cancelEncoder = () => {
        this.exporter.cancel();
        this.animationManager.cancelEncoding();
        this.setState({ encoding: false, doneEncoding: false }, () => {
            this.encoding = false;
            this.stop();
            this.exporter = null;
            this.update();
            this.audio.exportFrameIdx = 0;
            this.canvasRef.current.setSize(this.resolution);
            this.gui.canvasMountRef = this.canvasRef.current.getMountRef();
            
            this.animationManager.refresh(this.gui.canvasMountRef);
            if(this.audioWaveCanvasRef.current) {
                this.audioWaveCanvasRef.current.generateAudioWave(
                    this.audio.combinedAudioData
                );
            }
        });
    };

    encoderReady = () => {
        this.encoding = true;
        this.stop();

        this.exporter.prepare();
        this.animationManager.fps = this.exporter.fps;
        this.animationManager.start();
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
        let duration = this.state.audioDuration;
        if (selected.useCustomTimeRange) {
            if (selected.startTime < 0 || selected.endTime > duration) {
                alert(
                    "Error: Cant before 0 sec or after audio duration length"
                );
                return;
            } else if (selected.startTime >= selected.endTime) {
                alert(
                    "Error: selected start time is bigger or uqual to the end time"
                );
                return;
            }
        }

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
                duration: duration,
                sound: this.audio,
                gui: this.gui,
                startTime: selected.startTime,
                endTime: selected.endTime,
                useCustomTimeRange: selected.useCustomTimeRange
            };

            this.exporter = new Exporter(
                config,
                this.encoderDone,
                this.onProgress
            );

            this.animationManager.prepareEncoding();
            this.exporter.init(this.encoderReady);
            this.encoding = true;
        });
    };

    seek = time => {
        this.timeOffset = time;
        this.startTime = performance.now();
        if (this.state.playing) {
            this.audio.play(time);
        }

        this.animationManager.seekTime(time);
        this.trackRef.current.setTime(time);

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

        this.usingSampleAudio =
            selected ===
            "https://s3.eu-west-3.amazonaws.com/fysiklabb/Reverie.mp3";
        this.loadNewAudio(selected).then(this.audioReady);
    };

    checkLicense = () => {
        return new Promise((resolve, reject) => {
            const items = this.animationManager.getAllItems();
            this.__items = items;

            this.modalRef.current.openLicenseModal(
                items,
                this.usingSampleAudio,
                resolve,
                reject
            );
        });
    };
    render() {
        const disabled = !this.state.audioLoaded || !this.state.videoLoaded;
        const { progress, fileName, redirectTo } = this.state;

        const loadProject = this.animationManager
            ? this.animationManager.loadProject
            : null;

        if (redirectTo) {
            return <Redirect to={redirectTo} />;
        }

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
                    <React.Fragment>
                        <ExportScreen
                            encoding={this.state.doneEncoding}
                            cancel={this.cancelEncoder}
                            progress={progress}
                            blobFile={this.file}
                            fileName={fileName}
                            items={this.__items}
                            usingSampleAudio={this.usingSampleAudio}
                        />
                    </React.Fragment>
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
                                loadProject={loadProject}
                                advanced={this.state.advanced}
                                manager={this.animationManager}
                            />
                            <Canvas ref={this.canvasRef} />
                        </div>
                        <div className={classes.rightContainer}>
                            <TrackContainer
                                disabled={disabled}
                                audioDuration={this.state.audioDuration}
                                play={this.play}
                                stop={this.stop}
                                seek={this.seek}
                                playing={this.state.playing}
                                audio={this.audio}
                                canvas={this.audioWaveCanvas}
                                toggleMuted={this.toggleMuted}
                                setUnmuted={this.setUnmuted}

                                ref={this.trackRef}
                            >
                                <WaveCanvas
                                
                                    ref={this.audioWaveCanvasRef}
                                    classes={classes}
                                />
                            </TrackContainer>
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authFetching: state.auth.fetching
    };
};

export default connect(mapStateToProps)(withHeader(App));
