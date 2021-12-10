import React, { Component } from 'react';
import { observer } from 'mobx-react';
import OneTierContent from 'components/content/OneTierContent';
import { scrollUp } from  'components/core/Utils';
import constants from 'constants/constants';

/**
 * The class contains logic of creating and editing of one tier content
 */
@observer
class ContentManagement extends Component {

    /**
     * Content management modes
     * @type {{CREATE_CONTENT: number, ADD_VARIANCE: number, EDIT_CONTENT_MODE: number}}
     */
    static mode = {
        CREATE_CONTENT : 0,
        ADD_VARIANCE: 1,
        EDIT_CONTENT_MODE: 2
    };

    constructor(props) {
        super(props);
        this.state = {
            scrollToExpandedVariance : false,
            editMode : false
        };

        this.processContentManagementMode = this.processContentManagementMode.bind(this);
    }

    /**
     * Fetch content on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const { route: {store}} = this.props;

        store.fetchAllMaps()
             .then(this.processContentManagementMode);
        store.fetchPlans();
    }

    /**
     * Clear store if creating mode after editing on a component updating
     * @param {Object} nextProps
     */
    componentWillUpdate(nextProps) {
        const  { route: { mode: prevMode } } = this.props;
        const  { route: { mode, store } } = nextProps;

        if (mode == ContentManagement.mode.CREATE_CONTENT && prevMode !== ContentManagement.mode.CREATE_CONTENT) {
            this.clearStoreAndScrollUp();
            this.toggleVariance();
        }

        //fetch data if content has been saved draft
        if (store.status == constants.CONTENT.STATUSES.DRAFT && prevMode == ContentManagement.mode.CREATE_CONTENT
                &&  mode == ContentManagement.mode.EDIT_CONTENT_MODE) {
            store.fetchOneTierContent(store.id, {
                addNewVariance: false,
            }).then(scrollUp);
        }
    }

    /**
     * Clear store if editing mode or adding variance mode after editing on a component unmounting
     */
    componentWillUnmount() {
        this.clearStoreAndScrollUp();
    }

    /**
     * Clear store and scroll up to the beginning of the page
     */
    clearStoreAndScrollUp() {
        const { route: { store } } = this.props;

        scrollUp();
        store.clearStore();
    }

    /**
     * Toggle variance (default first variance)
     * @param {Number} index - index of variance
     */
    toggleVariance(index = 0) {
        const  { route: { store } } = this.props;
        store.textualData.contentVariances.toggleVariance(index);
    }

    /**
     * Process Content Management selected mode
     */
    processContentManagementMode() {
        const { route: {store, mode}, params: { varianceId, contentId } } = this.props;

        if (mode != ContentManagement.mode.CREATE_CONTENT) {
            this.setState({
                editMode : true
            });
            store.fetchOneTierContent(contentId, {
                addNewVariance: mode == ContentManagement.mode.ADD_VARIANCE,
                selectedVarianceId : varianceId
            })
            .then(() => {
                    this.setState({
                        scrollToExpandedVariance : true
                    });
                });
        }
        else {
            this.setState({
                editMode : false
            });
            this.toggleVariance();
        }
    }


    /**
     * @see Component#render()
     */
    render() {
        const { route: { store }, router } = this.props;

        return (<OneTierContent
            store={store}
            router={router}
            editMode={this.state.editMode}
            scrollToExpandedVariance={this.state.scrollToExpandedVariance}/>)
    }
}

export default ContentManagement;
