import withRoot from "./modules/withRoot";
// --- Post bootstrap -----
import React from "react";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import { Field, Form, FormSpy } from "react-final-form";
import Typography from "./modules/components/Typography";
import AppFooter from "./modules/views/AppFooter";
import AppAppBar from "./modules/views/AppAppBar";
import AppForm from "./modules/views/AppForm";
import { email, required } from "./modules/form/validation";
import RFTextField from "./modules/form/RFTextField";
import FormButton from "./modules/form/FormButton";
import FormFeedback from "./modules/form/FormFeedback";
import Button from "@material-ui/core/Button";
import { app, facebookProvider, googleProvider } from "backend/firebase";
import Snackbar from "./Snackbar";
import { connect } from "react-redux";
import { setIsAuthenticated } from "fredux/actions/auth";
import { Redirect } from 'react-router-dom'

const bootstrapButtonStyle = {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    boxShadow: "none",
    color: "white",
    fontSize: 16,
    padding: "6px 12px",
    border: "1px solid",
    backgroundColor: "#007bff",
    borderColor: "#007bff"
};

const styles = theme => ({
    form: {
        marginTop: theme.spacing(4)
    },
    button: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2)
    },
    feedback: {
        marginTop: theme.spacing(2)
    }
});

class SignUp extends React.Component {
    state = {
        sent: false
    };

    validate = values => {
        const errors = required(
            ["email", "password"],
            values,
            this.props
        );

        if (!errors.email) {
            const emailError = email(values.email, values, this.props);
            if (emailError) {
                errors.email = email(values.email, values, this.props);
            }
        }

        return errors;
    };

    successRedirect = (res) => {
        setIsAuthenticated(true);
        this.setState({ redirectTo: "/" });
    };

    authWithGoogle = () => {
      app.auth()
          .signInWithPopup(googleProvider)
          .then((result, error) => {
              if (error) {
                  this.setState({ error: "Unable to sign in with Google." });
              } else {
                  this.successRedirect(result);
              }
          });
    };

    authWithFacebook = () => {
        app.auth()
            .signInWithPopup(facebookProvider)
            .then((result, error) => {
                if (error) {
                    this.setState({
                        error: "Unable to sign in with Facebook."
                    });
                } else {
                    this.successRedirect(result);
                }
            });
    };

    handleSubmit = (values, props) => {
        this.setState({ errorMessage: "", errorSnackBarOpen: false });

        const email = values.email;
        const password = values.password;

        if (password.length < 6) {
            this.setState({
                errorSnackBarOpen: true,
                errorMessage: "Password must be atleast 6 characters long"
            });
            return;
        }
        app.auth()
            .createUserWithEmailAndPassword(email, password)
            .then((result, error) => {
                if (error) {
                    this.setState({
                        errorSnackBarOpen: true,
                        errorMessage:
                            "Email/password doesn't match, or the user doesn't exist"
                    });
                } else {
                    this.successRedirect(result);
                }
            })
            .catch(error => {
                var errorMessage = error.message;
                this.setState({
                    errorSnackBarOpen: true,
                    errorMessage: errorMessage
                });
            });
    };

    toggleError = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        this.setState({ errorSnackBarOpen: false });
    };

    render() {
        const { classes } = this.props;
        const { sent, errorMessage, errorSnackBarOpen } = this.state;

        if(this.state.redirectTo || this.props.isAuthenticated)
          return <Redirect to={this.state.redirectTo || "/"}></Redirect>

        return (
            <React.Fragment>
                <Snackbar
                    open={errorSnackBarOpen}
                    message={errorMessage}
                    handleClose={this.toggleError}
                />
                <AppAppBar />
                <AppForm>
                    <React.Fragment>
                        <Typography
                            variant="h3"
                            gutterBottom
                            marked="center"
                            align="center"
                        >
                            Sign Up
                        </Typography>
                        <Typography variant="body2" align="center">
                            <Link onClick={() => this.setState({redirectTo: "/sign-in"})}
                                style={{cursor: "pointer"}} underline="always">
                                Already have an account?
                            </Link>
                        </Typography>
                    </React.Fragment>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            marginBottom: 10,
                            marginTop: 10
                        }}
                    >
                        <Button
                            style={{
                                ...bootstrapButtonStyle,
                                textTransform: "none",
                                backgroundColor: "#3B5998",
                                borderColor: "#3B5998"
                            }}
                            className={classes.socbutton}
                            onClick={this.authWithFacebook}
                        >
                            Sign up with facebook
                        </Button>
                        <Button
                            style={{
                                ...bootstrapButtonStyle,
                                textTransform: "none",
                                backgroundColor: "#F32E06",
                                borderColor: "#F32E06"
                            }}
                            className={classes.socbutton}
                            onClick={this.authWithGoogle}
                        >
                            Sign up with Google
                        </Button>
                    </div>

                    <div style={{ textAlign: "center" }}> <Typography variant="h6">Or</Typography></div>

                    <Form
                        onSubmit={this.handleSubmit}
                        subscription={{ submitting: true }}
                        validate={this.validate}
                    >
                        {({ handleSubmit, submitting }) => (
                            <form
                                onSubmit={handleSubmit}
                                className={classes.form}
                                noValidate
                            >

                                <Field
                                    autoComplete="email"
                                    component={RFTextField}
                                    disabled={submitting || sent}
                                    fullWidth
                                    label="Email"
                                    margin="normal"
                                    name="email"
                                    required
                                />
                                <Field
                                    fullWidth
                                    component={RFTextField}
                                    disabled={submitting || sent}
                                    required
                                    name="password"
                                    autoComplete="current-password"
                                    label="Password"
                                    type="password"
                                    margin="normal"
                                />
                                <FormSpy subscription={{ submitError: true }}>
                                    {({ submitError }) =>
                                        submitError ? (
                                            <FormFeedback
                                                className={classes.feedback}
                                                error
                                            >
                                                {submitError}
                                            </FormFeedback>
                                        ) : null
                                    }
                                </FormSpy>
                                <FormButton
                                    className={classes.button}
                                    disabled={submitting || sent}
                                    color="secondary"
                                    fullWidth
                                    onSubmit={this.handleSubmit}
                                >
                                    {submitting || sent
                                        ? "In progress…"
                                        : "Sign Up"}
                                </FormButton>
                            </form>
                        )}
                    </Form>
                </AppForm>
                <AppFooter />
            </React.Fragment>
        );
    }
}

SignUp.propTypes = {
    classes: PropTypes.object.isRequired
};
const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
};
const Mat = compose(
  withRoot,
  withStyles(styles),
)(SignUp);

export default connect(mapStateToProps)(Mat);
