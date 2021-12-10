import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MultiTierContentSeason from 'components/content/MultiTierContentSeason';

/**
 * The class contains logic of creating and editing of multi tier contet
 */
@observer
class MultiTierContentManagementSeason extends Component {

    /**
     * Construct an instance of the component
     */
    constructor(props) {
        super(props);
        this.processMultitierContentManagementMode = this.processMultitierContentManagementMode.bind(this);
    }

    /**
     * Fetch content on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const { route: {store}} = this.props;
        this.processMultitierContentManagementMode();
    }

    /**
     * Fetch content on a component update
     * @see Component#componentDidUpdate()
     */
    componentDidUpdate() {
        const { route: {store}} = this.props;
        this.processMultitierContentManagementMode();
    }

    /**
     * Process season selected mode
     */
    processMultitierContentManagementMode() {
        const { route: {store}, params: { contentId, seasonId } } = this.props;

        let isEditMode = !!seasonId;
        if (isEditMode) {
            store.fetchSeason(seasonId);
        } else {
            store.setContentId(contentId);
            store.fetchTitle(contentId);
        }
    }


    /**
     * @see Component#render()
     */
    render() {
        const { route: { store }, route, router } = this.props;
        return (<MultiTierContentSeason store={store} route={route} router={router}/>)
    }
}

export default MultiTierContentManagementSeason;
