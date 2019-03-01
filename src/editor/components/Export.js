import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

import blue from "@material-ui/core/colors/blue";
import ExportCard from "./ExportCard";
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';


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
                            don't navigate away from or close the tab)
                        </Typography>
                    </ListItem>
                    <ListItem style={{ justifyContent: "center" }}>
                    <Divider variant="fullWidth"/>
                    </ListItem>

                    <ListItem style={{ justifyContent: "center" }}>
                        <Typography
                            style={{ color: "#efefef" }}
                            component="h4"
                            variant="h4"
                        >
                            Creators
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

                    <ListItem style={{ justifyContent: "center" }}>
                        <Typography
                            style={{ color: "#efefef" }}
                            component="h6"
                            variant="h6"
                        >
                            musicvid.org Socials
                        </Typography>
                    </ListItem>


                    <ListItem style={{ justifyContent: "center" }}>


                    <Typography variant="h5" color="secondary">
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <Button
                                type="submit"
                                variant="contained"
                                style={{backgroundColor: "#7289DA", width: 200}}
                                className={classes.button}
                                href="https://discord.gg/Qf7y579"
                                target="_blank" 
                                rel="noopener noreferrer"
                                >
                            Discord
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                style={{backgroundColor: "#ff0000", width: 200, color: "#efefef", marginTop: 12}}
                                className={classes.button}
                                href="https://www.youtube.com/channel/UCMujRUizB4Rwdt_c0hpYryA"
                                target="_blank" 
                                rel="noopener noreferrer"
                                >
                            youtube
                            </Button>

                            </div>
                        </Typography>
                    </ListItem>
                        

                    
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
