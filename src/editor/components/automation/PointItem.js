import React, { PureComponent } from "react";
import PointList from "./PointList";
import Button from '@material-ui/core/Button'
import uuid from 'uuid/v4';

import EasingFunctions from 'editor/animation/automation/EasingFunctions'
import { Typography } from "@material-ui/core";


export default class PointItem extends PureComponent {
    constructor(props) {
        super(props);
        this.item = props.item;
        this.gui = props.gui;

        this.state = { interpolation: props.item.interpolation };
    }

    removePoint =  (pointId) => {
        const { item } = this.props;
        item.points = item.points.filter(point =>  point.id !== pointId);
        this.forceUpdate();
    }

    addPoint = () => {
        const { item } = this.props;
        item.points.push({value: 0, time: this.gui.__time, id: uuid()});
        this.forceUpdate();
    }

    change = (event) => {
        this.props.item.interpolation = event.target.value;
        this.setState({interpolation: event.target.value});
    }

    render() {
        return (
            <div>
                <div style={{ display: "flex", justifyContent: "space-between"}}>
                    <Typography style={{color: "#efefef"}} variant="h6">
                        Interpolation: 
                    </Typography>
                    <select onChange={this.change} value={this.state.interpolation}>
                        {Object.keys(EasingFunctions).map(key => {
                            return <option key={key} value={key}>{key}</option>
                        })}
    
                    </select>
                </div>
                <PointList removePoint={this.removePoint} points={this.item.points}> </PointList>
                <Button color="secondary" onClick={this.addPoint}>Add new point</Button>
            </div>
        );
    }
}
