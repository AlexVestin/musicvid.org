import React, { PureComponent } from 'react'
import classes from './SelectResolutionModal.module.scss';
import Resolution from './Resolution'
import LoadImage from './LoadImage' 
import AudioModal from './AudioModal'
import LicenseModal from './LicenseModal'
import AddItemModal from './AddItemModal'
import AddSceneModal from './AddSceneModal'

export default class SelectResolutionModal extends PureComponent {

    constructor(props) {
        super(props);

        this.onParentSelect = props.onSelect;
        this.state = { modalOpen: false, index: 0}
    }

    reject = () => {
        this.licenseReject();
        this.setState({modalOpen: false});
    }

    accept = () => {
        this.licenseAgree();
        this.setState({modalOpen: false});
    }

    openLicenseModal = (items, resolve, reject) => {
        this.__items = items;
        this.licenseAgree = resolve;
        this.licenseReject = reject;
        this.setState({index: 4, modalOpen: true});
    }

    getDimensions = (object) => { 
        return { width: Number(object.res.split("x")[0]), height: Number(object.res.split("x")[1]) } 
    }
    
    async toggleModal(idx, open) {

        this.currentPromise = new Promise((resolve, reject) => {
            let i = idx ? idx : this.state.index;
            let o = open ? open : !this.state.modalOpen;
            this.setState({ modalOpen: o, index: i });
            this.onParentSelect = resolve;
        })

        return this.currentPromise;
    }

    onSelect = (info) => {
        
        this.setState({modalOpen: false})
        this.onParentSelect(info);
    }
    render() {
        const { modalOpen, index } = this.state;
        console.log((index >4 && index < 8) )
        return (    

                <div className={classes.container}>
                    {index === 1 && <AudioModal open={modalOpen} onSelect={this.onSelect}></AudioModal> }
                    {index === 0 && <Resolution open={modalOpen} onSelect={this.onSelect}></Resolution> }
                    {index === 3 && <LoadImage  open={modalOpen} onSelect={this.onSelect}></LoadImage> }
                    {index === 4 && <LicenseModal open={modalOpen} items={this.__items} accept={this.accept} reject={this.reject}></LicenseModal> }
                    {(index >4 && index < 8) && <AddItemModal open={modalOpen} onSelect={this.onSelect} index={index - 5}></AddItemModal>}
                    {index === 8 && <AddSceneModal open={modalOpen} onSelect={this.onSelect} index={index - 5}></AddSceneModal>}


                </div>
        )
    }
}
