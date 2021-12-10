import Store from 'stores/Store';
import MultiTierContentTitleStore from 'stores/content/MultiTierContentTitleStore';
import MultiTierContentSeasonStore from 'stores/content/MultiTierContentSeasonStore';
import MultiTierContentEpisodeStore from 'stores/content/MultiTierContentEpisodeStore';

/**
 * The Multi tier content store
 */
class MultiTierContentStore extends Store {

    /**
     * Construct a multi tier content store
     * @param {Array} props - a store's arguments
     */
    constructor(args) {
        super(args);
        this.title = new MultiTierContentTitleStore(args);
        this.season = new MultiTierContentSeasonStore(args);
        this.episode = new MultiTierContentEpisodeStore(args);
    }
}

export default MultiTierContentStore
