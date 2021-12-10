import { action, toJS } from 'mobx';
import Store from 'stores/Store';
import PublishingPlatformsStore from 'stores/shared/PublishingPlatformsStore';
import RegionsStore from 'stores/shared/RegionsStore';

/**
 * The details base class store
 * Should be implemented in inheritors
 */
class PublishOnStore extends Store {

    constructor(...args) {
        super(...args);

        this.publishingPlatforms = new PublishingPlatformsStore(...args);
        this.regions = new RegionsStore(...args);
    }

    @action
    setStores(data) {
        const { publishingPlatforms, regions } = data;

        this.publishingPlatforms.setData({ publishingPlatforms });
        this.regions.setData(regions);
    }

    getData() {
        return {
            publishingPlatforms: toJS(this.publishingPlatforms.getData().publishingPlatforms),
            regions: toJS(this.regions.getData().regions)
        };
    }

    fetchAllMaps(){
        return this.regions.fetchRegions();
    }

    @action
    clearStore() {
        this.publishingPlatforms.clearData();
        this.regions.clearData();
    }
}

export default PublishOnStore
