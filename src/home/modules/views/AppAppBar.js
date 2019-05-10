import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Link from "@material-ui/core/Link";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import AppBar from "../components/AppBar";
import classNames from "classnames";

import Toolbar, { styles as toolbarStyles } from "../components/Toolbar";
import { Typography } from "@material-ui/core";

const styles = theme => ({
    container: {
        height: "7vh"
    },
    title: {
        fontSize: 24,
        cursor: "pointer"
    },
    placeholder: toolbarStyles(theme).root,
    toolbar: {
        justifyContent: "space-between"
    },
    left: {
        flex: 1
    },
    leftLinkActive: {
        color: theme.palette.common.white
    },
    right: {
        flex: 1,
        display: "flex",
        justifyContent: "flex-end"
    },
    rightLink: {
        fontSize: 16,
        color: theme.palette.common.white,
        marginLeft: theme.spacing(3),
        cursor: "pointer"
    },
    linkSecondary: {
        color: theme.palette.secondary.main
    }
});

class AppAppBar extends PureComponent {
    state = { redirectTo: "" };

    render() {
        const { classes } = this.props;
        const { redirectTo } = this.state;
        if (redirectTo && window.location.pathname !== redirectTo)
            return <Redirect to={redirectTo} />;

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
                            onClick={() => this.setState({ redirectTo: "/" })}
                        >
                            {"musicvid.org"}
                        </Link>

                        <Typography
                            variant="h6"
                            style={{ color: "#ff3366", marginLeft: 6 }}
                        >
                            {" "}
                            ALPHA
                        </Typography>
                        <div className={classes.right}>
                            <Link
                                color="inherit"
                                variant="h6"
                                underline="none"
                                className={classes.rightLink}
                                onClick={() =>
                                    this.setState({ redirectTo: "/videos" })
                                }
                            >
                                {"Videos"}
                            </Link>

                            <Link
                                color="inherit"
                                variant="h6"
                                underline="none"
                                className={classes.rightLink}
                                onClick={() =>
                                    this.setState({ redirectTo: "/about" })
                                }
                            >
                                {"help"}
                            </Link>
                            {!this.props.isAuthenticated ?
                               <AuthenticationButtonGroup
                               signIn={() =>
                                   this.setState({ redirectTo: "/sign-in" })
                               }
                               signUp={() =>
                                   this.setState({ redirectTo: "/sign-up" })
                               }
                               classes={classes}
                           />:
                           <ProfileButtonGroup
                               projects={() =>
                                   this.setState({ redirectTo: "/projects" })
                               }
                               profile={() =>
                                   this.setState({ redirectTo: "/sign-out" })
                               }
                               classes={classes}
                           />
                            }

                           
                        </div>
                    </Toolbar>
                </AppBar>
                <div className={classes.placeholder} />
            </div>
        );
    }
}

const ProfileButtonGroup = function(props) {
  const { classes } = props;
  return (
      <React.Fragment>
          <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              onClick={props.projects}
          >
              {"My projects"}
          </Link>
          <Link
              variant="h6"
              underline="none"
              className={classNames(classes.rightLink, classes.linkSecondary)}
              onClick={props.profile}
          >
              {"Sign out"}
          </Link>
      </React.Fragment>
  )
}

const AuthenticationButtonGroup = function(props) {
    const { classes } = props;
    return (
        <React.Fragment>
            <Link
                color="inherit"
                variant="h6"
                underline="none"
                className={classes.rightLink}
                onClick={props.signIn}
            >
                {"Sign In"}
            </Link>
            <Link
                variant="h6"
                underline="none"
                className={classNames(classes.rightLink, classes.linkSecondary)}
                onClick={props.signUp}
            >
                {"Sign Up"}
            </Link>
        </React.Fragment>
    );
};

AppAppBar.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
};
const styled = withStyles(styles)(AppAppBar);
export default connect(mapStateToProps)(styled);
