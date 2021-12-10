import { observable, action, toJS } from 'mobx';
import Store from 'stores/Store';
import { getSetterName } from 'components/core/Utils'

/**
 * The Primary Info base class store
 * Should be implemented in inheritors
 */
class PrimaryInfoStore extends Store {

    /** Custom data observable object */
    @observable
    data = this.createData();

    /**
     * Create data
     * @returns {{originalTitle: string, alternativeTitle: string, arabicTitle: string, transliteratedTitle: string, notes: string}}
     */
    createData() {
        return {
            originalTitle: '',
            alternativeTitle: '',
            arabicTitle: '',
            transliteratedTitle: '',
            notes: ''
        }
    }

    /**
     * Base fetch data method for implementation in inheritors
     */
    @action
    fetchData() {
    }

    /**
     * Set content types
     * @param {Array} contentTypes - list of content types
     */
    @action
    setContentTypes(contentTypes) {
        this.contentTypes = contentTypes;
    }

    /**
     * Set original title
     * @param {Array} originalTitle - value
     */
    @action
    setOriginalTitle(originalTitle) {
        this.data.originalTitle = originalTitle;
    }
    /**
     * Set alternative title
     * @param {Array} alternativeTitle - value
     */
    @action
    setAlternativeTitle(alternativeTitle) {
        this.data.alternativeTitle = alternativeTitle;
    }
    /**
     * Set arabic title
     * @param {Array} arabicTitle - value
     */
    @action
    setArabicTitle(arabicTitle) {
        this.data.arabicTitle = arabicTitle;
    }
    /**
     * Set transliterated title
     * @param {Array} transliteratedTitle - value
     */
    @action
    setTransliteratedTitle(transliteratedTitle) {
        this.data.transliteratedTitle = transliteratedTitle;
    }
    /**
     * Set notes
     * @param {Array} notes - value
     */
    @action
    setNotes(notes) {
        this.data.notes = notes;
    }

    /**
     * Set primary info data
     * @param {Object} primaryInfo - primary info
     */
    @action
    setData(primaryInfo) {
        this.data = primaryInfo;
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

export default PrimaryInfoStore
