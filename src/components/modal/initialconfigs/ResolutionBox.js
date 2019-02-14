import React, { PureComponent } from 'react'
import classes from './SelectResolutionModal.module.scss';

export default class ResolutionBox extends PureComponent {

    height = 90;

    getDimensions = (object) => { return { width: Number(object.res.split("x")[0]), height: Number(object.res.split("x")[1]) } }

    getStyle = (object) => {
        const dim = this.getDimensions(object);
        const aspect = dim.width / dim.height;

        return { width: this.height * aspect, height: this.height, color: object.name === this.props.selected ? "gold" : null }
    }
    render() {
        return (

            <div className={classes.groupContainer}>
                <div className={classes.groupTitle}>{this.props.title}</div>
                <div className={classes.items}>{
                    this.props.items.map((object) => {
                        return (

                            <div key={object.name} className={classes.itemContainer}>
                                <div style={this.getStyle(object)} className={classes.button} onClick={() => this.props.onClick(this.getDimensions(object))}>
                                    <div className={classes.itemTitle}>
                                        {object.name}
                                    </div>
                                    <div className={classes.resolution}>{object.res}</div>
                                </div>
                            </div>
                        )
                    })
                }</div>

            </div>
        )
    }
}
