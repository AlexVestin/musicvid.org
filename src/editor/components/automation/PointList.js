import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Point from './PointComponent'

const styles = theme => ({
    root: {
        width: "100%",
        backgroundColor: theme.palette.background.paper
    }
});

function FolderList(props) {
    const { classes, points } = props;
    return (
        <div className={classes.root}>
            {points.map( (point,i) => {
                return (
                    <div key={point.id}>
                        <Point removePoint={props.removePoint} point={point}></Point>
                    </div>
                );
            })}
        </div>
    );
}

FolderList.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FolderList);
