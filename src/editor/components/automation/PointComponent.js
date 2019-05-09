import React, { PureComponent } from "react";
import Typography from "@material-ui/core/Typography";

export default class Point extends PureComponent {
    constructor(props) {
        super(props);

        this.state = { value: props.point.value, time: props.point.time };
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
                    <input style={{width: 80, marginRight: 10, marginLeft: 5}} value={this.state.time} onChange={this.changeTime}>
                    </input>
                    Val:{" "}
                    <input style={{width: 80, marginRight: 5, marginLeft: 10}} value={this.state.value} onChange={this.changeValue}>
                    </input>
                </Typography>
            </div>
        );
    }
}
