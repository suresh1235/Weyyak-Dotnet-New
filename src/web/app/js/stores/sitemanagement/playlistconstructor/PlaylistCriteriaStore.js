import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { observable, action, toJS } from 'mobx';

/**
 * The Playlist Criteria Store.
 */
class PlaylistCriteriaStore extends Store {
    /** Source Items */
    @observable
    sourceItems = null;

    /** Source Items */
    @observable
    searchActivated = false;

    /** Tree data */
    @observable
    playlistData = [];

    /** New playlist data */
    @observable
    playlistItems = {};

    /** Child data */
    @observable
    sourceItemsData = {};

    /** Search text */
    @observable
    searchText = '';

    /** Saved search text */
    @observable
    savedSearchText = '';

    /** Filter types */
    @observable
    filterTypes = [];

    /** Playlist types */
    @observable
    playlistTypes = [];

    /** Filter type */
    @observable
    filterType = '';

     /** Filter type */
     @observable
     filterTypeNew = '';

    /** Filter type id */
    @observable
    filterTypeId = null;

    /** Languages */
    @observable
    languages = []

    /**
     * Sets search text value
     * @param {String} searchText
     */
    @action
    setSearchText(searchText) {
        this.searchText = searchText;
    }

    /**
     * Sets filter types value
     * @param {Object} filters
     */
    @action
    setPlaylistFilters(filters) {
        this.filterTypes = filters.data;
    }

    /**
     * Sets types value
     * @param {Object} types
     */
    @action
    setPlaylistTypes(types) {
        this.playlistTypes = types.data;
    }

    /**
     * Sets languages
     * @param {Object} types
     */
    @action
    setLanguages(languages) {
        this.languages = languages.data;
    }

    /**
     * Sets source items
     * @param {Object} sourceItems
     */
    @action
    setSourceItems(sourceItems) {
        this.sourceItems = sourceItems;
    }

    /**
     * Sets new playlist data
     * @param {String} id
     * @param {Object} data
     */
    @action
    setPlaylistItems(id, data) {
        let newSourceItemsWithParams = this.playlistItems;
        this.playlistItems = null;
        newSourceItemsWithParams[id] = data;
        this.playlistItems = newSourceItemsWithParams;
    }

    /**
     * Sets source items data
     * @param {String} id
     * @param {Object} data
     */
    @action
    setSourceItemsData(id, data) {
        let newSourceItemsWithParams = this.sourceItemsData;
        this.sourceItemsData = null;
        newSourceItemsWithParams[id] = data;
        this.sourceItemsData = newSourceItemsWithParams;
    }

    /**
     * Sets tree data
     * @param {Object} filters
     */
    @action
    setData(formattedPlaylistData) {
        this.playlistData = formattedPlaylistData;
    }

    /**
     * Change filter type and filter type Id value
     * @param {String} filterType
     */
    @action
    changeSearchFilter(filterType) {
        this.filterType = filterType;
        this.filterTypeId = this.filterTypes
            .filter( filterType => toJS(filterType).name == filterType ).id;
    }

     /**
     * Change filter type and filter type Id value
     * @param {String} filterTypeNew
     */
      @action
      changeType(filterTypeNew) {
          this.filterTypeNew = filterTypeNew;
          this.filterType = "";
        //   this.filterTypeId = this.filterTypeNew
        //       .filter( filterType => toJS(filterType).name == filterType ).id;
      }

    /**
     * Retrieve data from server
     */
    @action
    getFilteredTableData() {
        !this.searchActivated && (this.searchActivated = true);
        this.savedSearchText = this.searchText;
        this.fetchSourceItems({limit: 10})
    }

    /**
     * Add new item to plalist
     * @param {Object} item
     * @returns {Boolean} is element not exists in playlist
     */
    @action
    addItem(item) {
        let formattedPlaylistData = this.playlistData;
        const isElementNotExistsInPlaylist = this.isElementNotExistsInPlaylist(formattedPlaylistData, item);
        if ( isElementNotExistsInPlaylist ) {
            formattedPlaylistData.push({
                name: item.name,
                id: item.id,
                type: item.type
            });
            this.playlistData = formattedPlaylistData;
        }
        return !isElementNotExistsInPlaylist;
    }


    @action
    findType(item) {
        let formattedPlaylistData = this.playlistData;
        const isElementTypeNotExistsInPlaylist = this.isElementTypeNotExistsInPlaylist(formattedPlaylistData, item);
        
        return !isElementTypeNotExistsInPlaylist;
    }

    /**
     * Checks is item exists in formatted playlist data
     * @param {Object} item
     * @returns {Boolean} is element not exists in playlist
     */
    isElementNotExistsInPlaylist(formattedPlaylistData, item) {
        return ( formattedPlaylistData.every(newTreeDataItem => newTreeDataItem.id != item.id) || formattedPlaylistData
            .filter(newTreeDataItem => newTreeDataItem.id == item.id)
            .every(newTreeDataItem => newTreeDataItem.type != item.type) )
    }

    isElementTypeNotExistsInPlaylist(formattedPlaylistData, item) {
        if(item=="content")
        {
            return ( formattedPlaylistData && formattedPlaylistData.every(newTreeDataItem => newTreeDataItem.type != 14) )

        }
        else
        {
            return ( formattedPlaylistData && formattedPlaylistData.every(newTreeDataItem => newTreeDataItem.type === 14) )

        }
    }

    /**
     * Move element upper in playlist
     * @param {Object} item
     */
    @action
    moveElementUpper(item) {
        let formattedPlaylistData = this.playlistData;
        const index = formattedPlaylistData.indexOf(item);
        if (index !== 0) {
            formattedPlaylistData.splice( index - 1, 0, item );
            formattedPlaylistData.splice( index + 1, 1 );
            this.playlistData = formattedPlaylistData;
        }
    }

    /**
     * Move element lower in playlist
     * @param {Object} item
     */
    @action
    moveElementLower(item) {
        let formattedPlaylistData = this.playlistData;
        const index = formattedPlaylistData.indexOf(item);
        if (index !== formattedPlaylistData.length - 1) {
            formattedPlaylistData.splice( index, 1 );
            formattedPlaylistData.splice( index + 1, 0, item );
            this.playlistData = formattedPlaylistData;
        }
    }

    /**
     * Remove element from playlist
     * @param {Object} item
     */
    @action
    removeElement(item) {
        let formattedPlaylistData = this.playlistData;
        const index = formattedPlaylistData.indexOf(item);
        formattedPlaylistData.splice(index, 1);
        this.playlistData = formattedPlaylistData;
    }

    /**
     * Fetch source items
     * @returns {Promise} a call api promise
     */
    fetchSourceItems(params) {
        params.searchText = this.savedSearchText;
        params.searchFilter = this.filterType;
        this.setSourceItems(null);
        return this.Transport.callApi(endpoints.PLAYLISTS.GET_PLAYLIST_SOURCE_ITEMS, null, params)
            .then(this.setSourceItems.bind(this));
    }

    /**
     * Fetch playlist types
     * @returns {Promise} a call api promise
     */
    fetchPlaylistTypes() {
        return this.Transport.callApi(endpoints.PLAYLISTS.GET_PLAYLIST_TYPES)
            .then(this.setPlaylistTypes.bind(this));
    }

    /**
     * Fetch languages
     * @returns {Promise} a call api promise
     */
    fetchLanguages() {
        return this.Transport.callApi(endpoints.GET_LANGUAGES_ORIGINAL)
            .then(this.setLanguages.bind(this));
    }

    /**
     * Fetch playlist items
     * @returns {Promise} a call api promise
     */
    fetchPlaylistItems(id, type, params) {
        params.id = id;
        params.playlistItemType = type;
        return this.Transport.callApi(endpoints.PLAYLISTS.GET_DYNAMIC_GROUP_ITEMS, null, params)
            .then(this.setPlaylistItems.bind(this, id));
    }

    /**
     * Fetch source items data
     * @returns {Promise} a call api promise
     */
    fetchSourceItemsData(id, type, params) {
        params.id = id;
        params.playlistItemType = type;
        return this.Transport.callApi(endpoints.PLAYLISTS.GET_DYNAMIC_GROUP_ITEMS, null, params)
            .then(this.setSourceItemsData.bind(this, id));
    }

    /**
     * Fetch playlist filters
     * @returns {Promise} a call api promise
     */
    fetchPlaylistFilters() {
        return this.Transport.callApi(endpoints.PLAYLISTS.GET_PLAYLIST_FILTERS)
            .then(this.setPlaylistFilters.bind(this));
    }

    /**
     * Retrieve normalized playlist items data
     * @returns {Object} normalized data
     */
    getPlaylistItems(id) {
        return toJS(this.playlistItems)[id];
    }

    /**
     * Retrieve normalized source items object
     * @returns {Object} normalized data
     */
    getSourceItems() {
        return toJS(this.sourceItems);
    }

    /**
     * Retrieve normalized source items data data
     * @returns {Object} normalized data
     */
    getSourceItemsData(id) {
        return toJS(this.sourceItemsData)[id];
    }

    /**
     * Retrieve normalized playlist data
     * @returns {Object} normalized data
     */
    getData() {
        return toJS(this.playlistData);
    }

    /**
     * Retrieve normalized playlist types data
     * @returns {Object} normalized data
     */
    getPlaylistTypes() {
        return toJS(this.playlistTypes);
    }

    /**
     * Empties all props in data object
     */
    @action
    clearData() {
        this.searchActivated = false;
        this.sourceItems = null;
        this.playlistData = [];
        this.playlistItems = {};
        this.sourceItemsData = {};
        this.searchText = '';
        this.savedSearchText = '';
        this.filterTypes = [];
        this.filterType = 'Content';
        this.filterTypeId = 1;
    }
}

export default PlaylistCriteriaStore;
