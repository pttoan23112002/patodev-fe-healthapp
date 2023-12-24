import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./DetailSpecialty.scss";
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../../System/Admin/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import { getAllCodeService, getDetailSpecialtyById } from "../../../services/userService";
import _ from "lodash";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvinces: [],
        };
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let arrDoctorId = [];
            let res = await getDetailSpecialtyById({ id: id, location: 'ALL' });

            let resProvince = await getAllCodeService('PROVINCE');

            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data;
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId);
                        })
                    }
                }

                let dataProvice = resProvince.data;
                console.log('check responsedata:', dataProvice);
                if (dataProvice && dataProvice.length > 0) {
                    dataProvice.unshift({
                        keyMap: "ALL",
                        type: "PROVINCE",
                        valueEn: "ALL",
                        valueVi: "Toàn quốc"
                    })
                }

                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    listProvinces: dataProvice ? dataProvice : []
                });
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    handleOnChangeSelect = async (event) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = event.target.value;

            let res = await getDetailSpecialtyById({ id: id, location: location });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId);
                        })
                    }
                }

                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId
                });
            }
        }
    }

    render() {
        let { arrDoctorId, dataDetailSpecialty, listProvinces } = this.state;
        let { language } = this.props;
        console.log('check state:', this.state);

        return (
            <div className="detail-specialty-container">
                <HomeHeader />
                <div className="description-specialty">
                    {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && dataDetailSpecialty.descriptionHTML &&
                        <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTML }}></div>
                    }
                </div>

                <div className="detail-specialty-body">
                    <div className="search-province-doctor-specialty">
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {listProvinces && listProvinces.length > 0 &&
                                listProvinces.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="detail-specialty">
                        {arrDoctorId && arrDoctorId.length > 0 &&
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);