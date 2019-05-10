import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import { setIsAuthenticated, setIsFetching } from "fredux/actions/auth"
import { app } from 'backend/firebase'
class Logout extends PureComponent {
    state = { 
        redirect: false
    }

    componentDidMount() {
        app.auth().signOut().then((user) => {
            this.setState({redirect: true})
            setIsAuthenticated(false);
        })
    }

    render() {
        if(this.state.redirect)
            return <Redirect to="/"></Redirect>

        return(
            <div>Logging out</div>
        )
    }
}

export default Logout;