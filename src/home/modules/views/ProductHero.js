import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Link from 'react-router-dom/Link';
import Button from '../components/Button';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';

const backgroundImage = './img/Background.png';

const styles = theme => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: 'center',
  },
  button: {
    minWidth: 200,
  },
  h5: {
    marginBottom: theme.spacing * 4,
    marginTop: theme.spacing * 4,
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing * 10,
    },
  },
  more: {
    marginTop: theme.spacing * 2,
  },
});

function ProductHero(props) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img style={{ display: 'none' }} src={backgroundImage} alt="" />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        Visualize your sound
      </Typography>
      <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
          Make professional visuals directly in your browser.
          <br/> 
            No payments, watermarks or sign-ups!
      </Typography>
      <Button
        color="secondary"
        variant="contained"
        size="large"
        className={classes.button}
        style={{textAlign: "center", color: "rgb(20,20,22)"}}
        component={linkProps => (
          <Link {...linkProps} to="/editor" variant="button" />
        )}
      >
        Open empty template
      </Button>

      <Button
        color="primary"
        variant="contained"
        size="large"
        className={classes.button}
        style={{textAlign: "center", marginTop: 10, width: 255, backgroundColor: "#3333AA", fontSize: "0.825rem"}}
        component={linkProps => (
          <Link {...linkProps} to="/downloads" variant="button" />
        )}
      >
        Download desktop client
      </Button>
      <Typography variant="body2" color="inherit" className={classes.more}>
        Scroll down to view featured templates
      </Typography>
    </ProductHeroLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHero);
