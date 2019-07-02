import React, { PureComponent } from 'react'
import SignInForm from './SignInForm'
import AppFooter from "../modules/views/AppFooter";
import AppAppBar from "../modules/views/AppAppBar";
import { Redirect } from 'react-router-dom'
import { setSnackbarMessage } from '../../fredux/actions/message';
 

export default class SignIn extends PureComponent {
    state = {redirectTo: ""};
    move = () => {
        this.setState({redirectTo: "/sign-up"})
    }
    success = () => {
        setSnackbarMessage('Login succeeded!');
        this.setState({redirectTo: "/"})
    }

    render() {
        if(this.state.redirectTo || this.props.isAuthenticated)
            return <Redirect to={this.state.redirectTo || "/"}></Redirect>

        return (
            <React.Fragment>
                <AppAppBar></AppAppBar>
                <SignInForm success={this.success} move={this.move}></SignInForm>
                <AppFooter></AppFooter>
            </React.Fragment>
        )
    }
}
