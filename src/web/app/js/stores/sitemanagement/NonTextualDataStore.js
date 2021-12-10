import { action, toJS, observable } from 'mobx';

import Store from 'stores/Store';
import endpoints from 'transport/endpoints';

/**
 * The Textual Data store.
 */
class NonTextualDataStore extends Store {

    /**
     * Image ids which will be saved at the server
     */
    @observable
    data = {};

    /**
     * Image uploading visual indicator
     */
    @observable
    uploadStatus = {};

    /**
     * Image metadata for request
     */
    metadataMap = {};

    /**
     * Fills observable objects with fields data.
     * @param {Object} fields - field params.
     */
    @action
    setDataFields(fields) {
        let data = {};
        let uploadStatus = {};
        let metadataMap = {};

        fields.forEach(field => {
            data[field.name] = '';
            uploadStatus[field.name] = '';
            metadataMap[field.name] = field.name.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
        })

        this.data = data;
        this.uploadStatus = uploadStatus;
        this.metadataMap = metadataMap;
    }

    /**
     * Set non-textual data object
     * @param {Object} data
     */
    @action
    setData(data, uploadStatuses) {
        this.data = data;
        this.uploadStatus = uploadStatuses;
    }

    /**
     * Uploads file to server.
     * @param {String} name - name of field.
     * @param {Object} file - file which will be uploaded to the server.
     */
    @action
    updateFile(name, file) {
        this.Transport.callApi(endpoints.SAVE_NON_TEXTUAL_IMAGES, {
            file
        }, this.metadataMap[name]).then(this.handleErrors)
            .then(response => {
                this.setUploadStatus(name, 'success', response.data)
            })
            .catch(error => {
                this.setUploadStatus(name, 'failed')
            });
    }

    /**
     * Change upload status.
     * @param {String} name - name of field.
     * @param {String} status - name of current status.
     * @param {Object} response - data from server.
     */
    @action
    setUploadStatus(name, status, id) {
        this.data[name] = id;
        this.uploadStatus[name] = status;
    }

    /**
     * Resets field.
     * @param {String} name - name of field.
     */
    @action
    resetField(name) {
        this.data[name] = '';
        this.uploadStatus[name] = status;
    }

    /**
     * Error handler
     * @param {Object} response - response from the server.
     * @returns {Object} - response from the server..
     */
    handleErrors(response) {
        if (!response.data) {
            throw Error(response.statusText);
        }
        return response;
    }

    /**
     * Retrieve data object for the store.
     * @returns {Object} data.
     */
    getData() {
        return this.data;
    }

    /**
     * Retrieve file upload status.
     * @returns {String} - file upload status.
     */
    getUploadStatus() {
        return toJS(this.uploadStatus);
    }

    /**
     * Empties all props in data object
     */
    clearData() {
        Object.keys(this.data).forEach(prop => {
            this.resetField(prop);
        });
    }
}

export default NonTextualDataStore;
