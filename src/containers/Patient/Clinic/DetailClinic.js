import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./DetailClinic.scss";
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../../System/Admin/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import { getDetailClinicById } from "../../../services/userService";
import _ from "lodash";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
        };
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let arrDoctorId = [];
            let res = await getDetailClinicById({ id: id });
            console.log('check res:', res);
            if (res && res.errCode === 0) {
                let data = res.data;
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId);
                        })
                    }
                }

                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId,
                });
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }


    render() {
        let { arrDoctorId, dataDetailClinic } = this.state;
        let { language } = this.props;


        return (
            <div className="detail-clinic-container">
                <HomeHeader />
                <div className="description-clinic">
                    {dataDetailClinic && !_.isEmpty(dataDetailClinic) && dataDetailClinic.descriptionHTML &&
                        <>
                            <div className="name-clinic">{dataDetailClinic.name}</div>
                            <div className="address-clinic">{dataDetailClinic.address}</div>
                            <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.descriptionHTML }}></div>
                        </>
                    }
                </div>

                <div className="detail-clinic-body">
                    <div className="detail-clinic">
                        {arrDoctorId && arrDoctorId.length > 0 ?
                            <>
                                {
                                    arrDoctorId.map((item, index) => {
                                        return (
                                            <div className="each-doctor" key={index}>
                                                <div className="dt-content-left">
                                                    <div className="doctor-profile">
                                                        <ProfileDoctor
                                                            doctorIdModal={item}
                                                            isShowDescriptionDoctorModal={true}
                                                            isShowLinkDetail={true}
                                                            isShowPrice={false}
                                                        // dataTimeModal={dataTimeModal}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="dt-content-right">
                                                    <div className="doctor-schedule">
                                                        <DoctorSchedule
                                                            doctorIdFromParent={item}
                                                        />
                                                    </div>
                                                    <div className="doctor-extra">
                                                        <DoctorExtraInfor
                                                            doctorIdFromParent={item}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </>
                            :
                            <>
                                <div style={{ textAlign: 'center' }}><FormattedMessage id='patient.detail-clinic.not-found' /></div>
                            </>
                        }
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);