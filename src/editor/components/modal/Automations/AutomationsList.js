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
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    }
});

function getIcon(type)  {
    switch(type) {
        case "audio":
            return <WorkIcon></WorkIcon>;
        case "math":
            return <ImageIcon></ImageIcon>;
        case "points":
            return <BeachAccessIcon></BeachAccessIcon>;
        default: 
            return <WorkIcon></WorkIcon>;
    }
}

function FolderList(props) {
    const { classes, automations } = props;
    return (
        <List className={classes.root}>
            {automations.map(automation => {
                return (
                    <ListItem button onClick={() => this.props.onSelect(automation)}>
                        <Avatar>
                            {getIcon(automation.type)}
                        </Avatar>
                        <ListItemText
                            primary={automation.name}
                            secondary="Jan 9, 2014"
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
