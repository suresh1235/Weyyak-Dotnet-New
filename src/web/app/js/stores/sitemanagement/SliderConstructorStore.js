import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { action, computed } from 'mobx';
import moment from 'moment';

import SliderDetailsStore from 'stores/sitemanagement/sliderconstructor/SliderDetailsStore';
import PublishOnStore from 'stores/sitemanagement/shared/PublishOnStore';
import SchedulingStore from 'stores/sitemanagement/shared/SchedulingStore';
import AssignPlaylistsStore from 'stores/sitemanagement/sliderconstructor/AssignPlaylistsStore';
import AttachedToPagesStore from 'stores/sitemanagement/shared/AttachedToPagesStore';

/**
 * The Slider Constructor Store.
 */
class SliderConstructorStore extends Store {

    id = null;

    constructor(...args) {
        super(...args);

        this.sliderDetails = new SliderDetailsStore(...args);
        this.assignPlaylists = new AssignPlaylistsStore(...args);
        this.publishOn = new PublishOnStore(...args);
        this.scheduling = new SchedulingStore(...args);
        this.pages = new AttachedToPagesStore(...args);
    }

    @computed get sliderPagesPlatformsMismatches() {
        const { publishingPlatforms: { data: { publishingPlatforms } } } = this.publishOn;
        const { data: { pages } } = this.pages;
        
        const mismatches = [];
        for (let index = 0; index < pages.length; index++) {
            const page = pages[index];
            const pagePlatforms = page.publishingPlatforms;
            const platfomrsMatching = pagePlatforms.filter(value => publishingPlatforms.indexOf(value) >= 0);
            if (!platfomrsMatching.length) {
                mismatches.push(page);
            }
        }
        return mismatches;
    }

    createSlider() {
        return this.Transport.callApi(endpoints.SLIDERS.CREATE_SLIDER, this.collectData()).then(res => {
            // TODO: handle in future versions
        });
    }

    updateSlider() {
        return this.Transport.callApi(endpoints.SLIDERS.UPDATE_SLIDER, this.collectData(),
        [this.id]).then(res => {
            // TODO: handle in future versions
        });
    }

    collectData() {
        const { name, type } = this.sliderDetails.getData();
        const {
            blackAreaPlaylist,
            redAreaPlaylist,
            greenAreaPlaylist,
        } = this.assignPlaylists.getData();
        const { publishingPlatforms, regions } = this.publishOn.getData();
        const { schedulingStartDate, schedulingEndDate } = this.scheduling.getData();
        const { pages } = this.pages.getData();

        return {
            name,
            type,
            blackAreaPlaylistId: blackAreaPlaylist ? blackAreaPlaylist.id : null,
            redAreaPlaylistId: redAreaPlaylist ? redAreaPlaylist.id : null,
            greenAreaPlaylistId: greenAreaPlaylist ? greenAreaPlaylist.id : null,
            schedulingStartDate,
            schedulingEndDate,
            publishingPlatforms,
            regions,
            pagesIds: (pages || []).map(x => x.id)
        }
    }

    @action
    fetchSlider(sliderId) {
        return this.Transport.callApi(endpoints.SLIDERS.GET_SLIDER, null, sliderId).then(res => {
            this.setStores(res);
        });
    }

    @action
    setStores(res) {
        if (res) {
            this.id = res.data.id;

            const {
                name,
                type,
                blackAreaPlaylist,
                redAreaPlaylist,
                greenAreaPlaylist,
                schedulingStartDate,
                schedulingEndDate,
                publishingPlatforms,
                regions,
                pages
            } = res.data;

            this.sliderDetails.setData({ name, type });
            this.assignPlaylists.setData({ blackAreaPlaylist, redAreaPlaylist, greenAreaPlaylist});
            this.publishOn.setStores({ publishingPlatforms, regions });
            this.scheduling.setData({ schedulingStartDate: moment(schedulingStartDate), schedulingEndDate: moment(schedulingEndDate) });
            this.pages.setData({pages});
        }
    }

    /**
     * Clear store
     */
    @action
    clearStore() {
        this.id = null;
        this.sliderDetails.clearData();
        this.assignPlaylists.clearData();
        this.publishOn.clearStore();
        this.scheduling.clearData();
        this.pages.clearData();
    }
}

export default SliderConstructorStore;
