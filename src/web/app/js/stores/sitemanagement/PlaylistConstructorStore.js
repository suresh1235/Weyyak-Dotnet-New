import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { action } from 'mobx';
import PlaylistDetailsStore from 'stores/sitemanagement/playlistconstructor/PlaylistDetailsStore';
import PlaylistCriteriaStore from 'stores/sitemanagement/playlistconstructor/PlaylistCriteriaStore';
import PublishOnStore from 'stores/sitemanagement/shared/PublishOnStore';
import SchedulingStore from 'stores/sitemanagement/shared/SchedulingStore';
import AttachedToPagesStore from 'stores/sitemanagement/shared/AttachedToPagesStore';
import moment from 'moment';

/**
 * The Playlist Constructor Store.
 */
class PlaylistConstructorStore extends Store {

    id = null;
    playlisttype="";

    constructor(...args) {
        super(...args);
        this.playlistDetails = new PlaylistDetailsStore(...args);
        this.playlistCriteria = new PlaylistCriteriaStore(...args);
        this.scheduling = new SchedulingStore(...args);
        this.publishOn = new PublishOnStore (...args);
        this.pages = new AttachedToPagesStore(...args);
    }

    /**
     * Fetch Playlist Data
     * @param {String} - playlist id
     * @returns {*|Promise.<TResult>}
     */
    @action
    fetchPlaylist(contentId) {
        return this.Transport.callApi(endpoints.PLAYLISTS.GET_PLAYLIST, null, [contentId]).then(res => {
            this.setStores(res);
        });
    }

    /**
     * Set stores
     * @param {Object} content - playlist object
     */
    @action
    setStores(content) {
        if (content) {
            
            const {
                englishTitle,
                arabicTitle,
                schedulingEndDate,
                schedulingStartDate,
                pages,
                publishingPlatforms,
                regions,
                playlisttype
            } = content.data;

            this.id = content.data.id;
            this.playlistDetails.setData(
                {
                    englishTitle,
                    arabicTitle,
                    playlisttype
                    
                }
            );
            this.playlisttype=content.data.playlisttype
            this.playlistCriteria.setData(content.data.playlistItems);
            this.scheduling.setData(
                {
                    schedulingEndDate : schedulingEndDate && moment(schedulingEndDate),
                    schedulingStartDate : schedulingStartDate && moment(schedulingStartDate)
                }
            );

            this.publishOn.setStores ({
                publishingPlatforms: publishingPlatforms || [],
                regions: regions || [],
              });

            this.pages.setData({
                pages
            });
        }
    }

    @action
    setContentId(data) {
        this.id = data.id;
    }

    /**
     * Create item
     */
    createPlaylist() {

        const { englishTitle, arabicTitle } = this.playlistDetails.getData();
        const { schedulingEndDate, schedulingStartDate } = this.scheduling.getData();
        const {publishingPlatforms, regions} = this.publishOn.getData ();
        const { pages } = this.pages.getData();

        return this.Transport.callApi(endpoints.PLAYLISTS.CREATE_PLAYLIST, {
            englishTitle,
            arabicTitle,
            playlistItems: this.playlistCriteria.getData(),
            schedulingEndDate,
            schedulingStartDate,
            publishingPlatforms,
            regions,
            pagesIds: (pages || []).map(x => x.id)
        }).then(res => {
            // TODO: handle in future versions
            // res && res.data && this.setContentIdAndStatus(res.data);
        });
    }

    /**
     * Update created item
     */
    updatePlaylist() {
        const { englishTitle, arabicTitle } = this.playlistDetails.getData();
        const { schedulingEndDate, schedulingStartDate } = this.scheduling.getData();
        const {publishingPlatforms, regions} = this.publishOn.getData ();
        const { pages } = this.pages.getData();
        
        return this.Transport.callApi(endpoints.PLAYLISTS.UPDATE_PLAYLIST, {
            englishTitle,
            arabicTitle,
            playlistItems: this.playlistCriteria.getData(),
            schedulingEndDate,
            schedulingStartDate,
            publishingPlatforms,
            regions,
            pagesIds: (pages || []).map(x => x.id)
        },[this.id]
        ).then(res => {
            // TODO: handle in future versions
            // res && res.data && this.setContentIdAndStatus(res.data);
        });
    }

    /**
     * Clear store
     */
    @action
    clearStore() {
        this.id = null;
        this.playlisttype = null;
        this.playlistDetails.clearData();
        this.playlistCriteria.clearData();
        this.publishOn.clearStore ();
        this.scheduling.clearData();
        this.pages.clearData();
    }
}

export default PlaylistConstructorStore;
