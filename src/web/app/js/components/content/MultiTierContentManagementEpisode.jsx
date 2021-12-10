import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MultiTierContentEpisode from 'components/content/MultiTierContentEpisode';

/**
 * The class contains logic of creating and editing of multi tier content episode
 */
@observer
class MultiTierContentManagementEpisode extends Component {

    /**
     * Construct an instance of the component
     */
    constructor(props) {
        super(props);
        this.processMultiTierContentManagementEpisodeMode = this.processMultiTierContentManagementEpisodeMode.bind(this);

        this.editMode = false;
    }

    /**
     * Fetch content on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const { route: {store}} = this.props;
        this.processMultiTierContentManagementEpisodeMode();
    }

    /**
     * Fetch content on a component update
     * @see Component#componentDidUpdate()
     */
    componentDidUpdate() {
        const { route: {store}} = this.props;
        this.processMultiTierContentManagementEpisodeMode();
    }

    /**
     * Process episode selected mode
     */
    processMultiTierContentManagementEpisodeMode() {
        const { route: {store}, params: { seasonId, contentId, episodeId } } = this.props;
        if (episodeId) {
            this.editMode = episodeId ? true : false
            store.fetchTitles().then(() => store.fetchEpisode(episodeId, this.editMode));
        } else {
            store.setContentId(contentId);
            store.fetchTitle(contentId, seasonId);
        }
    }


    /**
     * @see Component#render()
     */
    render() {
        const { route: { store }, route, router } = this.props;
        return (<MultiTierContentEpisode
                    store={store}
                    route={route}
                    router={router}
                    editMode={this.editMode}/>)
    }
}

export default MultiTierContentManagementEpisode;
