import React, { PureComponent } from "react";
import classes from "./TrackContainer.module.scss";
import PlayButton from "./playbutton/PlayButton";

import playimg from "./playbutton/2x/play.png";
import pauseimg from "./playbutton/2x/pause.png";
import volumeimg from "./playbutton/2x/volume.png";

import stopimg from "./playbutton/2x/stop.png";
import Slider from "./slider/Slider";

let formatTime = seconds => {
    let m = String(Math.floor((seconds % 3600) / 60));
    let s = String(seconds % 60).split(".")[0];
    const dec = String(seconds).split(".")[1];

    if (m.length === 1) m = "0" + m;
    if (s.length === 1) s = "0" + s;

    let formatted = m + ":" + s;
    if (dec) {
        formatted += "." + dec.substring(0, 2);
    }

    if (formatted.length === 5) formatted += ".00";

    return formatted;
};

export default class TrackContainer extends PureComponent {
    constructor() {
        super();
        this.state = { muted: false };
        this.mountRef = React.createRef();
        this.seekRef = React.createRef();


        this.timeRef = React.createRef(); 
        this.seekOverlayRef = React.createRef();
    }

    seek = e => {
        if (!this.props.disabled) {
            const ele = this.seekRef.current;
            this.props.seek(
                ((e.clientX - ele.offsetLeft) / ele.clientWidth) *
                    this.props.audioDuration
            );
        }
    };

    setTime = time => {
        const ele = this.seekRef.current;
        let t = time ? time : 0;
        const seekerWidth = (t / this.props.audioDuration) * ele.clientWidth || 0;
        this.timeRef.current.innerHTML = formatTime(t);
        this.seekOverlayRef.current.style.width = String(Math.floor(seekerWidth)) + "px" ;
    };

    toggleMuted = () => {
        this.props.toggleMuted();
        this.setState({ muted: !this.state.muted });
    };

    render() {

        return (
            <div className={classes.container} ref={this.mountRef}>
                <div className={classes.trackContainer}>
                    <div className={classes.controls}>
                        <div className={classes.buttons}>
                            <PlayButton
                                img={this.props.playing ? pauseimg : playimg}
                                disabled={this.props.disabled}
                                onClick={this.props.play}
                            />
                            <PlayButton
                                img={stopimg}
                                disabled={this.props.disabled}
                                onClick={this.props.stop}
                            />
                        </div>

                        <div className={classes.timeDisplay} ref={this.timeRef}>
                            {formatTime(0)}
                        </div>
                    </div>
                    <div
                        onClick={this.seek}
                        className={classes.seeker}
                        ref={this.seekRef}
                    >
                        <div
                            onClick={this.seek}
                            className={classes.seekerOverlay}
                            ref={this.seekOverlayRef}
                        />
                        {this.props.children}
                    </div>

                    <div className={classes.volumeContainer}>
                        {this.state.muted && (
                            <svg
                                style={{
                                    width: 20,
                                    height: 20,
                                    position: "absolute",
                                    pointerEvents: "none"
                                }}
                                viewBox="0 0 100 100"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <line
                                    x1="0"
                                    y1="80"
                                    x2="100"
                                    y2="20"
                                    stroke="red"
                                    stroke-width="10"
                                />
                            </svg>
                        )}
                        <img
                            onClick={this.toggleMuted}
                            style={{ cursor: "pointer", width: 20, height: 20 }}
                            src={volumeimg}
                            alt="volume"
                        />
                        <Slider
                            disabled={this.props.disabled}
                            audio={this.props.audio}
                            style={{ marginLeft: 10 }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

//{this.props.audioDuration && formatTime(this.props.audioDuration)}
