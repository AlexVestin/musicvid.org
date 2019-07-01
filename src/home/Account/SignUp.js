import React, { PureComponent } from 'react'
import SignUpForm from './SignUpForm'
import AppFooter from "../modules/views/AppFooter";
import AppAppBar from "../modules/views/AppAppBar";
import { Redirect } from 'react-router-dom'

export default class SignIn extends PureComponent {
    state = {redirectTo: ""};
    move = () => {
        this.setState({redirectTo: "/"})
    }


    render() {
        if(this.state.redirectTo || this.props.isAuthenticated)
            return <Redirect to={this.state.redirectTo || "/"}></Redirect>

        return (
            <React.Fragment>
                <AppAppBar></AppAppBar>
                <SignUpForm success={this.move} move={this.move}></SignUpForm>
                <AppFooter></AppFooter>
            </React.Fragment>
        )
    }
}
