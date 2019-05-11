import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';

const styles = theme => ({
  root: {
    width: '100%',

    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
      margin: 10
  },
  listItem: {
      borderBottom: "1px solid rgba(12,12,12,0.12)"
  }
});

function FolderList(props) {
  const { classes } = props;
  return (
    <List className={classes.root}>

    {props.projects.map(project => {
        return(
         <ListItem key={project.id} button dense className={classes.listItem} onClick={() => props.onSelect(project)}>
            <Avatar className={classes.avatar}>
            <WorkIcon />
            </Avatar>
            <ListItemText primary={project.name} secondary={project.lastEdited} />
       </ListItem>
        )
    })}
     
    </List>
  );
}

FolderList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FolderList);