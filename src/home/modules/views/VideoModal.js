import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing(120),
    height: theme.spacing(70),

    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
});

class VideoModal extends React.Component {


  render() {
    const { classes, open, item } = this.props;
    const src = open ? item.src : "";
    return (
        <Modal
          open={this.props.open}
          onClose={this.props.close}
        >
          <div style={getModalStyle()} className={classes.paper}>
                <iframe
                    src={'https://www.youtube.com/embed/' + src}
                    width="100%" 
                    height="100%"
                    frameBorder='0'
                    allow='autoplay; encrypted-media'
                    allowFullScreen
                    title='video'
                ></iframe>
          </div>
        </Modal>
    );
  }
}

VideoModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(VideoModal);

export default SimpleModalWrapped;