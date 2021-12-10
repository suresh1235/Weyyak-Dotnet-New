import PrimaryInfoOTCStore from 'stores/content/PrimaryInfoOTCStore';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils';

/*
 Primary info for multi tier content store
 */
class PrimaryInfoTitleMTCStore extends PrimaryInfoOTCStore {
    /**
     * Fetch multi tier content content types
     * @returns {Promise} a call api promise
     */
    fetchContentTypes() {
        return this.Transport.callApi(endpoints.GET_MULTI_TIER_CONTENT_TYPES).then(res => {
            this.setContentTypes.call(this, res.data);
        });
    }
}

export default PrimaryInfoTitleMTCStore