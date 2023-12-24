import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions';
import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import { toast } from "react-toastify";
import _ from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService';

class ManageSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: [],

        };
    }

    componentDidMount() {
        this.props.fetchAllDoctorsRedux();
        this.props.fetchAllCodeScheduleTimeRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            this.setState({
                language: this.props.language
            });
        }
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            });
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => ({ ...item, isSelectedTime: false }));
                /*
                data.map(item => {
                    item.isSelectedTime = false;
                    return item;
                })
                */
            }
            this.setState({
                rangeTime: data
            });
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn; // label
                object.value = item.id; // value
                result.push(object);
            })
        }
        return result;
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({
            selectedDoctor: selectedDoctor
        });
        // console.log(`Option value selected:`, selectedDoctor);
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        });
    }
    handleSelectTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id)
                    item.isSelectedTime = !item.isSelectedTime;
                return item;
            });
            this.setState({
                isSelectedTime: rangeTime
            });
        }
    }

    handleSaveSchedule = async () => {
        let result = [];
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error('Invalid selectedDoctor');
            return;
        }
        if (!currentDate) {
            toast.error('Invalid date');
            return;
        }

        // let formattedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
        // let formattedDate = moment(currentDate).unix();
        let formattedDate = new Date(currentDate).getTime();

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelectedTime === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(item => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formattedDate;
                    object.timeType = item.keyMap;
                    result.push(object);
                })
            } else {
                toast.error('Invalid select time');
                return;
            }
        }
        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            date: formattedDate
        });
        if (res && res.errCode === 0) {
            toast.success('Save schedule doctor is succeed');
        } else {
            toast.error('Error saveBulkScheduleDoctor');
            console.log('Error bulk res:', res);
        }
    }

    render() {
        let { rangeTime } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'><FormattedMessage id='manage-schedule.title' /></div>
                <div className='container'>
                    <div className='form-row'>
                        <div className='col-md-6 form-group'>
                            <label><FormattedMessage id='manage-schedule.choose-doctor' /></label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                            />
                        </div>
                        <div className='col-md-6 form-group'>
                            <label><FormattedMessage id='manage-schedule.choose-date' /></label>
                            <DatePicker
                                className='form-control'
                                onChange={this.handleOnChangeDatePicker}
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className='col-md-12 form-group pick-hour-container'>
                            {rangeTime && rangeTime.length &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button key={index}
                                            onClick={() => this.handleSelectTime(item)}
                                            className={item.isSelectedTime === true ? 'button-time active' : 'button-time'}
                                        >
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className='col-md-12 form-group'>
                            <button className='btn btn-primary' onClick={() => this.handleSaveSchedule()}>
                                <FormattedMessage id='manage-schedule.button-save' />
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        fetchAllCodeScheduleTimeRedux: () => dispatch(actions.fetchAllCodeScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
