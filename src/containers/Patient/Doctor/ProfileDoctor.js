import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ProfileDoctor.scss";
import { getProfileDoctorByIdService } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import NumberFormat from "react-number-format";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import moment from "moment";
import localization from 'moment/locale/vi';
import { Link } from "react-router-dom";


class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {},
        };
    }

    async componentDidMount() {
        let data = await this.getInfoDoctor(this.props.doctorIdModal);
        this.setState({
            dataProfile: data
        });
    }

    getInfoDoctor = async (id) => {
        let result = [];
        if (id) {
            let res = await getProfileDoctorByIdService(id);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            // this.setState({

            // });
        }

        if (prevProps.doctorIdModal !== this.props.doctorIdModal) {
            // this.getInfoDoctor(this.props.doctorIdModal);
        }
    }

    renderProfileBooking = (dataProfile, language) => {
        if (dataProfile && !_.isEmpty(dataProfile)) {
            return (
                <>
                    {
                        dataProfile.positionData && language === LANGUAGES.VI &&
                        <>
                            {`${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`}
                        </>
                    }
                    {
                        dataProfile.positionData && language === LANGUAGES.EN &&
                        <>
                            {`${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`}
                        </>
                    }
                </>
            )
        }
        return <></>
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    renderTimeBooking = (dataTime, language) => {
        if (dataTime && !_.isEmpty(dataTime)) {
            let dateVi = moment.unix(+dataTime.date / 1000).format('dddd, DD/MM/YYYY');
            let dateEn = moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            let date = language === LANGUAGES.VI ?
                <>{`${this.capitalizeFirstLetter(dateVi)} - ${dataTime.timeTypeData.valueVi}`}</>
                :
                <>{`${dateEn} - ${dataTime.timeTypeData.valueEn}`}</>
            return <>{date}</>
        }
        return <></>
    }

    render() {
        let { language, isShowDescriptionDoctorModal, dataTimeModal, isShowLinkDetail, isShowPrice, doctorIdModal } = this.props;
        let { dataProfile } = this.state;
        let priceVi = '', priceEn = '';

        if (dataProfile && dataProfile.Doctor_Info) {
            priceVi = dataProfile.Doctor_Info.priceData.valueVi;
            priceEn = dataProfile.Doctor_Info.priceData.valueEn;
        }

        return (
            <Fragment>
                <div className="profile-doctor-container">
                    <div className='intro-doctor'>
                        <div className='content-left' style={{ backgroundImage: `url(${dataProfile.image})` }}></div>
                        <div className='content-right'>
                            <div className='text-up'>
                                {dataProfile.positionData && dataProfile.positionData.valueVi && dataProfile.positionData.valueEn
                                    &&
                                    <span>
                                        {this.renderProfileBooking(dataProfile, language)}
                                    </span>
                                }
                            </div>
                            <div className='text-down'>
                                {isShowDescriptionDoctorModal === true ?
                                    <>
                                        {dataProfile && dataProfile.Markdown &&
                                            <span>
                                                {dataProfile.Markdown.description}
                                            </span>
                                        }
                                    </>
                                    :
                                    <>
                                        <div className="time"><FormattedMessage id='patient.booking-modal.time' />
                                            {this.renderTimeBooking(dataTimeModal, language)}
                                        </div>
                                    </>
                                }
                            </div>
                            {isShowLinkDetail === true &&
                                <div className="view-detail-doctor">
                                    <Link to={`/detail-doctor/${doctorIdModal}`}>Xem thêm</Link>
                                    {/* <a href={`/detail-doctor/${doctorId}`}><FormattedMessage id='detail-specialty.view-more' /></a> */}
                                </div>
                            }
                            {isShowPrice === true &&
                                <div className="price"><FormattedMessage id='patient.booking-modal.price' />
                                    {language === LANGUAGES.VI ? <NumberFormat value={priceVi} displayType={'text'} thousandSeparator={true} suffix={`VNĐ`} /> : ''}
                                    {language === LANGUAGES.EN ? <NumberFormat value={priceEn} displayType={'text'} thousandSeparator={true} prefix={`$`} /> : ''}
                                </div>
                            }
                            <div className="free-booking"><FormattedMessage id='patient.booking-modal.free-booking' /></div>
                        </div>
                    </div>

                </div>
            </Fragment>
        );
    }
};

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);