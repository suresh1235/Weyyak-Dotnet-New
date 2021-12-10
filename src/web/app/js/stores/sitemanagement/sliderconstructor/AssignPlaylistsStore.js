import { observable, action, toJS, computed } from 'mobx';
import Store from 'stores/Store';
import { getSetterName } from 'components/core/Utils'
import endpoints from 'transport/endpoints';
import constants from 'constants/constants';

/**
 * The details base class store
 * Should be implemented in inheritors
 */
class AssignPlaylistsStore extends Store {

    sliderType = '';

    /** Custom data observable object */
    @observable
    data = {
        blackAreaPlaylist: null,
        redAreaPlaylist: null,
        greenAreaPlaylist: null
    };

    @computed
    get selectedBlackAreaPlaylist() {
        return toJS(this.data.blackAreaPlaylist);
    }

    @computed
    get selectedRedAreaPlaylist() {
        return toJS(this.data.redAreaPlaylist);
    }

    @computed
    get selectedGreenAreaPlaylist() {
        return toJS(this.data.greenAreaPlaylist);
    }

    /**
     * Set Black Area playlist
     * @param value - playlist for Black Area
     */
    @action
    setBlackAreaPlaylist(value) {
        this.data.blackAreaPlaylist = value;
    }

    /**
     * Set Red Area playlist
     * @param value - playlist for Red Area
     */
    @action
    setRedAreaPlaylist(value) {
        this.data.redAreaPlaylist = value;
    }

    /**
     * Set Green Area playlist
     * @param value - playlist for Green Area
     */
    @action
    setGreenAreaPlaylist(value) {
        this.data.greenAreaPlaylist = value;
    }

    /**
     * Base fetch data method for implementation in inheritors
     */
    @action
    fetchData() {
    }

    fetchPlaylists(searchText) {
        return this.Transport
            .callApi(
                endpoints.PLAYLISTS.GET_PLAYLISTS_SUMMARY,
                null,
                [searchText || '', 0, constants.MULTISELECT_SEARCH.SEARCH_LIMIT, true]);
    }

    /**
     * Set data
     * @param {Object} data - data
     */
    @action
    setData(data) {
        const { blackAreaPlaylist, redAreaPlaylist, greenAreaPlaylist } = data;

        this.data.blackAreaPlaylist = blackAreaPlaylist || null;
        this.data.redAreaPlaylist = redAreaPlaylist || null;
        this.data.greenAreaPlaylist = greenAreaPlaylist || null;
    }

    @action
    sliderTypeUpdated(type) {
        if (this.sliderType != type) {

            if (type && type > constants.SLIDER_TYPE.LAYOUT_A) {
                this.data.greenAreaPlaylist = null;
            }
            if (type && type > constants.SLIDER_TYPE.LAYOUT_B) {
                this.data.redAreaPlaylist = null;
            }

            this.sliderType = type;
        }
    }

    /**
     * Retrieve normalized data object for the store
     * @returns {Object} normalized data
     */
    getData() {
        return toJS(this.data);
    }

    /**
     * Empties all props in data object
     */
    @action
    clearData() {
        this.sliderType = '';
        this.data.blackAreaPlaylist = null;
        this.data.redAreaPlaylist = null;
        this.data.greenAreaPlaylist = null;
    }
}

export default AssignPlaylistsStore
