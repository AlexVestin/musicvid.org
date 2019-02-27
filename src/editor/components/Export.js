import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

import blue from "@material-ui/core/colors/blue";
import ExportCard from "./ExportCard";

const styles = {
    root: {
        marginTop: 30,
        width: "50%"
    },
    cotntainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        backgroundColor: blue[100],
        color: blue[600]
    }
};

class SimpleDialog extends React.Component {
    handleClose = () => {
        //this.props.onClose(this.props.selectedValue);
    };

    getDimensions = object => {
        return {
            width: Number(object.split("x")[0]),
            height: Number(object.split("x")[1])
        };
    };

    render() {
        const { classes } = this.props;
        const items = this.props.items;

        return (
            <div className={classes.container}>
                <List>

                <ListItem style={{ justifyContent: "center", display: "flex", flexDirection: "column" }}>
                        <Typography
                            style={{ color: "#efefef" }}
                            component="h2"
                            variant="h2"
                        >
                            Exporting
                        </Typography>
                        <div className={classes.root}>
                            <LinearProgress
                                color="secondary"
                                variant="determinate"
                                value={this.props.progress * 100}
                            />
                        </div>
                        <Typography
                            style={{ color: "#efefef" }}
                            component="h6"
                            variant="h6"
                        >
                            Check out the contributors in the meantime! (but
                            don't navigate away or close the page)
                        </Typography>
                    </ListItem>

                    <ListItem style={{ justifyContent: "center" }}>
                        <Typography
                            style={{ color: "#efefef" }}
                            component="h4"
                            variant="h4"
                        >
                            Contributors
                        </Typography>
                    </ListItem>

                    {items.map(item => (
                        <React.Fragment key={item.name}>
                            {item.showAttribution && (
                                <ListItem style={{ justifyContent: "center" }}>
                                    <ExportCard item={item} />
                                </ListItem>
                            )}
                        </React.Fragment>
                    ))}

                    
                </List>
            </div>
        );
    }
}

SimpleDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string
};

export default withStyles(styles)(SimpleDialog);
