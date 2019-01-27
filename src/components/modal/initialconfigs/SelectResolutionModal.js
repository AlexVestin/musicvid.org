import React, { PureComponent } from 'react'
import Modal from 'react-modal'
import classes from './SelectResolutionModal.module.scss';
import Resolution from './Resolution'
import LoadAudio from './LoadAudio'
import ItemsModal from './ItemsModal'


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10, 
    }
};

export default class SelectResolutionModal extends PureComponent {

    constructor(props) {
        super(props);

        this.onParentSelect = props.onSelect;
        this.state = { modalOpen: true, index: 0}
    }

    getDimensions = (object) => { return { width: Number(object.res.split("x")[0]), height: Number(object.res.split("x")[1]) } }
    toggleModal = (idx) => {
        let i = idx ? idx : this.state.index;
        this.setState({ modalOpen: !this.state.modalOpen, index: i });
    }

    onSelectResolution = (resolution) => {
        this.resolution = resolution;
        this.setState({index:  1});
    }

    onSelect = (info) => {
        this.onParentSelect(info);
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
                    {this.state.index === 1 && <LoadAudio onSelect={(audio) => this.onSelect({audio: audio, resolution: this.resolution})}></LoadAudio> }
                    {this.state.index === 2 && <ItemsModal onSelect={this.onSelect}></ItemsModal> }

                </div>
            </Modal>
        )
    }
}
