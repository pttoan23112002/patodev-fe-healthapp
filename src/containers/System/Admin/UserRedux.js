import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import * as actions from '../../../store/actions'
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableManageUser from './TableManageUser';


class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            positionId: '',
            roleId: '',
            image: '',

            action: '',
            editUserId: ''
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /**
         * render => didUpdate
         * previous vs this
         * [] != [3] => continue
         * [3] == [3] => stop
         */
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: this.props.genderRedux,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            });
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: this.props.positionRedux,
                positionId: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            });
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: this.props.roleRedux,
                roleId: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            });
        }

        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            let arrPositions = this.props.positionRedux;
            let arrRoles = this.props.roleRedux;

            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                positionId: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                roleId: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                image: '',

                action: CRUD_ACTIONS.CREATE,
                previewImgURL: ''
            });
        }
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file); //encode
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                image: base64
            });
        }
    }

    openPreviewImg = () => {
        if (!this.state.previewImgURL) return;
        else {
            this.setState({
                isOpen: true
            });
        }
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 'firstName', 'lastName',
            'phoneNumber', 'address'];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('This input is required: ' + arrCheck[i]);
                break;
            }
        }

        return isValid;

    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;

        let { action } = this.state;
        if (action === CRUD_ACTIONS.CREATE) {
            // fire redux create user
            this.props.createNewUserRedux({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                positionId: this.state.positionId,
                roleId: this.state.roleId,
                image: this.state.image
            });
        }

        if (action === CRUD_ACTIONS.EDIT) {
            // fire redux edit user
            this.props.editUserRedux({
                id: this.state.editUserId,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                positionId: this.state.positionId,
                roleId: this.state.roleId,
                image: this.state.image
            });
        }

    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });

    }

    handleEditUserFromParrent = (user) => {
        let imageBase64 = '';
        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary'); //decode
        }
        this.setState({
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
            positionId: user.positionId,
            image: '',
            roleId: user.roleId,
            previewImgURL: imageBase64,

            action: CRUD_ACTIONS.EDIT,
            editUserId: user.id
        });
    }

    render() {
        let genders = this.state.genderArr;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;
        let language = this.props.language;
        let isGetGenders = this.props.isLoadingGender;

        let {
            email, password, firstName, lastName,
            phoneNumber, address, gender, positionId, roleId, image
        } = this.state; // ES7 syntax

        return (
            <div className='user-redux-container'>
                <div className='title'>User redux with Pato</div>
                <div className='user-redux-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 mb-4'><b><FormattedMessage id='manage-user.add' /></b></div>
                            <div className='col-12'>{isGetGenders === true ? (language === LANGUAGES.VI ? 'Đang lấy dữ liệu...' : 'Loading data...') : ''}</div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.form.email' /></label>
                                <input className='form-control' type='email'
                                    value={email}
                                    onChange={(event) => this.onChangeInput(event, 'email')}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.form.password' /></label>
                                <input className='form-control' type='password'
                                    value={password}
                                    onChange={(event) => this.onChangeInput(event, 'password')}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.form.firstName' /></label>
                                <input className='form-control' type='text'
                                    value={firstName} onChange={(event) => this.onChangeInput(event, 'firstName')} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.form.lastName' /></label>
                                <input className='form-control' type='text'
                                    value={lastName} onChange={(event) => this.onChangeInput(event, 'lastName')} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.form.phoneNumber' /></label>
                                <input className='form-control' type='text'
                                    value={phoneNumber} onChange={(event) => this.onChangeInput(event, 'phoneNumber')} />
                            </div>
                            <div className='col-9'>
                                <label><FormattedMessage id='manage-user.form.address' /></label>
                                <input className='form-control' type='text'
                                    value={address} onChange={(event) => this.onChangeInput(event, 'address')} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.form.gender' /></label>
                                <select className='form-control'
                                    value={gender}
                                    onChange={(event) => this.onChangeInput(event, 'gender')}>
                                    {genders && genders.length > 0 &&
                                        genders.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.form.positionId' /></label>
                                <select className='form-control'
                                    value={positionId}
                                    onChange={(event) => this.onChangeInput(event, 'positionId')}>
                                    {positions && positions.length > 0 &&
                                        positions.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.form.roleId' /></label>
                                <select className='form-control'
                                    value={roleId}
                                    onChange={(event) => this.onChangeInput(event, 'roleId')}
                                >
                                    {roles && roles.length > 0 &&
                                        roles.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.form.image' /></label>
                                <div className='preview-img-container'>
                                    <input id='previewImg' type='file' hidden
                                        onChange={(event) => this.handleOnChangeImage(event)} />
                                    <label htmlFor='previewImg' className='label-upload'>
                                        {language === LANGUAGES.VI ? 'Tải ảnh' : 'Upload image'}
                                        <i className='fas fa-upload'></i>
                                    </label>
                                    <div className='preview-image'
                                        style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                        onClick={() => this.openPreviewImg()}
                                    ></div>

                                </div>
                            </div>
                            <div className='col-12 mt-4'>
                                <button className={this.state.action === CRUD_ACTIONS.EDIT ?
                                    'btn btn-warning mr-2' : 'btn btn-primary mr-2'}
                                    onClick={() => this.handleSaveUser()}>
                                    {this.state.action === CRUD_ACTIONS.EDIT ?
                                        <FormattedMessage id='manage-user.form.button-edit' />
                                        :
                                        <FormattedMessage id='manage-user.form.button-add' />}
                                </button>
                            </div>
                            <div className='col-12 mt-3 mb-5'>
                                <TableManageUser
                                    handleEditUserFromParrentKey={this.handleEditUserFromParrent}
                                />
                            </div>
                        </div>
                    </div>
                </div >



                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        isLoadingGender: state.admin.isLoadingGender,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUserRedux: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
        editUserRedux: (data) => dispatch(actions.editUser(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
