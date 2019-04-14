import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

const styles = theme => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,

    },
    gridList: {
        width: "70%",
        height: 450
    },
    icon: {
        color: "rgba(255, 255, 255, 0.74)",
        backgroundColor: "rgba(0, 0, 0, 0.74)",

    },
    tile: {
        width: 150,
        
    },
    tileBar: {
        backgroundColor: "black",
       
    }
});

function TitlebarGridList(props) {
    const { classes } = props;

    return (
        <div className={classes.root}>
            <GridList cols={3} cellHeight={180} className={classes.gridList}>

                {Object.keys(props.tiles).map(key => {
                    const tile = props.tiles[key];
                    return (
                        <GridListTile key={key} className={classes.tile}>
                            {tile.img && <img src={tile.img} alt={key} style={{backgroundColor: "#000"}} />}
                            <GridListTileBar
                                 className={classes.tileBar}
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
