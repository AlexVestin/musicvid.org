import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LayoutBody from "../components/LayoutBody";
import Typography from "../components/Typography";
import VideoModal from "./VideoModal";
import EmbeddedVideo from "./EmbeddedVideo";

const styles = theme => ({
    root: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(4)
    },
    images: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexWrap: "wrap"
    }
});

const images = [
    {
        src: "3LnXiDBUo40",
        title: "Phone Tag",
        width: "33%",
        attrib: "s0cliché X Drunk Girl",
        attribUrl: "https://www.youtube.com/watch?v=3LnXiDBUo40"
    },
    {
        src: "9Tb4hWA855w",
        title: "Beyond The Sky",
        width: "33%",
        attrib: "QuantumNeko & GSKY",
        attribUrl: "https://www.youtube.com/watch?v=9Tb4hWA855w"
    },
    {
        src: "QOLos9n4Yvk",
        title: "tensorplex - march mix // 30min set",
        width: "33%",
        attrib: "tensorplex",
        attribUrl: "https://www.youtube.com/watch?v=QOLos9n4Yvk"
    },
    {
        src: "4XV-CZPfkm0",
        title: "Never Give Up",
        width: "33%",
        attrib: "Microfish",
        attribUrl: "https://www.youtube.com/watch?v=4XV-CZPfkm0"
    },
    {
        src: "ph3GwXmj54M",
        title: "This is America & Snackbox (Joyryde Mashup)",
        width: "33%",
        attrib: "XironeHeate",
        attribUrl: "https://www.youtube.com/watch?v=ph3GwXmj54M"
    },
    {
        src: "5v6Kl1tVSK0",
        title: "Inuuro - Stellar Horizon",
        width: "33%",
        attrib: "Inuuro",
        attribUrl: "https://www.youtube.com/watch?v=5v6Kl1tVSK0"
    },
    {
        src: "nHadaKRZNyQ",
        title: 'Hypetrain" - Freestyle Trap Beat | Rap Hip Hop Instrumental 2019 | Woolume',
        width: "33%",
        attrib: "Woolume",
        attribUrl: "https://www.youtube.com/watch?v=nHadaKRZNyQ"
    },
    {
        src: "x_c1_L7zDA0",
        title: "19 EDO microtonal music: Love Shines Through - Stevie Boyes",
        width: "33%",
        attrib: "Stevie Boyes",
        attribUrl: "https://www.youtube.com/watch?v=x_c1_L7zDA0"
    },
    {
        src: "KIUDFKXqK9M",
        title: "GingkathFox - Sunny Afternoon",
        width: "33%",
        attrib: "ExperiBass",
        attribUrl: "https://www.youtube.com/watch?v=KIUDFKXqK9M"
    }
];

class ProductCategories extends React.PureComponent {
    state = {
        open: false,
        item: null
    }

    showVideo = (item) => {
        this.setState({open: true, item: item});
    }

    closeVideo = () => {
        this.setState({open: false});
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <VideoModal close={this.closeVideo} open={this.state.open} item={this.state.item}></VideoModal>
                <LayoutBody
                    className={classes.root}
                    component="section"
                    width="large"
                >
                    <Typography
                        variant="h4"
                        marked="center"
                        align="center"
                        component="h2"
                    >
                        Made with musicvid.org
                    </Typography>
                    <div className={classes.images}>
                        {images.map(image => (
                            <EmbeddedVideo
                                showVideoFor={this.showVideo}
                                image={image}
                                key={image.title}
                            />
                        ))}
                    </div>
                </LayoutBody>
            </React.Fragment>
        );
    }
}

ProductCategories.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductCategories);
