import React, { PureComponent } from "react";
import PointList from "./PointList";
import Button from '@material-ui/core/Button'

export default class PointItem extends PureComponent {
    constructor(props) {
        super(props);
        this.item = props.item;
        this.gui = props.gui;

        this.state = {nrPoints: 0};
    }

    addPoint = () => {
        const { item } = this.props;
        item.points.push({value: 0, time: this.gui.__time});
        this.forceUpdate();
    }

    render() {
        return (
            <div>
                <PointList points={this.item.points}> </PointList>
                {this.state.nrPoints}
                <Button onClick={this.addPoint}>Add new point</Button>
            </div>
        );
    }
}
