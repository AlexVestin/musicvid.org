import React, { PureComponent } from 'react'
import classes from './App.module.scss';
import Sidebar from './components/sidebar/ControllerContainer'
import withHeader from './components/header/Header'
import * as dat from './dat.gui.src'
import Canvas from './components/canvas/Canvas'
import TrackContainer from './components/track/TrackContainer';
import ModalContainer from './components/modal/initialconfigs/SelectResolutionModal';
import Sound from './audio/Sound'
import Exporter from './export/Exporter'
import license from './util/License'
import ExportScreen from './components/Export'
import LinearProgress from "@material-ui/core/LinearProgress";


class App extends PureComponent {

    constructor() {
        super();
        this.gui = new dat.GUI({ autoPlace: false, width: "100%" });
        this.layersFolder       = this.gui.addFolder("Layers", false);
        this.overviewFolder     = this.gui.addFolder("Overview", false);
        this.audioFolder        = this.gui.addFolder("Audio", false);
        this.audioFolder.add(this, "loadNewAudioFile");
        
        this.hideStats = true;
        this.settingsFolder     = this.gui.addFolder("Settings", false);
        this.settingsFolder.add(this, "hideStats").onChange(() => this.canvasRef.current.hideStats(this.hideStats))
        this.exportFolder       = this.gui.addFolder("Export", false);       
        this.state = { 
            videoLoaded: false,
            audioLoaded: false,
            audioDuration: 0, 
            audioName: "", 
            time: 0, 
            disabled: true, 
            playing: false, 
            loaded: false, 
            encoding: false, 
            progress: 0 
        };
        this.canvasRef = React.createRef();
        this.modalRef = React.createRef();

        this.firstLoad = true;
        this.fastLoad = false;
        this.pauseTime = 0;
    }

    loadNewAudioFile = () =>  {
        this.modalRef.current.toggleModal(1, true).then(this.onSelect); 
    }

    componentDidMount = () => {


        this.mountRef = this.canvasRef.current.getMountRef();
        this.gui.modalRef = this.modalRef.current;
        this.gui.canvasMountRef = this.mountRef;

        const url = new URL(window.location.href);
        const template = url.searchParams.get("template");
        import("./animation/templates/" + template + ".js").then(AnimationManager => {
            this.animationManager = new AnimationManager.default(this.gui);
            this.update();
            this.setState({videoLoaded: true});
        }).then(() => {
            if(this.fastLoad) {
                this.resolution = {width: 1280, height: 720};
                this.animationManager.init(this.resolution);
                this.canvasRef.current.setSize(this.resolution);
                const rep = this.loadNewAudio("https://s3.eu-west-3.amazonaws.com/fysiklabb/Syn+Cole+-+Miami+82+(Lucas+Silow+Remix).mp3");
                rep.then( this.audioReady );
            }else {
                this.modalRef.current.toggleModal(0).then(this.onSelect);
            }
        });

        
    }


    audioReady = (duration) => {
        if(this.firstLoad) {
            this.audioFolder.add(this.audio, "fftSize", [1024, 2048, 4096, 8192, 16384]).onChange(() => this.audio.setFFTSize(this.audio.fftSize))
            this.firstLoad = false;
        }

        this.animationManager.setAudio(this.audio);
        this.setState({ audioDuration: duration, audioLoaded: true });
    }

    play = () => {
        if(!this.state.playing) {
            this.setState({playing: true});
            const t = this.state.time + this.pauseTime;
            this.audio.play(t);
            this.startTime =  performance.now() - (this.pauseTime * 1000);
        }else {
            this.setState({playing: false});
            this.pauseTime =  (performance.now() - this.startTime) / 1000;
            this.audio.stop();
        }
    }

    stop = () => {
        if(this.audio)
            this.audio.stop();

        if(this.animationManager)
            this.animationManager.stop();
        this.setState({playing: false, time: 0});
        this.pauseTime = 0;
    }

    update = () => {
        if(!this.encoding ) {
            this.canvasRef.current.begin();
            if(this.state.playing && this.state.time < this.audio.duration) {
                const time = (performance.now() - this.startTime) / 1000;
                this.setState({time});
                const audioData = this.audio.getAudioData(time);
                this.animationManager.update(time, audioData);
            }

            requestAnimationFrame(this.update);
            this.canvasRef.current.end();
        } 
    }

    encoderDone = () => {
        this.encoding = false;
        requestAnimationFrame(this.update);
    }

    encoderReady = () => {
        this.encoding = true;
        this.stop();
        this.exporter.encode();
        this.setState({encoding: true});
    }

    onProgress = (current, max) => {
        this.setState({progress: current/max})
    }

    onAudioProgress = (e) => {
        this.setState({progress: e});

    }
    startEncoding = (selected) => {
        const config = {
            video: {
                width: this.resolution.width,
                height: this.resolution.height,
                fps: selected.fps,
                bitrate: selected.bitrate,
                preset: selected.preset
            },
            fileName: selected.fileName,
            animationManager: this.animationManager,
            duration: this.state.audioDuration,
            sound: this.audio
        }
      
        this.exporter = new Exporter(config, this.encoderReady, this.encoderDone, this.onProgress);
        this.encoding = true;
       
    }

    seek = (time) => {
        if(this.state.playing) {
            this.audio.play(time);
        }

        this.startTime =  performance.now() -(time*1000);
        this.setState({time: time});     
    }

    loadNewAudio = (audio) => {
        this.stop();
        this.setState({ audioLoaded: false});
        this.audio = new Sound(audio, this.audioFolder, this.onAudioProgress);
        return this.audio.load();
    }

    onSelect = (selected) => {
        if(!this.resolution) {
            this.resolution = selected;
            this.modalRef.current.toggleModal(1, true).then(this.onSelect); 
            this.animationManager.init(this.resolution);
            this.canvasRef.current.setSize(this.resolution);
            return;
        }
        this.loadNewAudio(selected).then(this.audioReady);
    }

    checkLicense = () => {
        return new Promise((resolve, reject) => {
            const items = this.animationManager.getAllItems();
            this.__items = items;
            let attribFound = false;
            items.forEach(item => {
                if(item.license === license.REQUIRE_ATTRIBUTION) {
                    this.modalRef.current.openLicenseModal(items, resolve, reject);
                    attribFound = true;
                }
            })

            if(!attribFound)
                resolve();  
        })
    }
    render() {
        const disabled = !this.state.audioLoaded || !this.state.videoLoaded; 
        const { progress } = this.state;
        return (
            <div className={classes.container}>
                {<ModalContainer ref={this.modalRef} onSelect={this.onSelect} ></ModalContainer>}

               

                {this.state.encoding ?
                    <ExportScreen progress={progress} items={this.__items}></ExportScreen>
                :
                <React.Fragment>
                    {disabled && <LinearProgress style={{position: "absolute", top:5, width:"100%", opacity: 1-progress/2}} color="secondary" variant="determinate" value={progress * 100} />}

                <div className={classes.leftContainer} >
                    <Sidebar 
                        gui={this.gui} 
                        startEncoding={this.startEncoding}
                        checkLicense={this.checkLicense}
                        disabled={disabled}
                        loaded={this.state.videoLoaded}
                    >
                    </Sidebar>
                    <Canvas ref={this.canvasRef}></Canvas>
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
                    >
                    </TrackContainer>
                </div>
                </React.Fragment>
                }
            </div>
        )
    }
}


export default withHeader(App);