import React, { PureComponent } from "react";
import classes from "./ModalContainer.module.scss";
import Resolution from "./Resolution";
import LoadImage from "./LoadImage";
import AudioModal from "./AudioModal";
import LicenseModal from "./LicenseModal";
import AddItemModal from "./AddItemModal";
import AddSceneModal from "./AddSceneModal";
import LongAudioWarningModal from "./LongAudioWarningModal";
import AutomationsModal from "./Automations/AutomationsModal";
import AddNewAutomation from './Automations/AddNewAutomationModal'



export default class ModalContainer extends PureComponent {
    constructor(props) {
        super(props);

        this.onParentSelect = props.onSelect;
        this.state = { modalOpen: false, index: 0 };
    }

    reject = () => {
        this.licenseReject();
        this.setState({ modalOpen: false });
    };

    accept = () => {
        this.licenseAgree();
        this.setState({ modalOpen: false });
    };

    openLicenseModal = (items, usingSampleAudio, resolve, reject) => {
        this.__items = items;
        this.__usingSampleAudio = usingSampleAudio;
        this.licenseAgree = resolve;
        this.licenseReject = reject;
        this.setState({ index: 4, modalOpen: true });
    };

    getDimensions = object => {
        return {
            width: Number(object.res.split("x")[0]),
            height: Number(object.res.split("x")[1])
        };
    };

    async toggleModal(idx, open, args=null) {
        this.currentPromise = new Promise((resolve, reject) => {
            let i = idx ? idx : this.state.index;
            let o = open ? open : !this.state.modalOpen;
            if(args)
                this.args=args;
            this.setState({ modalOpen: o, index: i });
            this.onParentSelect = resolve;
        });

        return this.currentPromise;
    }

    onSelect = info => {
        this.setState({ modalOpen: false });
        this.onParentSelect(info);
    };
    render() {
        const { modalOpen, index } = this.state;

        return (
            <div className={classes.container}>
                {index === 1 && (
                    <AudioModal open={modalOpen} onSelect={this.onSelect} />
                )}
                {index === 0 && (
                    <Resolution open={modalOpen} onSelect={this.onSelect} />
                )}
                {index === 3 && (
                    <LoadImage open={modalOpen} onSelect={this.onSelect} />
                )}
                {index === 4 && (
                    <LicenseModal
                        usingSampleAudio={this.__usingSampleAudio}
                        open={modalOpen}
                        items={this.__items}
                        accept={this.accept}
                        reject={this.reject}
                    />
                )}
                {index > 4 && index < 8 && (
                    <AddItemModal
                        open={modalOpen}
                        onSelect={this.onSelect}
                        index={index - 5}
                    />
                )}
                {index === 8 && (
                    <AddSceneModal
                        open={modalOpen}
                        onSelect={this.onSelect}
                        index={index - 5}
                    />
                )}

                {index === 10 && (
                    <LongAudioWarningModal
                        open={modalOpen}
                        onSelect={this.onSelect}
                    />
                )}

                {index === 11 &&  (
                    <AutomationsModal
                        open={modalOpen}
                        onSelect={this.onSelect}
                        gui={this.props.gui}
                        item={this.args}
                        index={index - 5}
                    />
                )}

                {index === 12 &&  (
                    <AutomationsModal
                        mainMenu={true}
                        open={modalOpen}
                        onSelect={this.onSelect}
                        gui={this.props.gui}
                        item={this.args}
                        index={index - 5}
                    />
                )}

                {index === 13 &&  (
                    <AddNewAutomation
                        open={modalOpen}
                        onSelect={this.onSelect}
                        gui={this.props.gui}
                    />
                )}
            </div>
        );
    }
}
