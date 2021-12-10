import React, {Component} from 'react';
import { observer } from 'mobx-react';
import UploaderComponent from 'components/content/UploaderComponent';

/**
 * The class defines a non-textual data of a content
 */
@observer
class NonTextualData extends Component {

    constructor(...args) {
        super(...args);

        this.updateFile = this.updateFile.bind(this);
        this.resetField = this.resetField.bind(this);
        this.setUploadStatus = this.setUploadStatus.bind(this);
    }

    /**
     * Updates file on server.
     * @param {String} fieldName - name of changed field.
     * @param {Object} file - file for upload.
     * @param {Object} event - browser event.
     */
    updateFile(fieldName, file, event) {
        const {store} = this.props;
        store.updateFile(fieldName, file)
    }

    componentWillMount() {
        const {store, fields} = this.props;
        store.setDataFields(fields);
    }

    /**
     * Resets field.
     * @param {String} fieldName - name of resets field.
     * @param {Object} event - browser event.
     */
    resetField(fieldName, event) {
        const {store} = this.props;
        store.resetField(fieldName)
    }

    /**
     * Sets status of upload.
     * @param {String} fieldName - name of changed field.
     * @param {String} status - current upload status.
     * @param {Object} event - browser event.
     */
    setUploadStatus(fieldName, status, event) {
        const {store} = this.props;
        store.setUploadStatus(fieldName, status)
    }

    /**
     * @see Component#render()
     */
    render() {
        const {store, fields} = this.props;
        const data = store.getData();
        const uploadStatus = store.getUploadStatus();
        return (
            <div className="forms non-textual-data">
                {
                    fields.map((field, index) =>
                        <UploaderComponent
                            key={index}
                            fieldData={field}
                            uploadStatus={uploadStatus[field.name]}
                            updateFile={this.updateFile}
                            resetField={this.resetField}
                            setUploadStatus={this.setUploadStatus}
                            fileData={data[field.name]} 
                            preview={field.preview}
                            dataType={field.dataType} />)
                }
            </div>
        );
    }
}

export default NonTextualData;
