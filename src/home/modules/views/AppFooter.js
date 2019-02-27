import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '../components/Typography';
import TextField from '../components/TextField';
import LayoutBody from '../components/LayoutBody';

function compose(...funcs) {
  return funcs.reduce((a, b) => (...args) => a(b(...args)), arg => arg);
}


const styles = theme => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.secondary.light,
  },
  layoutBody: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
  },
  iconsWrapper: {
    height: 120,
  },
  icons: {
    display: 'flex',
  },
  icon: {
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.warning.main,
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.warning.dark,
    },
  },
  list: {
    margin: 0,
    listStyle: 'none',
    paddingLeft: 0,
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  language: {
    marginTop: theme.spacing(1),
    width: 150,
  },
});

const LANGUAGES = [
  {
    code: 'en-US',
    name: 'English',
  },
];

function AppFooter(props) {
  const { classes } = props;

  return (
    <Typography component="footer" className={classes.root}>
      <LayoutBody className={classes.layoutBody} width="large">
        <Grid container spacing={5}>
          <Grid item xs={6} sm={4} md={2}>
            <Grid
              container
              direction="column"
              justify="flex-end"
              className={classes.iconsWrapper}
              spacing={2}
            >
              <Grid item className={classes.icons}>
                <a href="https://facebook.com/" className={classes.icon} disabled>
                  <img src="onepirate/appFooterFacebook.png" alt="Facebook" />
                </a>
                <a href="https://twitter.com/" className={classes.icon}>
                  <img src="onepirate/appFooterTwitter.png" alt="Twitter" />
                </a>
              </Grid>
              <Grid item>© 2019 musicvid.org</Grid>
            </Grid>
          </Grid>

          <Grid item xs={6} sm={8} md={4}>
            <Typography variant="h6" marked="left" gutterBottom>
              Language
            </Typography>
            <TextField
              select
              SelectProps={{
                native: true,
              }}
              className={classes.language}
            >
              {LANGUAGES.map(language => (
                <option value={language.code} key={language.code}>
                  {language.name}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={8} sm={4} md={2}>
            
            </Grid>
          <Grid item>
            <Typography variant="caption">
              {'Icons made by '}
              <Link href="http://www.freepik.com" title="Freepik">
                Freepik
              </Link>
              {' from '}
              <Link href="https://www.flaticon.com/" title="Flaticon">
                www.flaticon.com
              </Link>
              {' is licensed by '}
              <Link
                href="http://creativecommons.org/licenses/by/3.0/"
                title="Creative Commons BY 3.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC 3.0 BY
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </LayoutBody>
    </Typography>
  );
}

AppFooter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  React.memo,
  withStyles(styles),
)(AppFooter);
