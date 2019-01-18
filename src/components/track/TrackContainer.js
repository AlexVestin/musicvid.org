import React, { PureComponent } from 'react'
import classes from './TrackContainer.module.css'


let formatTime = (seconds) => {
    let m = String(Math.floor((seconds % 3600) / 60));
    let s = String(seconds % 60).split(".")[0];
    const dec = String(seconds).split(".")[1];

    if(m.length === 1)m = "0" + m;
    if(s.length === 1)s = "0" + s;

    let formatted = m + ":" + s;
    if(dec) {
        formatted += "." + dec.substring(0, 2);
    }

    return formatted; 
  }


export default class TrackContainer extends PureComponent {

    constructor() {
        super();

        this.mountRef = React.createRef();
        this.seekRef = React.createRef();
    }

    seek = (e) => {
        if(!this.props.disabled) {
            const ele = this.seekRef.current;
            this.props.seek(((e.clientX - ele.offsetLeft) / ele.clientWidth) * this.props.audioDuration );
        }
    }


    render() {
        
        const ele = this.seekRef.current;
        let seekerWidth = 0;
        if(ele)
            seekerWidth = (this.props.time / this.props.audioDuration) * ele.clientWidth;

        return (
            <div className={classes.container} ref={this.mountRef}>
                <div className={classes.trackContainer}>
                    <div className={classes.controls}>
                        {formatTime(this.props.time)}
                        <div className={classes.buttons}>
                        <button disabled={this.props.disabled} onClick={this.props.play}>play</button>
                        <button disabled={this.props.disabled} onClick={this.props.stop}>stop</button>
                        </div>
                        
                    </div>
                    <div onClick={this.seek} className={classes.seeker} ref={this.seekRef}>
                        <div onClick={this.seek} style={{width: seekerWidth}} className={classes.seekerOverlay}></div>
                    </div>
                </div>
            </div>
        )
  }
}


//{this.props.audioDuration && formatTime(this.props.audioDuration)}

