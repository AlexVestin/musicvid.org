import React, { PureComponent } from "react";
import Typography from "@material-ui/core/Typography";
import { ReactComponent as Delete } from "./baseline-delete-24px.svg";

export default class Point extends PureComponent {
    constructor(props) {
        super(props);

        this.state = { value: props.point.value, time: props.point.time };
    }

    remove = () => {
        this.props.removePoint(this.props.point.id);
    };

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
            <div
                style={{
                    height: 30,
                    borderBottom: "1px solid gray",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center"
                }}
            >
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <Typography variant="h6">Time: </Typography>
                    <input
                        style={{
                            width: 50,
                            marginRight: 10,
                            marginLeft: 3,
                            height: 25
                        }}
                        value={this.state.time}
                        onChange={this.changeTime}
                    />
                    <Typography variant="h6">Value: </Typography>
                    <input
                        style={{
                            width: 50,
                            marginRight: 5,
                            marginLeft: 6,
                            height: 25
                        }}
                        value={this.state.value}
                        onChange={this.changeValue}
                    />
                </div>
                <Delete
                    fill="red"
                    onClick={this.remove}
                    style={{
                        color: "red",
                        position: "absolute",
                        right: 20,
                        cursor: "pointer"
                    }}
                />
            </div>
        );
    }
}
