import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ReactComponent as Delete } from "editor/components/automation/baseline-delete-24px.svg";

import Typography from "./modules/components/Typography";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import { connect } from "react-redux";
import { app, base } from "backend/firebase";
import classes from './ProjectList.module.css'


import RemoveDialog from './RemoveDialog'



function FolderList(props) {


  return (
    <List className={classes.root}>

    {props.projects.map(project => {
      const time = project.lastEdited.split("(")[0];
        return(
         <ListItem key={project.id} style={{borderBottom: "1px solid rgba(255,255,255,0.67)"}} button dense className={classes.listItem} onClick={() => props.onSelect(project)}>
            <ListItemText style={{color:"white"}} primary={project.name} secondary={time} />
            <ListItemSecondaryAction>
              <Delete
                onClick={() => props.onRemove(project)}
                fill="red"
                style={{color:"red", cursor: "pointer"}}
              />
          </ListItemSecondaryAction>
       </ListItem>
        )
    })}
     
    </List>
  );
}

class ProjectList extends React.PureComponent {

  state = { loaded: false, projects: [], redirectTo: "", modalOpen: false, message: "Loading Projects..." };
  async getProjects() {
      const snapshot = await base
          .collection("users")
          .doc(app.auth().currentUser.uid)
          .collection("projects")
          .get();
      this.setState({ projects: snapshot.docs.map(doc => doc.data()), loaded: true});
  }

  componentDidMount() {
      if (!this.loaded && this.props.isAuthenticated) {
          this.getProjects();
      }else if(!this.props.authFetching && !this.props.isAuthenticated) {
        this.setState({message:  "Please sign in to view your projects"})
      }
  }

  componentWillReceiveProps(props) {
      if (props.isAuthenticated && !this.state.loaded) {
          this.getProjects();
      }
  }

  handleRemove = (project) => {
    base.collection("users")
      .doc(app.auth().currentUser.uid)
      .collection("projects")
      .doc(project.id)
      .delete()
      .then(() => {
        const projects = [...this.state.projects].filter(p => p.id !== project.id);
        this.setState({projects, loaded: true, project: null, modalOpen: false})
      }) 
  }

  handleCancel = () => {
    this.setState({ loaded: true, project: null, modalOpen: false})
  }

  removeProject = (project) => {
    this.setState({modalOpen: true, projectToRemove: project});
  }

  render() {
    return( 
      <React.Fragment>
        <RemoveDialog project={this.state.projectToRemove} open={this.state.modalOpen} handleYes={this.handleRemove} handleNo={this.handleCancel}></RemoveDialog>
      <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          {this.state.projects.length === 0 ?
          <React.Fragment>
          {!this.state.loaded ?
              <Typography style={{color: "#efefef"}} variant="h6">{this.state.message}</Typography>   
              :
              <Typography style={{color: "#efefef"}} variant="h6">You don't currently have any projects! You can make a new one in the editor</Typography>   
              }
          </React.Fragment>
          :
          <FolderList
            projects={this.state.projects}
            onSelect={this.props.loadProject}
            onRemove={this.removeProject}
        />
      }
    
      </div>
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => {
  return {
      isAuthenticated: state.auth.isAuthenticated,
      authFetching: state.auth.fetching
  };
};

export default connect(mapStateToProps)(ProjectList);