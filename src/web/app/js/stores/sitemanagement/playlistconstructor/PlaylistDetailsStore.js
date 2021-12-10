import { observable, action, toJS } from 'mobx';
import Store from 'stores/Store';
import { getSetterName } from 'components/core/Utils'

/**
 * The details base class store
 * Should be implemented in inheritors
 */
class PlaylistDetailsStore extends Store {

    /** Custom data observable object */
    @observable
    data = this.createData();

    /**
     * Create data
     * @returns {{originalTitle: string, alternativeTitle: string, arabicTitle: string, transliteratedTitle: string, notes: string}}
     */
    createData() {
        return {
            englishTitle: '',
            arabicTitle: ''
        }
    }

    /**
     * Base fetch data method for implementation in inheritors
     */
    @action
    fetchData() {
    }

    /**
     * Set playlist english title
     * @param {Array} englishTitle - playlist english title
     */
    @action
    setEnglishTitle(englishTitle) {
        this.data.englishTitle = englishTitle;
    }

    /**
     * Set playlist arabic title
     * @param {Array} arabicTitle - playlist arabic title
     */
    @action
    setArabicTitle(arabicTitle) {
        this.data.arabicTitle = arabicTitle;
    }

    /**
     * Set data
     * @param {Object} data - data
     */
    @action
    setData(data) {
        this.data = data;
    }

    /**
     * Retrieve normalized data object for the store
     * @returns {Object} normalized data
     */
    getData() {
        return toJS(this.data)
    }

    /**
     * Empties all props in data object
     */
    clearData() {
        Object.keys(this.data).forEach((prop)=>{
            this.data[prop] && this[getSetterName(prop)]('');
        });
    }
}

export default PlaylistDetailsStore
