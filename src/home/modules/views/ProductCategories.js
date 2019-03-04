import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import LayoutBody from '../components/LayoutBody';
import Typography from '../components/Typography';

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
  license: {
    position: "absolute",
    left: "5%",
    bottom: "10%",
    textAlign: "left",
    
  },
  attrib: {
    position: "absolute",
    right: "5%",
    bottom: "10%",
    textAlign: "right",
    
  },
  link: {
    textDecoration: "none", 
    color: "inherit", 
    fontFamily:"'Roboto', sans-serif",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 4,
    cursor: "pointer",
    border: "none",
    borderRadius: "0.25em",
    '&:hover': {
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  },
  
 
  imageWrapper: {
    position: 'relative',
    display: 'block',
    padding: 0,
    borderRadius: 0,
    minHeight: 165,
    height: '40vh',
    [theme.breakpoints.down('sm')]: {
      width: '100% !important',
      height: 100,
    },
    '&:hover': {
      zIndex: 1,
    },
    '&:hover $imageBackdrop': {
      opacity: 0.15,
    },
    '&:hover $imageMarked': {
      opacity: 0,
    },
    '&:hover $imageTitle': {
      border: '4px solid currentColor',
    },
  },
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: theme.palette.common.black,
    opacity: 0.5,
    transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px 14px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    background: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
});





function ProductCategories(props) {
  const { classes } = props;

  const images = [
    {
      url: 'img/templates/JSNation.png',
      title: 'Circle Spectrum',
      width: '40%',
      templateName: "JSNation",
      attrib: "@caseif & @Incept",
      attribUrl: "https://github.com/caseif/js.nation",
      license: "Attribution Required"
    },
    {
      url: 'img/templates/Polartone.png',
      title: 'Polartone',
      width: '24%',
      templateName: "Polartone",
      attrib: "@mattdesl",
      attribUrl: "https://github.com/mattdesl/Polartone",
      license: "MIT"
    },
    {
      url: 'img/templates/Monstercat.png',
      title: 'Monstercat Bar Visualizer',
      width: '36%',
      templateName: "Monstercat2D",
      attrib: "@caseif & @Incept",
      attribUrl: "https://github.com/caseif/vis.js",
      license: "Attribution Required"
    },
    {
      url: 'img/templates/StarField.png',
      title: 'Star Field',
      width: '32%',
      templateName: "Stars",
      attrib: "@kali",
      attribUrl: "https://www.shadertoy.com/user/kali",
      license: "MIT"
    },
    {
      url: 'img/templates/Sinuous.png',
      title: 'Sinuous',
      width: '38%',
      templateName:"Sinuous",
      attrib: "Samuel C. (@stormoid)",
      attribUrl: "https://www.shadertoy.com/user/nimitz",
      twitter: "https://twitter.com/stormoid",
      license: "Attribution Required"
    },
    {
      url: 'img/templates/UniverseWithin.png',
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
      title: 'Electric Noise',
      width: '40%',
      templateName: "Noise",
      attrib: "Samuel C. (@stormoid)",
      attribUrl: "https://www.shadertoy.com/user/nimitz",
      twitter: "https://twitter.com/stormoid",
      license: "Attribution Required"
    },
    {
      url: 'img/templates/AudioWave.png',
      title: 'Audio Wave',
      width: '20%',
      templateName: "AudioWave",
      attrib: "@GamleGaz",
      attribUrl: "https://www.github.com/AlexVestin",
      license: "MIT"
    },
    {
      url: 'img/templates/HexaGone.png',
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
          <ButtonBase
            href={"editor?template=" + image.templateName} 
            key={image.title}
            className={classes.imageWrapper}
            style={{
              width: image.width,
            }}
          >
            <div
              className={classes.imageSrc}
              style={{
                backgroundImage: `url(${image.url})`,
              }}
            />
            <div className={classes.imageBackdrop} />
            <div className={classes.imageButton}>
              <Typography
                component="h3"
                variant="h6"
                color="inherit"
                className={classes.imageTitle}
              >
                {image.title}
                <div className={classes.imageMarked} />
              </Typography>

              <div className={classes.attrib}>
                <Typography component="h6" variant="h6" color="inherit" >
                  {image.attrib}
                </Typography>
                <Typography component="h6" variant="h6" color="inherit">
                  
                  <button onClick={(e)=>{window.location=image.attribUrl;e.preventDefault()}} className={classes.link}>Website</button>
                  <div style={{fontSize: 12, marginTop: 4}}>{image.license}</div>
                </Typography>
              </div>

 

            </div>
          </ButtonBase>
        ))}
      </div>
    </LayoutBody>
  );
}

ProductCategories.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductCategories);
