import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { observable, action, toJS } from 'mobx';
import InvalidationNotificationsStore from 'stores/shared/InvalidationNotificationsStore'
/**
 * The Playlists Management Store.
 */
class PlaylistsManagementStore extends Store {

    @observable
    data = {};

    constructor(...args) {
        super(...args);
        this.invalidationNotificationStore = new InvalidationNotificationsStore(endpoints.PLAYLISTS.GET_PLAYLIST_INVALIDATION_NOTIFICATIONS, ...args);
    }

    @action
    deletePlaylist(playlistId) {
        return this.Transport.callApi(endpoints.PLAYLISTS.DELETE_PLAYLIST, null, playlistId)
            .then(this.removeItem.bind(this, playlistId));
    }

    @action
    changePlaylistAvailability(playlistId, available) {
        return this.Transport
            .callApi(endpoints.PLAYLISTS.CHANGE_PLAYLIST_AVAILABILITY, {
                id: playlistId,
                isDisabled: !available
            }, playlistId)
            .then(this.updateItemAvailability.bind(this, playlistId, available));
    }

    @action
    setData(data) {
        this.data = data;
    }

    @action
    fetchPlaylists(params) {
        const { searchText = '', offset = 0, limit } = params;
        this.setData(null);

        return this.Transport.callApi(endpoints.PLAYLISTS.GET_PLAYLISTS, null, [searchText, offset, limit])
            .then(res => {
                this.setData(res);
            });
    }

    /**
     * Clear store
     */
    @action
    clearStore() {
        this.data = [];
        this.invalidationNotificationStore.clearStore();
    }

    /**
     * Get content data
     * @returns {Object} content data
     */
    getData() {
        return toJS(this.data);
    }

    /**
     * Removes editor from the storage
     * @param {String} editorId - editor's identifier
     */
    @action
    removeItem(id) {
        const { data: pages } = this.data;
        var index = pages.findIndex(value => value.id == id);
        pages.splice(index, 1);
    }

    @action
    updateItemAvailability(id, available) {
        const { data: pages } = this.data;
        var item = pages.find(value => value.id == id);
        if (!!item) {
            item.isDisabled = !available;
        }
    }
}

export default PlaylistsManagementStore;
