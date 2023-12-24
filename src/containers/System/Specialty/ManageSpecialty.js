import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ManageSpecialty.scss";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { CommonUtils, LANGUAGES } from '../../../utils';
import { createNewSpecialty } from "../../../services/userService";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkDown: ''
        };
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkDown: text,
        });
    }

    handleOnchangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        });
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file); //encode
            this.setState({
                imageBase64: base64,
            });
        }
    }

    handleSaveNewSpecialty = async () => {
        let res = await createNewSpecialty(this.state);
        if (res && res.errCode === 0) {
            toast.success('Create new specialty success');
            this.setState({
                name: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkDown: ''
            });
        } else {
            toast.error('Try again!');
            console.log('check state', res);
        }
        console.log('check state', res);
    }

    render() {
        return (
            <Fragment>
                <div className="manage-specialty-container">
                    <div className="title">Quản lý chuyên khoa</div>

                    <div className="add-new-specialty row mt-3">
                        <div className="col-md-6 form-group">
                            <label>Tên chuyên khoa</label>
                            <input className="form-control" type="text" value={this.state.name}
                                onChange={(event) => this.handleOnchangeInput(event, 'name')} />
                        </div>
                        <div className="col-md-6 form-group">
                            <label>Ảnh chuyên khoa</label>
                            <input className="form-control-file" type="file"
                                onChange={(event) => this.handleOnChangeImage(event)} />
                        </div>
                        <div className="col-md-12 mt-2">
                            <MdEditor
                                style={{ height: '300px' }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={this.state.descriptionMarkDown}
                            />
                        </div>
                        <div className="col-md-12 mt-3 mb-3">
                            <button className="btn-save-new-specialty" onClick={() => this.handleSaveNewSpecialty()}>Save</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);