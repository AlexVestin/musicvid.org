import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import { base } from "backend/firebase";
const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between"
        //overflow: "hidden"
    },
    tile: {
        margin: 0
    },
    gridList: {},
    icon: {
        color: "rgba(255, 255, 255, 0.54)"
    },
    imgWrapper: {
        //overflow:"hidden"
    },
    img: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    }
}));


function HookTile(props) {
    const { tile, classes } = props;
    const [src, setSrc] = useState("");

    useEffect(() => {
        base.collection("projects")
            .doc(tile.id)
            .get()
            .then(doc => {
                setSrc(doc.data().thumbnail);
            });
    });

    return (
        <React.Fragment>
            <img src={src} alt={tile.name} />
            <GridListTileBar
                title={tile.name}
                subtitle={<span>{tile.lastEdited}</span>}
            />
        </React.Fragment>
    );
}

export default function TitlebarGridList(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <GridList cellHeight={180} className={classes.gridList}>
                <GridListTile
                    key="Subheader"
                    cols={2}
                    style={{ height: "auto" }}
                />
                {props.tileData.map(tile => (
                    <GridListTile
                        onClick={() => props.loadProject(tile)}
                        style={{ cursor: "pointer" }}
                        key={tile.id}
                        className={classes.tile}
                    >
                        <HookTile tile={tile} classes={classes} />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}
