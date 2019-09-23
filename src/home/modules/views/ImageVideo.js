import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "../components/Typography";
import Fade from "@material-ui/core/Fade";

const styles = theme => ({
    license: {
        position: "absolute",
        left: "5%",
        bottom: "10%",
        textAlign: "left"
    },
    vidSrc: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        overflow: "hidden",
        transition: "opacity 3s ease-in-out;"
    },
    attrib: {
        position: "absolute",
        right: "5%",
        bottom: "10%",
        textAlign: "right",
        pointerEvents: "none"
    },
    link: {
        textDecoration: "none",
        color: "inherit",
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 4,
        fontSize: 13,
        cursor: "pointer",
        pointerEvents: "auto",
        border: "none",
        borderRadius: "0.25em",
        "&:hover": {
            backgroundColor: "rgba(0,0,0,0.3)"
        }
    },

    imageWrapper: {
        position: "relative",
        display: "block",
        padding: 0,
        borderRadius: 0,
        minHeight: 225,
        height: "40vh",
        [theme.breakpoints.down("sm")]: {
            width: "100% !important",
            height: 100
        },
        "&:hover": {
            zIndex: 1
        },
        "&:hover $imageBackdrop": {
            opacity: 0.15
        },
        "&:hover $imageMarked": {
            opacity: 0
        },
        "&:hover $imageTitle": {
            border: "4px solid currentColor"
        }
    },
    imageButton: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.palette.common.white
    },
    imageSrc: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
        objectFit: "cover"
    },
    imageBackdrop: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: theme.palette.common.black,
        opacity: 0.5,
        transition: theme.transitions.create("opacity")
    },
    imageTitle: {
        position: "relative",
        padding: `${theme.spacing(2)}px ${theme.spacing(4)}px 14px`
    },
    imageMarked: {
        height: 3,
        width: 18,
        background: theme.palette.common.white,
        position: "absolute",
        bottom: -2,
        left: "calc(50% - 9px)",
        transition: theme.transitions.create("opacity")
    }
});

class Image extends PureComponent {
    constructor() {
        super();

        this.videoRef = React.createRef();
        this.videoMountRef = React.createRef();

        this.state = {
            mouseOver: false,
            redirectTo: "",
            redirectOffsite: false
        };
    }
    componentDidMount = () => {};

    play = () => {
        this.setState({ mouseOver: true });
    };

    pause = event => {
        const e = event.toElement || event.relatedTarget;

        if (
            !e ||
            (e.id !== "website-link" && e.id !== this.props.image.title)
        ) {
            this.setState({ mouseOver: false });
        } else {
        }
    };
    render() {
        const { image, classes } = this.props;
        const { mouseOver, redirectTo, redirectOffsite } = this.state;

        if (redirectTo && !redirectOffsite) return <Redirect to={redirectTo} />;

        return (
            <ButtonBase
                onClick={() =>
                    this.setState({
                        redirectTo: image.templateName
                    })
                }
                className={classes.imageWrapper}
                style={{
                    width: image.width,
                    overflow: "hidden"
                }}
                id={this.props.title}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#000"
                    }}
                    className={this.props.className}
                    ref={this.videoMountRef}
                >
                    <Fade in={mouseOver} timeout={1000}>
                        <div>
                            {mouseOver && (
                                <video
                                    loop
                                    autoPlay
                                    className={classes.vidSrc}
                                    poster={image.url}
                                    src={image.src}
                                    style={{ display: mouseOver ? "" : "none" }}
                                />
                            )}
                        </div>
                    </Fade>
                    <Fade in={!mouseOver} timeout={600}>
                        <div
                            className={classes.imageSrc}
                            style={{
                                display: mouseOver ? "none" : "",
                                backgroundImage: `url(${image.url})`
                            }}
                        />
                    </Fade>
                </div>

                <div className={classes.imageBackdrop} />
                <div
                    onMouseOver={this.play}
                    onMouseOut={this.pause}
                    className={classes.imageButton}
                    id={this.props.image.title}
                >
                    <Typography
                        component="h3"
                        variant="h6"
                        color="inherit"
                        className={classes.imageTitle}
                        style={{ pointerEvents: "none" }}
                    >
                        {image.title}
                        <div className={classes.imageMarked} />
                    </Typography>

                    <div className={classes.attrib}>
                        <Typography component="h6" variant="h6" color="inherit">
                            {image.attrib}
                        </Typography>
                        <Typography component="h6" variant="h6" color="inherit">
                            <span
                                onClick={e => {
                                    this.setState({ redirectOffsite: true });
                                    window.location = image.attribUrl;
                                    e.preventDefault();
                                }}
                                className={classes.link}
                                id="website-link"
                            >
                                Website
                            </span>
                            <div style={{ fontSize: 12, marginTop: 4 }}>
                                {image.license}
                            </div>
                        </Typography>
                    </div>
                </div>
            </ButtonBase>
        );
    }
}

export default withStyles(styles)(Image);
