import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './DoctorExtraInfor.scss';
import { getExtraInforDoctorByIdService } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format';
import { FormattedMessage } from 'react-intl';

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {},
            nameClinic: '',
            addressClinic: '',
            priceData: '',
            paymentData: '',
            note: ''
        };
    }

    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInforDoctorByIdService(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                });
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
        if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
            let res = await getExtraInforDoctorByIdService(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                });
            }
        }
    }

    handleShowOrHidden = (state) => {
        this.setState({
            isShowDetailInfor: state
        });
    }
    render() {
        let { language } = this.props;
        let { isShowDetailInfor, extraInfor } = this.state;
        return (
            <div className='doctor-extra-infor-container'>
                <div className='content-up'>
                    <div className='content-title'><FormattedMessage id='patient.doctor-infor.text-address' /></div>
                    <div className='name-clinic'>{extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''}</div>
                    <div className='address-clinic'>{extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''}</div>
                </div>
                <div className='content-down'>
                    <div className='content-normal'>
                        {isShowDetailInfor === false &&
                            <Fragment>
                                <div className='content-title'><FormattedMessage id='patient.doctor-infor.text-price' />
                                    <span className='price'>
                                        {extraInfor && extraInfor.priceData && language === LANGUAGES.VI &&
                                            <NumberFormat
                                                value={extraInfor.priceData.valueVi}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={`VNĐ`}
                                            />
                                        }
                                        {extraInfor && extraInfor.priceData && language === LANGUAGES.EN &&
                                            <NumberFormat
                                                value={extraInfor.priceData.valueEn}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                prefix={`$`}
                                            />
                                        }
                                    </span>
                                    <span className='btn-click' onClick={() => this.handleShowOrHidden(true)}><FormattedMessage id='patient.doctor-infor.view-detail' /></span>
                                </div>
                            </Fragment>
                        }
                        {isShowDetailInfor === true &&
                            <Fragment>
                                <div className='content-title'><FormattedMessage id='patient.doctor-infor.text-price' /></div>
                                <div className='content-up'>
                                    <div className='price'>
                                        <span className='left'><FormattedMessage id='patient.doctor-infor.table-text-price' /></span>
                                        <span className='right'>
                                            {extraInfor && extraInfor.priceData && language === LANGUAGES.VI ?
                                                <NumberFormat value={extraInfor.priceData?.valueVi} displayType={'text'} thousandSeparator={true} suffix={`VNĐ`} />
                                                :
                                                <NumberFormat value={extraInfor.priceData.valueEn} displayType={'text'} thousandSeparator={true} prefix={`$`} />
                                            }
                                        </span>
                                    </div>
                                    <div className='note'>
                                        {extraInfor && extraInfor.priceData ? extraInfor.note : ''}
                                    </div>
                                </div>
                                <div className='content-down'><FormattedMessage id='patient.doctor-infor.table-text-payment' />
                                    {extraInfor && extraInfor.paymentData && language === LANGUAGES.VI ?
                                        extraInfor.paymentData.valueVi : extraInfor.paymentData.valueEn}
                                </div>
                                <div className='btn-click-hidden' onClick={(event) => this.handleShowOrHidden(false)}>
                                    <FormattedMessage id='patient.doctor-infor.hidden-detail' />
                                </div>
                            </Fragment>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
