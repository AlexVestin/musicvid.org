import React from "react";

// --- Post bootstrap -----
import AppAppBar from "./modules/views/AppAppBar";
import AppFooter from "./modules/views/AppFooter";
import CommunityProjects from "./modules/views/CommunityProjects";
import EditProject from './modules/views/EditProject'
class Community extends React.PureComponent {

    state = {editProject: false, project: {}}

    editProject = (project, imgsrc) => {
        this.setState({editProject: true, project: project, imgSrc: imgsrc})
    }

    back = () => {
        this.setState({project: {}, editProject: false})
    }

    render() {
        return (
            <React.Fragment>
                <AppAppBar />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >

                {
                    this.state.editProject ? 
                        <EditProject back={this.back} project={this.state.project} imgSrc={this.state.imgSrc}></EditProject>
                    :
                        <CommunityProjects editProject={this.editProject}/>
                }
                    
                </div>
                <AppFooter />
            </React.Fragment>
        );
    }
}



export default Community;

