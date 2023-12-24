import React, { Component, Fragment } from "react";
import { Modal } from 'reactstrap';
import { connect } from "react-redux";
import "./BookingModal.scss";
import ProfileDoctor from "../../Patient/Doctor/ProfileDoctor";
import _ from "lodash";
import DatePicker from '../../../components/Input/DatePicker';
import Select from "react-select";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import { postPatientBookAppointment } from "../../../services/userService";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import localization from 'moment/locale/vi';
import LoadingOverlay from 'react-loading-overlay';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: '',
            doctorId: '',
            timeType: '',
            date: '',

            genders: '',
            isShowLoading: false
        };
    }

    async componentDidMount() {
        this.props.getGender();
    }

    buldDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            })
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            this.setState({
                genders: this.buldDataGender(this.props.genders)
            })
        }
        if (prevProps.genders !== this.props.genders) {
            this.setState({
                genders: this.buldDataGender(this.props.genders)
            })
        }
        if (prevProps.dataTimeModal !== this.props.dataTimeModal) {
            if (this.props.dataTimeModal && !_.isEmpty(this.props.dataTimeModal)) {
                let doctorId = this.props.dataTimeModal.doctorId;
                let timeType = this.props.dataTimeModal.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    // gender
    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption
        });
    }
    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            let dateVi = moment.unix(+dataTime.date / 1000).format('dddd, DD/MM/YYYY');
            let dateEn = moment.unix(+dataTime.date / 1000).locale('en').format('ddd, MM/DD/YYYY');
            let date = language === LANGUAGES.VI ?
                `${this.capitalizeFirstLetter(dateVi)}`
                :
                `${dateEn}`;

            return `${date} - ${time}`;
        }
        return ``;
    }

    handleConfirmBooking = async () => {
        // validate input
        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.dataTimeModal);
        let doctorName = this.buildDoctorName(this.props.dataTimeModal);
        this.setState({
            isShowLoading: true
        });
        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataTimeModal.date,
            birthday: date,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            selectedGender: this.state.selectedGender.value,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        });
        this.setState({
            isShowLoading: false
        });
        if (res && res.errCode === 0) {
            this.props.isCloseModal();
            toast.success('Booking a new appointment success');
        } else {
            toast.error('Booking failed');
        }
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ?
                `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                :
                `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            return name;
        }
        return '';
    }

    render() {
        let { language, isOpenModal, isCloseModal, dataTimeModal } = this.props;
        let doctorId = '';
        if (dataTimeModal && !_.isEmpty(dataTimeModal)) {
            doctorId = dataTimeModal.doctorId;
        }
        return (
            <Fragment>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'
                >
                    <Modal isOpen={isOpenModal} className={'booking-modal-container'} size={'lg'} centered> {/* backdrop={'static'} */}
                        <div className="booking-modal-content">
                            <div className="booking-modal-header">
                                <span className="left"><FormattedMessage id='patient.booking-modal.title-modal' /></span>
                                <span className="right" onClick={isCloseModal}><i className="fas fa-times"></i></span>
                            </div>
                            <div className="booking-modal-body container">
                                {/* convert json => string */}
                                {/* {JSON.stringify(dataTimeModal)}  */}
                                <div className="doctor-infor">
                                    <ProfileDoctor
                                        doctorIdModal={doctorId}
                                        isShowDescriptionDoctorModal={false}
                                        dataTimeModal={dataTimeModal}
                                        isShowLinkDetail={false}
                                        isShowPrice={true}
                                    />
                                </div>
                                <div className="price"></div>
                                <div className="form-row">
                                    <div className="col-md-6 form-group">
                                        <label><FormattedMessage id='patient.booking-modal.fullName' /></label>
                                        <input type="text" className="form-control"
                                            value={this.state.fullName}
                                            onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                            placeholder={language === LANGUAGES.VI ? 'Nguyễn Văn A' : 'Van A Nguyen'}
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label><FormattedMessage id='patient.booking-modal.phoneNumber' /></label>
                                        <input type="text" className="form-control"
                                            value={this.state.phoneNumber}
                                            onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                            placeholder={language === LANGUAGES.VI ? 'Nhập số điện thoại' : 'Your phone number'}
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label><FormattedMessage id='patient.booking-modal.email' /></label>
                                        <input type="email" className="form-control"
                                            value={this.state.email}
                                            onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                            placeholder={language === LANGUAGES.VI ? 'nguyenvana@gmail.com' : 'vananguyen@gmail.com'}
                                        />
                                    </div>
                                    <div className="col-md-6 form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label><FormattedMessage id='patient.booking-modal.gender' /></label>
                                        <Select
                                            value={this.state.selectedGender}
                                            options={this.state.genders}
                                            onChange={this.handleChangeSelect}
                                            placeholder={language === LANGUAGES.VI ? 'Chọn giới tính' : 'Select your gender'}
                                        />
                                    </div>
                                    <div className="col-md-4 form-group">
                                        <label><FormattedMessage id='patient.booking-modal.birthday' /></label>
                                        <DatePicker
                                            className='form-control'
                                            value={this.state.birthday}
                                            onChange={this.handleOnChangeDatePicker}
                                            placeholder={language === LANGUAGES.VI ? 'Chọn ngày sinh' : 'Select your birthday'}
                                        />
                                    </div>
                                    <div className="col-md-8 form-group">
                                        <label><FormattedMessage id='patient.booking-modal.address' /></label>
                                        <input type="text" className="form-control"
                                            value={this.state.address}
                                            onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                            placeholder={language === LANGUAGES.VI ? '12A Phạm Văn Đồng, Quận 9, Tp. Hồ Chí Minh' : '12A Pham Van Dong Street, district 9, Ho Chi Minh City'}
                                        />
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <label><FormattedMessage id='patient.booking-modal.reason' /></label>
                                        <input type="text" className="form-control"
                                            value={this.state.reason}
                                            onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                            placeholder={language === LANGUAGES.VI ? 'Bệnh thần kinh...' : 'Your reason'}
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className="booking-modal-footer">
                                <button className="btn-booking-confirm" onClick={() => this.handleConfirmBooking()}><FormattedMessage id='patient.booking-modal.btn-confirm' /></button>{' '}
                                <button className="btn-booking-cancel" onClick={isCloseModal}><FormattedMessage id='patient.booking-modal.btn-cancel' /></button>{' '}
                            </div>
                        </div>
                    </Modal>
                </LoadingOverlay>
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);