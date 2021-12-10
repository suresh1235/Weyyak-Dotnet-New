import { observable, action } from 'mobx';

import Store from 'stores/Store';
import endpoints from 'transport/endpoints';

/**
 * The editors list store
 */
class EditorsStore extends Store {
    /** The editors list */
    @observable
    editors = null;

    /**
     * Get editors
     * @returns {Object} editors
     */
    getEditors() {
        return this.editors;
    }

    /**
     * Set editors details
     * @param {Object} editors - editors details to be set
     */
    @action
    setEditors(editors) {
        this.editors = editors;
    }

    /**
     * Set editors data
     * @param {Array} editorsData - editors details to be set
     */
    setEditorsData(editorsData) {
        const { pagination } = this.getEditors();
        this.setEditors({pagination, data: editorsData});
    }

    /**
     * Update users data
     * @param {String} editorId - editor's identifier
     * @param {Object} updatedEditorData - updated editor's data
     */
    @action
    updateEditorsData(editorId, updatedEditorData) {
        const currentEditors = this.editors.data;

        for (var i = 0; i < currentEditors.length; i++) {
            const editorData = currentEditors[i];
            if (editorData.id == editorId) {
                Object.keys(updatedEditorData).
                    forEach(attribute => editorData[attribute] = updatedEditorData[attribute]);
                return;
            }
        }
    }

    /**
     * Removes editor from the storage
     * @param {String} editorId - editor's identifier
     */
    removeEditor(editorId) {
        const currentEditors = this.editors.data;
        const newEditors = currentEditors.filter(value => value.id != editorId);

        this.setEditorsData(newEditors);
    }

    /**
     * Fetch editors
     * @params {Object} params - fetch parameters
     * @returns {Promise} - a call api promise
     */
    fetchEditors(params) {
        this.setEditors(null);
        return this.Transport.callApi(endpoints.GET_EDITORS, null, params).then(this.setEditors.bind(this));
    }

    /**
     * Create admin request
     * @param {Object} editorData
     * @returns {Promise} - a call api promise
     */
    createEditor(editorData) {
        return this.Transport.callApi(endpoints.CREATE_EDITOR, {
            email: editorData.email,
            firstName: editorData.firstName,
            lastName: editorData.lastName,
            userRole: editorData.userRole
        });
    }

    /**
     * Update editor
     * @param {String} editorId - editor's identifier
     * @param {Object} updatedEditorData - updated user's details
     * @returns {Promise} - a call api promise
     */
    updateEditor(editorId, updatedEditorData) {
        return this.Transport.callApi(endpoints.UPDATE_EDITOR, updatedEditorData, [editorId])
            .then(this.updateEditorsData.bind(this, editorId, updatedEditorData));
    }

    /**
     * Delete editor
     * @param {String} editorId - identifier of editor to delete
     * @returns {Promise} - a call api promise
     */
    deleteEditor(editorId) {
        return this.Transport.callApi(endpoints.DELETE_EDITOR, null, editorId)
            .then(this.removeEditor.bind(this, editorId));
    }
}

export default EditorsStore;
