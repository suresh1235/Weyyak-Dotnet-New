import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import PageTable from 'components/core/PageTable';
import Action from 'components/core/Action';
import ActionLink from 'components/core/ActionLink';
import Confirm from 'components/core/Confirm';
import constants from 'constants/constants';
import moment from 'moment';

import managecontent from 'css/managecontent';

/**
 * The class defines content grid data data of a content
 */
@observer
class ContentGridMultiTier extends Component {

    /** The component's properties */
    static propTypes = {
        store: PropTypes.object.isRequired,
        contentId: PropTypes.string,
        data: PropTypes.object,
        contentLevel: PropTypes.string.isRequired,
        contentType: PropTypes.string.isRequired,
        customErrorMessage: PropTypes.string.isRequired,
        getMultiTierGridLayout: PropTypes.func.isRequired,
        buildFullName: PropTypes.func,
        updateContentSeasons: PropTypes.func,
        parentLevel: PropTypes.object
    };

    /**
     * Construct an instance of the component
     */
    constructor(props) {
        super(props);

        const {getMultiTierGridLayout, store, parentLevel } = this.props;

        this.fetchCurrentPageData = store.fetchCurrentPageData.bind(store);
        this.getData = store.getData.bind(store);
        this.handleCloseConfirmPopup = this.handleCloseConfirmPopup.bind(this);
        this.handleConfirmPopup = this.handleConfirmPopup.bind(this);
        this.handleCloseConfirmPopup = this.handleCloseConfirmPopup.bind(this);

        this.state = {
            confirmPopup: {
                show: false,
                html: '',
                handler: null
            }
        };

        this.getMultiTierGridLayout = getMultiTierGridLayout.bind(this);
        this.contentGridMultiTierLayout = this.getMultiTierGridLayout(store, parentLevel);
    }

    /**
     * Handler of select change event
     * @param {String} field - field name
     * @param {Object} item - value object
     * @param {Object} event - change event
     */
    changeSelectValue(field, item, event) {
        const {store, contentLevel} = this.props;
        store.changeSelectValue(field, item, contentLevel, event.target.value);
        (field == 'rights.digitalRightsType') && store.fetchUpdateContentRightsType(item, event.target.value, contentLevel);
    }

    /**
     * Change status handler
     * @param {Object} item - content item
     * @param {Object} event - event object
     */
    handleChangeStatus(item, event) {
        const status = event.target.value;
        const {store, contentLevel} = this.props;
        store.fetchUpdateContentStatus(item, status, contentLevel);
    }

    /**
     * Delete content item handler
     * @param {Object} item - content item
     */
    handleDelete(item) {
        const {contentType} = this.props;
        let html = '', title = '', cancelText = 'No', confirmText = 'Yes', handler = this.deleteContent.bind(this, item);

        title = `Delete ${contentType}`;
        html =`Are you sure you want to delete ${contentType.toLowerCase()}?`;

        this.setState({
            confirmPopup: {
                show : true,
                html,
                handler,
                cancelText,
                confirmText,
                title
            }
        });
    }

    /**
     * Delete content
     * @param {Object} item - content item
     */
    deleteContent(item) {
        const {store, contentLevel, updateContentSeasons, handleDataAfterDelete} = this.props;
        const deleteContentPromise = store.fetchDeleteContent(item.id, contentLevel);
        deleteContentPromise.then(this.handleCloseConfirmPopup);
        updateContentSeasons && updateContentSeasons(item.id);
        handleDataAfterDelete(item);
    }

    /**
     *  Confirm popup handler
     */
    handleConfirmPopup() {
        const { handler } = this.state.confirmPopup;
        handler && handler();
    }

    /**
     * Close confirm popup handler
     */
    handleCloseConfirmPopup() {
        this.setState({
            confirmPopup: {
                show: false,
                html: '',
                handler: null
            }
        })
    }

    /**
     * Render cancel confirmation popup
     * @returns {ReactNode} popup node
     */
    renderConfirmationView() {
        const { html, show, cancelText, confirmText, title } = this.state.confirmPopup;
        return (
            <Confirm
                key="confirm"
                onConfirm={this.handleConfirmPopup}
                onClose={this.handleCloseConfirmPopup}
                body={html}
                visible={show}
                cancelText={cancelText}
                confirmText={confirmText}
                title={title}
            />
        );
    }

    /**
     * Fetch fetch digital rights types and fetch digital rights regions on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const {store, contentId, contentLevel} = this.props;
        store.fetchParentStatuses();
        store.fetchDigitalRightsTypes();
        store.fetchDigitalRightsRegions();
        this.fetchCurrentPageData(contentId, contentLevel);
    }

    /**
     * @see Component#componentDidUpdate()
     */
    componentDidUpdate() {
        const { contentId, contentLevel, store } = this.props;
        this.fetchCurrentPageData(contentId, contentLevel);
    }

    /**
     * @see Component#render()
     */
    render() {
        const { customErrorMessage, contentId, contentLevel, parentLevel, getMultiTierGridLayout, store } = this.props;
        this.contentGridMultiTierLayout = this.getMultiTierGridLayout(store, parentLevel);

        return (
            <div>
                <PageTable
                    layout={this.contentGridMultiTierLayout}
                    customErrorMessage={contentId ? customErrorMessage : null}
                    fetchData={(data) => this.fetchCurrentPageData(contentId, contentLevel, data)}
                    pageSize={10}
                    getData={this.getData}>
                </PageTable>
                {this.renderConfirmationView()}
            </div>
        );
    }
}

export default ContentGridMultiTier;
