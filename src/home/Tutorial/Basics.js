import React, { PureComponent } from "react";
import Typography from "../modules/components/Typography";
import LayoutBody from "../modules/components/LayoutBody";
export default class Basic extends PureComponent {
    render() {
        return (
            <LayoutBody margin marginBottom>
                <Typography
                    variant="h3"
                    gutterBottom
                    marked="center"
                    align="center"
                >
                Basics
                </Typography>

                Basic tutorial will be added soon!
            </LayoutBody>
        );
    }
}
