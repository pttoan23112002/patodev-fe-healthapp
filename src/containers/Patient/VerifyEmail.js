import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { postVerifyBookAppointment } from "../../services/userService";
import HomeHeader from "../HomePage/HomeHeader";
import "./VerifyEmail.scss";
import { FormattedMessage } from "react-intl";

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0
        };
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token'); // ?ascacasc-acsaskca-ascjkrgnk-vsdj
            let doctorId = urlParams.get('doctorId');
            let res = await postVerifyBookAppointment({
                token: token,
                doctorId: doctorId
            });

            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                });
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        let { statusVerify, errCode } = this.state;
        return (
            <Fragment>
                <HomeHeader />
                <div className="verify-email">
                    <div className="verify-box">
                        <div className="veryfy-title"><FormattedMessage id='patient.verify-email.title' />
                            {statusVerify === false ?
                                <div className="text-status"><FormattedMessage id='patient.verify-email.loading' /></div>

                                :
                                <div>
                                    {+ errCode === 0 ?
                                        <div className="text-status"><FormattedMessage id='patient.verify-email.success' /></div>
                                        :
                                        <div className="text-status"><FormattedMessage id='patient.verify-email.failed' /></div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
};

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);