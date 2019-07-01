import React from "react";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import AppFooter from "./modules/views/AppFooter";
import AppAppBar from "./modules/views/AppAppBar";
import LayoutBody from "./modules/components/LayoutBody";
import Button from "./modules/components/Button";
import { Redirect } from "react-router-dom";

class ErrorComponent extends React.PureComponent {
    state = { redirectTo: "" };

    redirect = () => {
        this.setState({ redirectTo: "/" });
    };
    render() {
        const { message, title, code } = this.props;
        const { redirectTo } = this.state;

        if (redirectTo) {
            return <Redirect to={redirectTo} />;
        }

        const err = message === "" && title === "" && code === "";
        let m = message;
        let t = `A fatal error ocurred with the code:  ${
            this.props.code
        }, and message:`;
        if (err) {
            t = "Dedicated error page";
            m = "There doesn't seem to be an error here";
        }

        return (
            <React.Fragment>
                <LayoutBody margin marginBottom>
                    <AppAppBar />
                    <ListItem
                        style={{
                            justifyContent: "center",
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <Typography component="h4" variant="h4">
                            {t}
                        </Typography>
                        <Typography>{m}</Typography>
                        {!err && (
                            <a href="https://discord.gg/Qf7y579">
                                Tell developer about the issue
                            </a>
                        )}
                        <Button onClick={this.redirect} color="secondary">
                            Back to main page
                        </Button>
                    </ListItem>
                </LayoutBody>
                <AppFooter />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        code: state.error.code,
        message: state.error.message,
        title: state.error.title
    };
};

export default connect(mapStateToProps)(ErrorComponent);
