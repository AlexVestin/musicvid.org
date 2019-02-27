import React, { PureComponent } from 'react'
import classes from './SelectResolutionModal.module.scss';
import Resolution from './Resolution'
import LoadImage from './LoadImage' 
import AudioModal from './AudioModal'
import LicenseModal from './LicenseModal'


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

    getDimensions = (object) => { return { width: Number(object.res.split("x")[0]), height: Number(object.res.split("x")[1]) } }
    toggleModal = (idx, open) => {
        let i = idx ? idx : this.state.index;
        let o = open ? open : !this.state.modalOpen;
        this.setState({ modalOpen: o, index: i });
    }

    onSelect = (info) => {
        
        this.toggleModal();
        if(info)
            this.onParentSelect(info);
    }
    render() {
        const { modalOpen } = this.state;
        return (    

                <div className={classes.container}>
                    {this.state.index === 1 && <AudioModal open={modalOpen} onSelect={(res) => this.onSelect(res)}></AudioModal> }
                    {this.state.index === 0 && <Resolution open={modalOpen} onSelect={(res) => this.onSelect(res)}></Resolution> }
                    {this.state.index === 3 && <LoadImage  open={modalOpen} onSelect={this.onSelect}></LoadImage> }
                    {this.state.index === 4 && <LicenseModal items={this.__items} open={modalOpen} accept={this.accept} reject={this.reject}></LicenseModal> }

                </div>
        )
    }
}
