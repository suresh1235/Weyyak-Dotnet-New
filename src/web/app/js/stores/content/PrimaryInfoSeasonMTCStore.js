import { observable, action } from 'mobx';
import { getSetterName } from 'components/core/Utils'
import PrimaryInfoStore from 'stores/content/PrimaryInfoStore'

/**
 * The Primary Info store.
 */
class PrimaryInfoSeasonMTCStore extends PrimaryInfoStore {

    /**
     * Contract primary info season multi tier content store
     * @param {Object} args - arguments
     */
    constructor(args) {
        super(args);
        this.setDefaultSeasonNumbers();
    }

    /** Content types list */
    @observable
    seasonNumbers = null;

    /**
     * Set season numbers
     * @param {Array} seasonNumbers - list of season numbers
     */
    @action
    setSeasonNumbers(seasonNumbers) {
        this.seasonNumbers = seasonNumbers;
    }

    /**
     * Set notes
     * @param {String} notes - notes
     */
    @action
    setNotes(notes) {
        this.data.notes = notes;
    }

    /**
     * Set default season numbers
     */
    @action
    setDefaultSeasonNumbers() {
        this.seasonNumbers = Array(50).fill().map((e, i)=> i + 1);
    }

    /**
     * Set season number
     * @param {Number} seasonNumber - season number
     */
    @action
    setSeasonNumber(seasonNumber) {
        this.data.seasonNumber = seasonNumber != '' ? parseInt(seasonNumber) : seasonNumber;
    }

    /**
     * Clear data
     */
    @action
    clearData() {
        super.clearData();
        this.data.seasonNumber = '';
        this.setDefaultSeasonNumbers();
    }

    /**
     * Create data
     * @returns {Object} data
     */
    createData() {
        const data = super.createData();
        data['seasonNumber'] = '';
        return data;
    }
}

export default PrimaryInfoSeasonMTCStore;
