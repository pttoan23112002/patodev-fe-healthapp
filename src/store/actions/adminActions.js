import actionTypes from './actionTypes';
import {
    getAllCodeService, createNewUserService, getAllUsers, deleteUserService, editUserService,
    getTopDoctorHomeService, getAllDoctorsService, saveDetailDoctorService, getAllSpecialty, getAllClinic
} from '../../services/userService';
import { toast } from "react-toastify";

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START });
            let res = await getAllCodeService('GENDER');
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (error) {
            dispatch(fetchGenderFailed());
            console.log('fetchGenderStart error: ', error);
        }
    };
}
export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})
export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('POSITION');
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (error) {
            dispatch(fetchPositionFailed());
            console.log('fetchPositionStart error: ', error);
        }
    };
}
export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})
export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('ROLE');
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (error) {
            dispatch(fetchRoleFailed());
            console.log('fetchRoleStart error: ', error);
        }
    };
}
export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})
export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

export const createNewUser = (data) => {
    return (async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            console.log('check createNewUser', res);
            if (res && res.errCode === 0) {
                toast.success('Create the user success!');
                dispatch(createUserSuccess());
                dispatch(fetchAllUserStart());
            } else {
                toast.error(`Create the user error!`);
                dispatch(createUserFailed());
            }
        } catch (error) {
            toast.error(`Error!`);
            dispatch(createUserFailed());
            console.log('createUserFailed error:', error);
        }
    });
}
export const createUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS,
})
export const createUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED,
})

export const fetchAllUserStart = () => {
    return (async (dispatch, getState) => {
        try {
            let res = await getAllUsers('ALL');
            if (res && res.errCode === 0) {
                dispatch(fetchAllUserSuccess(res.users.reverse()));
            } else {
                toast.error(`Fetch all user error!`);
                dispatch(fetchAllUserFailed());
            }
        } catch (error) {
            toast.error(`Error!`);
            dispatch(fetchAllUserFailed());
            console.log('fetchAllUserStart error: ', error);
        }
    });
}
export const fetchAllUserSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    users: data
})
export const fetchAllUserFailed = () => ({
    type: actionTypes.FETCH_ALL_USER_FAILED
})

export const deleteUser = (userId) => {
    return (async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success('Delete the user success!');
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUserStart());
            } else {
                toast.error(`Delete the user error!`);
                dispatch(deleteUserFailed());
            }
        } catch (error) {
            toast.error(`Error!`);
            dispatch(deleteUserFailed());
            console.log('deleteUserFailed error:', error);
        }
    });
}
export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
})
export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED,
})

export const editUser = (data) => {
    return (async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            console.log(res);
            if (res && res.errCode === 0) {
                toast.success('Update the user success!');
                dispatch(editUserSuccess());
                dispatch(fetchAllUserStart());
            } else {
                toast.error(`Update the user error!`);
                dispatch(editUserFailed());
            }
        } catch (error) {
            toast.error(`Error!`);
            dispatch(editUserFailed());
            console.log('editUserFailed error:', error);
        }
    });
}
export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})
export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})

export const fetchTopDoctors = () => {
    return (async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService('8');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctors: res.data
                });
            } else {
                toast.error(`Can't get data fr fetchTopDoctors`)
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAILED
                });
            }
        } catch (error) {
            toast.error('Error')
            console.log(error);
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAILED
            });
        }
    });
}

export const fetchAllDoctors = () => {
    return (async (dispatch, getState) => {
        try {
            let res = await getAllDoctorsService();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataAllDoctors: res.data
                });
            } else {
                toast.error(`Can't get all doctors fr fetchAllDoctors`);
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED
                });
            }
        } catch (error) {
            toast.error('Error');
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAILED
            });
            console.log(error);
        }
    });
}

export const saveDetailDoctorAction = (data) => {
    return (async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctorService(data);
            if (res && res.errCode === 0) {
                toast.success('Save detail doctor succeed');
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS
                })
            } else {
                toast.error(`Can't save fetail doctor fr saveDetailDoctorAction`);
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED
                });
            }
        } catch (error) {
            toast.error('Error');
            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED
            });
            console.log(error);
        }
    })
}

export const fetchAllCodeScheduleTime = () => {
    return (async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('TIME');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data
                });
            } else {
                toast.error(`Can't fetch all code schedule time`);
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
                });
            }
        } catch (error) {
            toast.error(`Error`);
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
            });
            console.log(error);
        }
    })
}

export const getRequiredDoctorInfo = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_START
            });
            let resPrice = await getAllCodeService('PRICE');
            let resPayment = await getAllCodeService('PAYMENT');
            let resProvince = await getAllCodeService('PROVINCE');
            let resSpecialty = await getAllSpecialty();
            let resClinic = await getAllClinic();

            if (resPrice && resPrice.errCode === 0 &&
                resPayment && resPayment.errCode === 0 &&
                resProvince && resProvince.errCode === 0 &&
                resSpecialty && resSpecialty.errCode === 0 &&
                resClinic && resClinic.errCode === 0) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data
                }
                dispatch(fetchRequiredDoctorInfoSuccess(data));
            } else {
                dispatch(fetchRequiredDoctorInfoFailed());
            }
        } catch (error) {
            dispatch(fetchRequiredDoctorInfoFailed());
            console.log('fetchRequiredDoctorInfoStart error: ', error);
        }
    };
}
export const fetchRequiredDoctorInfoSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS,
    data: allRequiredData
})
export const fetchRequiredDoctorInfoFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAILED
})
