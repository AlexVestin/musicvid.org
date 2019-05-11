import React, { PureComponent } from "react";
import Typography from "@material-ui/core/Typography";

export default class Point extends PureComponent {
    constructor(props) {
        super(props);

        this.state = { value: props.point.value, time: props.point.time };
    }

    remove = () => {
        this.props.removePoint(this.props.point.id);
    }

    changeValue = e => {
        const val = e.target.value;
        this.setState({ value: val });
        this.props.point.value = Number(val);
    };

    changeTime = e => {
        const val = e.target.value;
        this.setState({ time: val });
        this.props.point.time = Number(val);
    };
    render() {
        return (
            <div style={{height: 30, borderBottom: "1px solid gray"}}>
                <Typography>
                    Time:{" "}
                    <input style={{width: 50, marginRight: 10, marginLeft: 3}} value={this.state.time} onChange={this.changeTime}>
                    </input>
                    Val:{" "}
                    <input style={{width: 50, marginRight: 5, marginLeft: 6}} value={this.state.value} onChange={this.changeValue}>
                    </input>
                    <button onClick={this.remove}>remove</button>
                </Typography>
            </div>
        );
    }
}
