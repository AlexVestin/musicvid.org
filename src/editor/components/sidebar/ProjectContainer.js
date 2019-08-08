import React, { PureComponent } from "react";
import ProjectList from "home/ProjectList";
import ProjectThumbnails from "./ProjectThumbnails";
import ListIcon from "@material-ui/icons/List";
import GridOn from "@material-ui/icons/GridOn";

export default class ProjectContainer extends PureComponent {
    state = { index: 1 };

    render() {
        const { index } = this.state;
        return (
            <div>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start"
                    }}
                >
                    <GridOn
                        style={{
                            cursor: "pointer",
                            color: index === 1 ? "white" : "gray"
                        }}
                        onClick={() => this.setState({ index: 1 })}
                    >
                        Thumbnails
                    </GridOn>
                    <ListIcon
                        style={{
                            cursor: "pointer",
                            color: index === 0 ? "white" : "gray"
                        }}
                        onClick={() => this.setState({ index: 0 })}
                    >
                        List
                    </ListIcon>
                </div>
                {index === 0 && (
                    <ProjectList loadProject={this.props.loadProject} />
                )}
                {index === 1 && (
                    <ProjectThumbnails loadProject={this.props.loadProject} />
                )}
            </div>
        );
    }
}
