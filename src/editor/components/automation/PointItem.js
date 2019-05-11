import React, { PureComponent } from "react";
import PointList from "./PointList";
import Button from '@material-ui/core/Button'
import uuid from 'uuid/v4';

export default class PointItem extends PureComponent {
    constructor(props) {
        super(props);
        this.item = props.item;
        this.gui = props.gui;
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

    render() {
        return (
            <div>
                <PointList removePoint={this.removePoint} points={this.item.points}> </PointList>
                <Button color="secondary" onClick={this.addPoint}>Add new point</Button>
            </div>
        );
    }
}
