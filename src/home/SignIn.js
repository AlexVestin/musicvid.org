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
import { app, facebookProvider, googleProvider } from "backend/firebase";
import Snackbar from './Snackbar';
import Button from "@material-ui/core/Button";
import { setIsAuthenticated } from 'fredux/actions/auth'
import Redirect from "react-router/Redirect";
import { connect } from 'react-redux';

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
        marginTop: theme.spacing(2)
    },
    button: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2)
    },
    feedback: {
        marginTop: theme.spacing(2)
    }
});

class SignIn extends React.Component {
    state = {
        sent: false,
        errorSnackBarOpen: false,
        errorMessage: "" ,
        redirectTo: ""
    };

    constructor() {
        super();

        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
    }

    validate = values => {
        const errors = required(["email", "password"], values, this.props);

        if (!errors.email) {
            const emailError = email(values.email, values, this.props);
            if (emailError) {
                errors.email = email(values.email, values, this.props);
            }
        }

        return errors;
    };

    successRedirect = () => {
        setIsAuthenticated(true);
        this.setState({redirectTo: "/"})
    }

    submit = (values, props) => {
        this.setState({ emailError: "", errorSnackBarOpen: false });
        const email = values.email;
        const password = values.password;

        app.auth()
            .fetchSignInMethodsForEmail(email)
            .then(providers => {
                if (
                    providers.length !== 0 &&
                    providers.indexOf("password") === -1
                ) {
                    this.setState({
                      errorSnackBarOpen: true,
                      errorMessage:
                            "This email is already connected to either a Facebook or Google login"
                    });
                } else {
                    app.auth()
                        .signInWithEmailAndPassword(email, password)
                        .then((result, error) => {
                            if (error) {
                                this.setState({ errorSnackBarOpen: true,
                                  errorMessage:
                                      "Username/password doesn't match, or the user doesn't exist" });
                            } else {
                                this.successRedirect();
                            }
                        })
                        .catch(error => {
                            this.setState({
                                errorSnackBarOpen: true,
                                errorMessage:
                                    "Username/password doesn't match, or the user doesn't exist"
                            });
                        });
                }
            });
    };

    authWithGoogle = () => {
        app.auth()
            .signInWithPopup(googleProvider)
            .then((result, error) => {
                if (error) {
                    this.setState({ errorSnackBarOpen: true,
                      errorMessage:
                          "Username/password doesn't match, or the user doesn't exist" });
                } else {

                    this.successRedirect();
                }
            });
    };

    authWithFacebook = () => {
        app.auth()
            .signInWithPopup(facebookProvider)
            .then((result, error) => {
                if (error) {
                    this.setState({
                      errorSnackBarOpen: true,
                      errorMessage:
                          "Username/password doesn't match, or the user doesn't exist"
                    });
                } else {
                    this.successRedirect();
                }
            });
    };

    toggleError = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      this.setState({errorSnackBarOpen: false});
    } 

    render() {
        const { classes, isAuthenticated } = this.props;
        const { redirectTo, sent, errorSnackBarOpen, errorMessage } = this.state;
        
        if(redirectTo || isAuthenticated) 
            return <Redirect to={redirectTo}></Redirect>


        return (
            <React.Fragment>
                <Snackbar open={errorSnackBarOpen} message={errorMessage} handleClose={this.toggleError}></Snackbar>
                <AppAppBar />
                <AppForm > 
                    <React.Fragment>
                        <Typography
                            variant="h3"
                            gutterBottom
                            marked="center"
                            align="center"
                        >
                            Sign In
                        </Typography>
                        <Typography variant="body2" align="center">
                            {"Not a member yet? "}
                            <Link
                                href="/premium-themes/onepirate/sign-up"
                                align="center"
                                underline="always"
                            >
                                Sign Up here
                            </Link>
                        </Typography>
                    </React.Fragment>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around", marginBottom: 10, marginTop: 10}}>
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
                          Sign in with facebook
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
                          Sign in with Google
                      </Button>
                    </div>
                    
                    <div style={{textAlign: "center"}}>
                      Or
                    </div>
                    

                    <Form
                        onSubmit={this.submit}
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
                                    autoFocus
                                    component={RFTextField}
                                    disabled={submitting || sent}
                                    fullWidth
                                    label="Email"
                                    ref={this.emailRef}
                                    margin="normal"
                                    name="email"
                                    required
                                    size="large"
                                />
                                <Field
                                    fullWidth
                                    size="large"
                                    component={RFTextField}
                                    disabled={submitting || sent}
                                    required
                                    ref={this.passwordRef}
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
                                    size="large"
                                    color="secondary"
                                    fullWidth
                                >
                                    {submitting || sent
                                        ? "In progress…"
                                        : "Sign In"}
                                </FormButton>
                            </form>
                        )}
                    </Form>

                    
                    <Typography align="center">
                        <Link underline="always" href="/forgot-password">
                            Forgot password?
                        </Link>
                    </Typography>
                </AppForm>
                <AppFooter />
            </React.Fragment>
        );
    }
}

SignIn.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}


export default compose(
    withRoot,
    withStyles(styles),
    connect(mapStateToProps)
)(SignIn);
