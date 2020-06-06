import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LayoutBody from "../components/LayoutBody";
import Typography from "../components/Typography";
import ImageVideo from "./ImageVideo";

const styles = (theme) => ({
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

function ProductCategories(props) {
    const { classes } = props;

    const images = [
        {
            url: "img/templates/JSNation.png",
            src: "vid/templates/JSNationY.mp4",
            title: "Circle Spectrum",
            width: "40%",
            templateName: "editor?project=fe7acdd6-bbcc-467f-a4a1-52b19b970384",
            attrib: "@caseif & @Incept",
            attribUrl: "https://github.com/caseif/js.nation",
            license: "Attribution Required"
        },
        {
            url: "img/templates/Polartone.png",
            src: "vid/templates/PolartoneY.mp4",
            title: "Polartone",
            width: "24%",
            templateName: "editor?template=Polartone",
            attrib: "@mattdesl",
            attribUrl: "https://github.com/mattdesl/Polartone",
            license: "MIT"
        },
        {
            url: "img/templates/Monstercat.png",
            src: "vid/templates/MonstercatY.mp4",
            title: "Monstercat Bar Visualizer",
            width: "36%",
            templateName: "editor?project=c1ec78f7-3c67-4d10-80bc-70cdb8b8cf0d",
            attrib: "@caseif & @Incept",
            attribUrl: "https://github.com/caseif/vis.js",
            license: "Attribution Required"
        },
        {
            url: "img/templates/StarField.png",
            src: "vid/templates/StarNestY.mp4",
            title: "Star Field",
            width: "32%",
            templateName: "editor?template=Stars",
            attrib: "@kali",
            attribUrl: "https://www.shadertoy.com/user/kali",
            license: "MIT"
        },
        {
            url: "img/templates/linebed.PNG",
            src: "vid/templates/linebedY.mp4",
            title: "Linebed",
            width: "38%",
            templateName: "editor?project=a9a2e6e3-8c8b-44ca-8d44-f4400e6d835e",
            attrib: "GamleGaz",
            attribUrl: "https://musicvid.org",
            twitter: "",
            license: "MIT"
        },
        {
            url: "img/templates/UniverseWithin.png",
            src: "vid/templates/UniverseWithinY.mp4",
            title: "Universe Within",
            width: "30%",
            templateName: "editor?template=UniverseWithin",
            attrib: "@BigWIngs",
            attribUrl:
                "https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg",
            twitter: "https://twitter.com/The_ArtOfCode",
            license: "Attribution Required"
        },

        {
            url: "img/templates/AudioWave.png",
            src: "vid/templates/TimerepY.mp4",
            title: "Audio Wave",
            width: "20%",
            templateName: "editor?template=AudioWave",
            attrib: "@GamleGaz",
            attribUrl: "https://www.github.com/AlexVestin",
            license: "MIT"
        },
        {
            url: "img/templates/HexaGone.png",
            src: "vid/templates/HexagoneY.mp4",
            title: "HexaGone",
            width: "40%",
            templateName: "editor?project=96f76587-2e0a-4e00-9ad5-fddc96d9925e",
            attribUrl:
                "https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg",
            twitter: "https://twitter.com/The_ArtOfCode",
            attrib: "@BigWIngs",
            license: "Attribution Required"
        }
    ];

    /*
     {
      url:'img/templates/Noise.png',
      src: "vid/templates/NoiseY.mp4",
      title: 'Electric Noise',
      width: '40%',
      templateName: "editor?template=Noise",
      attrib: "nmz (@stormoid)",
      attribUrl: "https://www.shadertoy.com/user/nimitz",
      twitter: "https://twitter.com/stormoid",
      license: "Attribution Required"
    },


  */

    /*url: 'img/templates/SimplicityGalaxy.png',
      title: 'Simplicity Galaxy',
      width: '20%',
      templateName: "SimplicityGalaxy",
      attrib: "@CBS",
      attribUrl: "https://www.shadertoy.com/user/CBS",
      license: "FREE" */
    return (
        <LayoutBody className={classes.root} component="section" width="large">
            <Typography
                variant="h4"
                marked="center"
                align="center"
                component="h2"
            >
                Featured projects
            </Typography>
            <div className={classes.images}>
                {images.map((image) => (
                    <ImageVideo image={image} key={image.title}></ImageVideo>
                ))}
            </div>
        </LayoutBody>
    );
}

ProductCategories.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductCategories);
