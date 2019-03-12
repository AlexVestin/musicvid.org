import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

const styles = theme => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper
    },
    gridList: {
        width: 500,
        height: 450
    },
    icon: {
        color: "rgba(0, 0, 0, 0.74)"
    }
});

function TitlebarGridList(props) {
    const { classes } = props;

    return (
        <div className={classes.root}>
            <GridList cellHeight={180} className={classes.gridList}>
                <GridListTile
                    key="Subheader"
                    cols={2}
                    style={{ height: "auto" }}
                >
                    <ListSubheader component="div">
                        Audio reactive
                    </ListSubheader>
                </GridListTile>
                {Object.keys(props.tiles).map(key => {
                    const tile = props.tiles[key];
                    return (
                        <GridListTile key={key}>
                            <img src={tile.img} alt={key} />
                            <GridListTileBar
                                title={key}
                                subtitle={<span>by: {tile.authors}</span>}
                                actionIcon={
                                    <IconButton className={classes.icon} onClick={() => props.onSelect(key)}>
                                        <AddIcon />
                                    </IconButton>
                                }
                            />
                        </GridListTile>
                    );
                })}
            </GridList>
        </div>
    );
}

TitlebarGridList.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TitlebarGridList);
