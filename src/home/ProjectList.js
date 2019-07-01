import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ReactComponent as Delete } from "editor/components/automation/baseline-delete-24px.svg";

import Typography from "./modules/components/Typography";
import Button from "./modules/components/Button";

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import { connect } from "react-redux";
import { app, base, storage } from "backend/firebase";
import classes from './ProjectList.module.css'
import RemoveDialog from './RemoveDialog'

function FolderList(props) {
  return (
    <List className={classes.root}>

    {props.projects.map(project => {
      const time = project.lastEdited.split("(")[0];
        return(
         <ListItem key={project.id} style={{borderBottom: "1px solid rgba(255,255,255,0.67)"}} button dense className={props.listItemClass} onClick={() => props.onSelect(project)}>
            <ListItemText style={{color:props.c1}} primary={project.name} secondary={time} />
            
            {!props.hideRemoveAction && 
            <ListItemSecondaryAction>
              <Delete
                onClick={() => props.onRemove(project)}
                fill="red"
                style={{color:"red", cursor: "pointer"}}
              />
          </ListItemSecondaryAction>}
       </ListItem>
        )
    })}
     
    </List>
  );
}

class ProjectList extends React.PureComponent {

  state = { loaded: false, projects: [], redirectTo: "", modalOpen: false, message: "Loading Projects...", error: false };
   getProjects = async () => {
    this.setState({message: "Loading projects...", error: false});
    let snapshot;
      try {
        snapshot = await base
        .collection("users")
        .doc(app.auth().currentUser.uid)
        .collection("projects")
        .get();
      } catch(err) {
        this.setState({message: "Error ocurred while loading projects.", error: true})
        return;
      }
     
      this.setState({ projects: snapshot.docs.map(doc => doc.data()), loaded: true, error: false});
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

  handleRemove = async (project) => {

   
    const p1 = base.collection("users")
      .doc(app.auth().currentUser.uid)
      .collection("projects")
      .doc(project.id)
      .delete()
    
    const p2 = base.collection("projects").doc(project.id).delete();
    const p3 = base.collection("featured").doc("all").collection("projects").doc(project.id).delete();
  
    Promise.all([p1, p2, p3]).then(() => {
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
    const c1 = this.props.color === "dark" ? "#333" : "#efefef";
    const c2 = this.props.color === "dark" ? "#333" : "#efefef";

    return( 
      <React.Fragment>
        <RemoveDialog project={this.state.projectToRemove} open={this.state.modalOpen} handleYes={this.handleRemove} handleNo={this.handleCancel}></RemoveDialog>
      <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          {this.state.projects.length === 0 ?
          <React.Fragment>
          {!this.state.loaded ?
              <div style={{textAlign: "center"}}>
                <Typography style={{color: c1}} variant="h6">{this.state.message}</Typography>   
                
                {this.state.error && <Button color="secondary" onClick={this.getProjects}>Try again</Button>}
              </div>
              :
              <Typography style={{color: c1}} variant="h6">You don't currently have any projects! You can make a new one in the editor</Typography>   
              }
          </React.Fragment>
          :
          <FolderList
            c1={c1}
            c2={c2}
            listItemClass={this.props.color === "dark" ? classes.listItemDark : classes.listItemLight}
            hideRemoveAction={this.props.hideRemoveAction}
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