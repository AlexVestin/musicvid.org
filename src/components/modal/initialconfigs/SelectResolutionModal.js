import React, { PureComponent } from 'react'
import Modal from 'react-modal'
import classes from './SelectResolutionModal.module.css';
import Resolution from './Resolution'
import LoadAudio from './LoadAudio'
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

export default class SelectResolutionModal extends PureComponent {

    constructor() {
        super();

        this.state = { modalOpen: true, index: 0}
    }

    getDimensions = (object) => { return { width: Number(object.res.split("x")[0]), height: Number(object.res.split("x")[1]) } }
    toggleModal = () => this.setState({ modalOpen: !this.state.modalOpen })

    onSelectResolution = (resolution) => {
        this.resolution = resolution;
        this.setState({index:  1})
    }

    onSelectAudio = (audio) => {
        this.props.onSelect({audio: audio, resolution: this.resolution})
        this.toggleModal();
    }
    render() {
        return (
            <Modal
                isOpen={this.state.modalOpen}
                onAfterOpen={this.afterOpenModal}
                contentLabel="Example Modal"
                style={customStyles}
            >
                <div className={classes.container}>
                    {this.state.index === 0 && <Resolution onSelect={this.onSelectResolution}></Resolution> }
                    {this.state.index === 1 && <LoadAudio onSelect={this.onSelectAudio}></LoadAudio> }
                </div>
            </Modal>
        )
    }
}
