import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SurroundSound from "@material-ui/icons/SurroundSound";
import Keyboard from "@material-ui/icons/Keyboard";
import Watch from "@material-ui/icons/Watch";
import { ListItemIcon } from "@material-ui/core";

const styles = theme => ({
    root: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    }
});

function getIcon(type) {
    switch (type) {
        case "audio":
            return <SurroundSound style={{color: "#753742"}}/>;
        case "math":
            return <Keyboard style={{color: "#D8D78F"}}/>;
        case "point":
            return <Watch style={{color: "#4F3130"}}/>;
        default:
            return <Keyboard />;
    }
}

function FolderList(props) {
    const { classes, automations } = props;
    return (
        <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
        <List className={classes.root} dense>
            {automations.map(automation => {
                return (
                    <ListItem key={automation.name} button onClick={() => props.onSelect(automation)}>
                        <ListItemIcon>{getIcon(automation.type)}</ListItemIcon>
                        <ListItemText
                            primary={automation.name}
                            secondary={automation.description}
                        />
                    </ListItem>
                );
            })}
        </List>
        </div>
    );
}

FolderList.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FolderList);
