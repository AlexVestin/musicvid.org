import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import LayoutBody from "../components/LayoutBody";
import Button from "../components/Button";
import Typography from "../components/Typography";
import { Redirect } from 'react-router-dom'

const styles = theme => ({
    root: {
        display: "flex",
        backgroundColor: theme.palette.secondary.light,
        overflow: "hidden"
    },
    layoutBody: {
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(15),
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    item: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(0, 5)
    },
    title: {
        marginBottom: theme.spacing(14)
    },
    number: {
        fontSize: 24,
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.secondary.main,
        fontWeight: theme.typography.fontWeightMedium
    },
    image: {
        height: 55,
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4)
    },
    curvyLines: {
        pointerEvents: "none",
        position: "absolute",
        top: -180,
        opacity: 0.7
    },
    button: {
        marginTop: theme.spacing(8)
    }
});

class ProductHowItWorks extends React.PureComponent {
    state = {redirectTo: ""};

    render() {
        const { classes } = this.props;
        if(this.state.redirectTo) 
          return <Redirect to={this.state.redirectTo}></Redirect>

        return (
            <section className={classes.root}>
                <LayoutBody className={classes.layoutBody} width="large">
                    <img
                        src="onepirate/productCurvyLines.png"
                        className={classes.curvyLines}
                        alt="curvy lines"
                    />
                    <Typography
                        variant="h4"
                        marked="center"
                        className={classes.title}
                        component="h2"
                    >
                        How it works
                    </Typography>
                    <div>
                        <Grid container spacing={5}>
                            <Grid item xs={12} md={4}>
                                <div className={classes.item}>
                                    <div className={classes.number}>1.</div>
                                    <img
                                        src="onepirate/project-management.png"
                                        alt="suitcase"
                                        className={classes.image}
                                    />
                                    <Typography variant="h5" align="center">
                                        Choose a template to start from.
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <div className={classes.item}>
                                    <div className={classes.number}>2.</div>
                                    <img
                                        src="onepirate/music-and-multimedia.png"
                                        alt="graph"
                                        className={classes.image}
                                    />
                                    <Typography variant="h5" align="center">
                                        Play around with the settings until you
                                        have something you like.
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <div className={classes.item}>
                                    <div className={classes.number}>3.</div>
                                    <img
                                        src="onepirate/video.png"
                                        alt="clock"
                                        className={classes.image}
                                    />
                                    <Typography variant="h5" align="center">
                                        Hit export!
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                    <Button
                        disabled
                        color="secondary"
                        size="large"
                        variant="contained"
                        className={classes.button}
                        onClick={() => this.setState({ redirectTo: "" })}
                    >
                        More information
                    </Button>
                </LayoutBody>
            </section>
        );
    }
}

ProductHowItWorks.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductHowItWorks);
