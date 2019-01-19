import React, { PureComponent } from 'react'
import classes from './App.module.scss';
import Sidebar from './sidebar/ControllerContainer'
import withHeader from './header/Header'
import * as dat from '../dat.gui/src/dat'
import Canvas from './canvas/Canvas'
import TrackContainer from './track/TrackContainer';
import SelectResolutionModal from './modal/initialconfigs/SelectResolutionModal';
import Sound from './sound'
import AnimationManager from './animation/Manager'

class App extends PureComponent {

    constructor() {
        super();
        this.gui = new dat.GUI({ autoPlace: false, width: "100%" });
        this.state = { audioDuration: 0, audioName: "", time: 0, disabled: true, playing: false };
        this.canvasRef = React.createRef();
    }

    componentDidMount = () => {
        this.mountRef = this.canvasRef.current.getMountRef();
        this.update();
    }


    audioReady = (duration) => {
        this.setState({ audioDuration: duration, disabled: false });
        this.animationManager = new AnimationManager(this.gui, this.mountRef, this.configurations.resolution);
    }

    play = () => {
        if(!this.state.playing) {
            this.setState({playing: true});
            this.audio.play(this.state.time);
        }else {
            this.stop();
        }
       
        this.lastUpdate = performance.now();
    }

    stop = () => {
        this.audio.stop();
        this.setState({playing: false, time: 0});
    }

    update = () => {
        
        this.canvasRef.current.begin();
        if(this.state.playing && this.state.time < this.audio.duration) {

            const dt = (performance.now() - this.lastUpdate) / 1000;
            this.setState({time: this.state.time + dt});
            const audioData = this.audio.getAudioData();
            this.animationManager.update(this.state.time + dt, audioData);
        }

        this.lastUpdate = performance.now();
        setTimeout(this.update, 16);
        this.canvasRef.current.end();
    }

    seek = (time) => {
        if(this.state.playing) {
            this.audio.play(time);
        }

        this.setState({time: time});     
        this.lastUpdate = performance.now();   
    }

    onSelect = (configurations) => {
        this.configurations = configurations;
        this.audio = new Sound(configurations.audio, this.audioReady);
        this.canvasRef.current.setSize(configurations.resolution);
    }

    render() {
        const modal = true;
        return (
            <div className={classes.container}>
                {modal && <SelectResolutionModal onSelect={this.onSelect}></SelectResolutionModal>}

                <div className={classes.leftContainer} >
                    <Sidebar gui={this.gui}></Sidebar>
                </div>
                <div className={classes.rightContainer}>
                    <Canvas ref={this.canvasRef}></Canvas>
                    <TrackContainer
                        disabled={this.state.disabled}
                        time={this.state.time}
                        audioDuration={this.state.audioDuration}
                        play={this.play}
                        stop={this.stop}
                        seek={this.seek}
                        playing={this.state.playing}
                    >
                    </TrackContainer>
                </div>
            </div>
        )
    }
}


export default withHeader(App);