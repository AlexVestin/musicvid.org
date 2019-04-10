import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import AppBar from '../components/AppBar';
import classNames from 'classnames';

import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';

const styles = theme => ({
  container: {
    height: "7vh"
  },
  title: {
    fontSize: 24,
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: 'space-between',

  },
  left: {
    flex: 1,
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(3),
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
});

function AppAppBar(props) {
  const { classes } = props;

  return (
    <div className={classes.container}>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left} />
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            className={classes.title}
            href="/"
          >
            {'musicvid.org'}
          </Link>
          <div className={classes.right}>
          <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              href="/tutorial"
            >
              {'Videos'}
            </Link>

            <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              href="/about"
            >
              {'help'}
            </Link>

            <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              href="/sign-in"
            >
              {'Sign In'}
            </Link>
            <Link
              variant="h6"
              underline="none"
              className={classNames(classes.rightLink, classes.linkSecondary)}
              href="/sign-up"
            >
              {'Sign Up'}
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.placeholder} />
    </div>
  );
}

AppAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppAppBar);
