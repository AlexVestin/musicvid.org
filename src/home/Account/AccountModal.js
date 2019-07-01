import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const modalStyle = {
    top: `25%`,
    left: `25%`,
    transform: `translate(0, -25%)`,
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 800,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
}));

export default function SimpleModal(props) {


  const handleClose = () => {
    props.close();
  };
  const classes = useStyles();

  return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
            {props.children}
        </div>
      </Modal>
  );
}