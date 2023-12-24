import React, { Component, Fragment } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { CommonUtils, LANGUAGES } from "../../../utils";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import localization from 'moment/locale/vi';


class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imageBase64: ''
        };
    }

    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            });
        }
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            });
        }
    }

    closeRemedyModal = () => {
        this.setState({
            closeRemedyModal: !this.state.closeRemedyModal
        });
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file); //encode
            this.setState({
                imageBase64: base64
            });
        }
    }

    handleSendRemedy = () => {
        this.props.sendRemedy(this.state);
    }

    render() {
        let { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = this.props;
        return (
            <Fragment>
                <Modal isOpen={isOpenModal} className={'booking-modal-container'} size={'md'} centered>
                    <ModalHeader>Gửi hoá đơn khám bệnh</ModalHeader>
                    <ModalBody>
                        <div className="form-row">
                            <div className="col-md-6 fomr-group">
                                <label>Email bệnh nhân</label>
                                <input className="form-control" type="email" value={this.state.email}
                                    onChange={(event) => this.handleOnChangeEmail(event)} />
                            </div>
                            <div className="col-md-6 form-group">
                                <label>Chọn File hoá đơn</label>
                                <input type="file" onChange={(event) => this.handleOnChangeImage(event)} />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.handleSendRemedy()}>Send</Button>{' '}
                        <Button color="secondary" onClick={closeRemedyModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </Fragment >
        );
    }
};

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGender: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);