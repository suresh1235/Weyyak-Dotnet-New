import React, {Component} from 'react';
import { observer } from 'mobx-react';
import {
    FormControl,
    Button,
    Row,
    Col
} from 'react-bootstrap';
import Loader from 'components/core/Loader';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import { getValidationMessage } from 'components/core/Utils';
import constants from 'constants/constants';

/**
 * The class defines an upload component.
 */
@observer
class UploaderComponent extends Component {
    static defaultProps = {
        index: '',
        preview: false,
        dataType: null
    };

    constructor(...args) {
        super(...args);

        this.fileUpload = this.fileUpload.bind(this);
        this.triggerFileUpload = this.triggerFileUpload.bind(this);

        this.actionsMap = {
            uploading: <Loader className="bo-essel-loader-small" display="inline"/>,
            success: <i className="fa fa-check-circle bo-essel-error info" aria-hidden="true" />,
            failed: <i className="fa fa-times-circle bo-essel-error error" aria-hidden="true" />,
        }

        this.state = {
            incorrectParams: [],
            newData: null
        }
    }

    /**
     * Triggers click on input file element.
     */
    triggerFileUpload() {
        this.nativeFileUploader.click()
    }

    /**
     * Gets validation messages.
     * @param {String} param - name of validation.
     * @returns {String} - validation message.
     */
    getErrorMessage(param) {
        const {fieldData} = this.props;
        return fieldData.validationMessages[param];
    }

    /**
     * Uploads file to browser and creates file data for validate.
     * @param {Object} event - browser event.
     */
    fileUpload(event) {
        const {fieldData, setUploadStatus} = this.props;
        const file = event.target.files[0];
        const _URL = window.URL || window.webkitURL;

        let paramsToValidate = {};

        if (file) {
            setUploadStatus(fieldData.name, 'uploading')
            paramsToValidate.type = file.type;
            paramsToValidate.size = file.size;

            if (paramsToValidate.type.indexOf('image') !== -1) {
                let img = new Image();
                let dataUrl = _URL.createObjectURL(file);
                img.src = dataUrl;
                img.onload = (img) => {
                    paramsToValidate.resolution = `${img.target.width}x${img.target.height}`;
                    const valid = this.validateFile(file, paramsToValidate);
                    this.setState({
                        newData: valid ? dataUrl : null
                    });
                };
            } else {
                this.validateFile(file, paramsToValidate)
            }
        }
    }

    /**
     * Validates file.
     * @param {Object} file - uploaded file
     * @param {Array} paramsToValidate - validation parameters.
     */
    validateFile(file, paramsToValidate) {
        const {fieldData, setUploadStatus} = this.props;
        var errors = [];

        Object.keys(fieldData.fileParametersValidation).forEach(key => {
            !fieldData.fileParametersValidation[key](paramsToValidate[key]) && errors.push(key)
        });

        this.setState({
            incorrectParams: errors
        });

        if (errors.length) {
            setUploadStatus(fieldData.name, 'error', null);
        } else {
            this.uploadFile(file);
        }

        return errors.length == 0;
    }

    /**
     * Runs upload function.
     * @param {Object} file - file which will be uploaded to the server.
     */
    uploadFile(file) {
        const {updateFile, fieldData} = this.props;
        updateFile(fieldData.name, file);
    }

    /**
     * Resets field.
     * @param {String} currentField - name of field.
     */
    resetField(currentField) {
        const {resetField} = this.props;
        this.nativeFileUploader.value = '';
        resetField(currentField);
        this.setState({incorrectParams: [], newData: null});
    }

    getDataName(fileData){
        if (!this.isDataHttpUrl(fileData)) return fileData;
        var urlParts = fileData.split('/');
        return urlParts.length ? urlParts[urlParts.length-1] : '';
    }

    isDataHttpUrl(fileData) {
        return !!fileData && fileData.toLowerCase().indexOf('http') == 0;
    }

    getNoCacheFileData(fileData) {
        if (!fileData || !this.isDataHttpUrl(fileData)) return fileData;
        const ticks = new Date().getTime();
        if (fileData.indexOf('?') > 0) {
            return `${fileData}&c=${ticks}`;
        }
        else {
            return `${fileData}?c=${ticks}`; 
        }
    }

    renderPreviewComponent() {
        const { fieldData, fileData, preview, dataType } = this.props;
        const { newData } = this.state;

        if (!preview || !dataType) return null;
        
        const data = newData || this.getNoCacheFileData(fileData);
        if (!data) return null;

        switch (dataType) {
            case constants.NON_TEXTUAL_DATA_TYPE.IMAGE:
                    return (
                        <div className="preview-upload">
                            <img src={data} alt={fieldData.name} />
                        </div>
                    );
            default:
                if (this.isDataHttpUrl(data)) {
                    return (
                        <div className="form-input-group" >
                            <span className="bo-essel-action">
                                <a href={data} target="_blank" className="fa fa-download">Download</a>
                            </span>
                        </div>
                    )
                }
        }
        return null;
    }

    /**
     * @see Component#render()
     */
    render() {
        const { fieldData, fileData, uploadStatus, index} = this.props;
        const { incorrectParams } = this.state;
        
        const dataName = this.getDataName(fileData);

        if (this.nativeFileUploader && !fileData) {
            this.nativeFileUploader.value = ''
        }

        return (
            <FormValidationWrapper
                validationClass
                validationMessage={getValidationMessage}>
                <Row className="uploader-component">
                    <Col md={10}>
                        <div className="form-input-group">
                            <label>{fieldData.label}</label>
                            <div>
                                <input
                                    name="nativeFileUploader"
                                    ref={nativeFileUploader => this.nativeFileUploader = nativeFileUploader}
                                    type="file"
                                    accept="*"
                                    className="hidden"
                                    onChange={this.fileUpload}/>
                                <FormControl
                                    type="text"
                                    className="form-control"
                                    bsClass=""
                                    name={`${fieldData.name}${index}`}
                                    value={dataName ? dataName : ''}
                                    validations={fieldData.validationRules ? fieldData.validationRules : []}
                                    readOnly/>
                                {
                                    fileData && <div
                                        className="forms-remove"
                                        onClick={this.resetField.bind(this, fieldData.name)}>
                                        &#10006;
                                    </div>
                                }
                                {
                                    incorrectParams.map((param, index) => {
                                        return (
                                            <div className="bo-essel-error error" key={index}>
                                                {this.getErrorMessage(param)}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div>
                                <Button onClick={this.triggerFileUpload}>Browse</Button>
                                <label className="upload-status">
                                    {
                                        this.actionsMap[uploadStatus]
                                    }
                                </label>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        {this.renderPreviewComponent()}
                    </Col>
                </Row>
            </FormValidationWrapper>
        );
    }
}

export default UploaderComponent;
