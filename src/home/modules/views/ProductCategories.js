import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LayoutBody from '../components/LayoutBody';
import Typography from '../components/Typography';
import ImageVideo from './ImageVideo'

const styles = theme => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
  },
  images: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexWrap: 'wrap',
  },

});


function ProductCategories(props) {
  const { classes } = props;

  const images = [
    {
      url: 'img/templates/JSNation.png',
      src: "vid/templates/JSNationX.mp4",
      title: 'Circle Spectrum',
      width: '40%',
      templateName: "JSNation",
      attrib: "@caseif & @Incept",
      attribUrl: "https://github.com/caseif/js.nation",
      license: "Attribution Required"
    },
    {
      url: 'img/templates/Polartone.png',
      src: "vid/templates/PolartoneX.mp4",
      title: 'Polartone',
      width: '24%',
      templateName: "Polartone",
      attrib: "@mattdesl",
      attribUrl: "https://github.com/mattdesl/Polartone",
      license: "MIT"
    },
    {
      url: 'img/templates/Monstercat.png',
      src: "vid/templates/MonstercatX.mp4",
      title: 'Monstercat Bar Visualizer',
      width: '36%',
      templateName: "Monstercat2D",
      attrib: "@caseif & @Incept",
      attribUrl: "https://github.com/caseif/vis.js",
      license: "Attribution Required"
    },
    {
      url: 'img/templates/StarField.png',
      src: "vid/templates/StarNestX.mp4",
      title: 'Star Field',
      width: '32%',
      templateName: "Stars",
      attrib: "@kali",
      attribUrl: "https://www.shadertoy.com/user/kali",
      license: "MIT"
    },
    {
      url: 'img/templates/Sinuous.png',
      src: "vid/templates/SinuousX.mp4",
      title: 'Sinuous',
      width: '38%',
      templateName:"Sinuous",
      attrib: "nmz (@stormoid)",
      attribUrl: "https://www.shadertoy.com/user/nimitz",
      twitter: "https://twitter.com/stormoid",
      license: "Attribution Required"
    },
    {
      url: 'img/templates/UniverseWithin.png',
      src: "vid/templates/UniverseWithinX.mp4",
      title: 'Universe Within',
      width: '30%',
      templateName: "UniverseWithin",
      attrib: "@BigWIngs",
      attribUrl: "https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg",
      twitter: "https://twitter.com/The_ArtOfCode",
      license: "Attribution Required"
    },
    {
      url:'img/templates/Noise.png',
      src: "vid/templates/NoiseX.mp4",
      title: 'Electric Noise',
      width: '40%',
      templateName: "Noise",
      attrib: "nmz (@stormoid)",
      attribUrl: "https://www.shadertoy.com/user/nimitz",
      twitter: "https://twitter.com/stormoid",
      license: "Attribution Required"
    },
    {
      url: 'img/templates/AudioWave.png',
      src: "vid/templates/TimerepX.mp4",
      title: 'Audio Wave',
      width: '20%',
      templateName: "AudioWave",
      attrib: "@GamleGaz",
      attribUrl: "https://www.github.com/AlexVestin",
      license: "MIT"
    },
    {
      url: 'img/templates/HexaGone.png',
      src: "vid/templates/HexagoneX.mp4",
      title: 'HexaGone',
      width: '40%',
      templateName:"HexaGone",
      attribUrl: "https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg",
      twitter: "https://twitter.com/The_ArtOfCode",
      attrib: "@BigWIngs",
      license: "Attribution Required"
    }

  ];
  /*url: 'img/templates/SimplicityGalaxy.png',
      title: 'Simplicity Galaxy',
      width: '20%',
      templateName: "SimplicityGalaxy",
      attrib: "@CBS",
      attribUrl: "https://www.shadertoy.com/user/CBS",
      license: "FREE" */
  return (
    <LayoutBody className={classes.root} component="section" width="large">
      <Typography variant="h4" marked="center" align="center" component="h2">
        Featured projects
      </Typography>
      <div className={classes.images}>
        {images.map(image => (
          <ImageVideo image={image} key={image.title}></ImageVideo>
        ))}
      </div>
    </LayoutBody>
  );
}

ProductCategories.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductCategories);
