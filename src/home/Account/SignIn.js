import React, { PureComponent } from 'react'
import SignInForm from './SignInForm'
import AppFooter from "../modules/views/AppFooter";
import AppAppBar from "../modules/views/AppAppBar";
import { Redirect } from 'react-router-dom'
 

export default class SignIn extends PureComponent {
    state = {redirectTo: ""};
    move = () => {
        this.setState({redirectTo: "/sign-up"})
    }

    render() {
        if(this.state.redirectTo || this.props.isAuthenticated)
            return <Redirect to={this.state.redirectTo || "/"}></Redirect>

        return (
            <React.Fragment>
                <AppAppBar></AppAppBar>
                <SignInForm success={this.move} move={this.move}></SignInForm>
                <AppFooter></AppFooter>
            </React.Fragment>
        )
    }
}
