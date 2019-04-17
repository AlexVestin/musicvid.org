import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";

const styles = theme => ({
    root: {
        width: "100%",
        backgroundColor: theme.palette.background.paper
    }
});

function getIcon(type) {
    switch (type) {
        case "audio":
            return <WorkIcon />;
        case "math":
            return <ImageIcon />;
        case "points":
            return <BeachAccessIcon />;
        default:
            return <WorkIcon />;
    }
}

function FolderList(props) {
    const { classes, automations } = props;
    return (
        <List className={classes.root}>
            {automations.map(automation => {
                return (
                    <ListItem key={automation.name} button onClick={() => props.onSelect(automation)}>
                        <Avatar>{getIcon(automation.type)}</Avatar>
                        <ListItemText
                            primary={automation.name}
                            secondary={automation.description}
                        />
                    </ListItem>
                );
            })}
        </List>
    );
}

FolderList.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FolderList);
