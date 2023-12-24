import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import { FormattedMessage } from "react-intl";
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientForDoctor, postSendRemedy } from "../../../services/userService";
import moment from "moment";
import { LANGUAGES } from "../../../utils";
import "./RemedyModal.scss";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from 'react-loading-overlay';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false,
        };
    }

    async componentDidMount() {
        this.getDataPatient();
    }

    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();
        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formatedDate
        });
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => await this.getDataPatient())
    }

    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientBookingData.email,
            timeType: item.timeType,
            patientName: item.patientBookingData.firstName
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        });
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: ''
        });
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        this.setState({
            isShowLoading: true
        });
        let res = await postSendRemedy({
            ...dataChild, // email imageBase64
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName
        });
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            });
            toast.success('Send remedy success!');
            this.closeRemedyModal();
            await this.getDataPatient();
        } else {
            toast.error('Something wrong!');
            console.log('Error:', res)
        }
    }

    render() {
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        let { language } = this.props;
        return (
            <Fragment>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'
                >
                    <div className="manage-patient-container">
                        <div className="title">
                            <FormattedMessage id='menu.doctor.manage-patient' />
                        </div>
                        <div className="manage-patient-body row" >
                            <div className="col-md-4 form-group">
                                <label><FormattedMessage id='menu.doctor.select-day' /></label>
                                <DatePicker
                                    className='form-control'
                                    value={this.state.currentDate}
                                    onChange={this.handleOnChangeDatePicker}
                                />
                            </div>
                            <div className="col-md-12 table-manage-patient">
                                <label></label>
                                <table>
                                    <thead>
                                        <tr>
                                            <th><FormattedMessage id='menu.doctor.serial' /></th>
                                            <th><FormattedMessage id='menu.doctor.time-booking' /></th>
                                            <th><FormattedMessage id='menu.doctor.name' /></th>
                                            <th><FormattedMessage id='menu.doctor.address' /></th>
                                            <th><FormattedMessage id='menu.doctor.gender' /></th>
                                            <th colSpan="2"><FormattedMessage id='menu.doctor.action' /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataPatient && dataPatient.length > 0 ?
                                            <>
                                                {
                                                    dataPatient.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{language === LANGUAGES.VI ? item.timeTypeBookingData.valueVi : item.timeTypeBookingData.valueEn}</td>
                                                                <td>{item.patientBookingData.firstName}</td>
                                                                <td>{item.patientBookingData.address}</td>
                                                                <td>{language === LANGUAGES.VI ? item.patientBookingData.genderData.valueVi : item.patientBookingData.genderData.valueEn}</td>
                                                                <td>
                                                                    <button className="btn-confirm" onClick={() => this.handleBtnConfirm(item)}>Xác nhận</button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </>
                                            :
                                            <tr>
                                                <td colSpan='6' style={{ textAlign: 'center' }}><FormattedMessage id='menu.doctor.not-found' /></td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
                </LoadingOverlay>
            </Fragment >
        );
    }
};

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);