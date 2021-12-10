import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import appRoutes from 'components/app.routes.config';
import PrimaryInfo from 'components/content/PrimaryInfo';
import ContentGenres from 'components/content/ContentGenres';
import { MultiTierContentFields } from 'constants/contentFields';
import CollapsiblePanel from 'components/core/CollapsiblePanel';
import Content from 'components/core/Content';
import { isSaveDraft, removeDataSaveDraftAttr, addDataSaveDraftAttr } from 'components/core/Utils';
import constants from 'constants/constants';
import MultiTierContentTitleStore from 'stores/content/MultiTierContentTitleStore';
import Notification from 'components/core/Notification';
import SeoDetails from 'components/content/SeoDetails';

/**
 * The class represents multi tier content title component
 */
@inject('appStore')
@observer
class MultiTierContentTitle extends Component {

    /** The component properties */
    static propTypes = {
        route: PropTypes.shape({
                store: PropTypes.instanceOf(MultiTierContentTitleStore)
            }).isRequired,
        router: PropTypes.shape().isRequired
    };

    /**
     * Construct a multi tier content title component
     * @param {Array} props component's arguments
     */
    constructor(props) {
        super(props);

        const { appStore } = this.props;

        this.breadCrumbs = [
            {name: constants.CONTENT_MANAGEMENT},
            {name: constants.MANAGE_CONTENT},
            {name: constants.CREATE_N_SCHEDULE_CONTENT},
            {name: constants.MULTI_TIER_CONTENT_TITLE}
        ];

        this.handlePublish = this.handlePublish.bind(this);
        this.handleSaveDraft = this.handleSaveDraft.bind(this);
        this.handleConfirmCancelPopup = this.handleConfirmCancelPopup.bind(this);
        this.redirect = this.redirect.bind(this);
        this.handleSuccessPublishing = this.handleSuccessPublishing.bind(this);
    }

    /**
     * @see Component#componentWillUnmount()
     */
    componentWillUnmount() {
        const { route: { store } } = this.props;
        store.clearData();
    }

    /**
     * Save draft content handler
     */
    handleSaveDraft() {
        const { appStore, route: { store } } = this.props;
        const resultPromise = store.id ? store.updateContentDraft() : store.createContentDraft();
        resultPromise.then(() => {
            appStore.setNotificationAfterRedirect(Notification.Notifications.info, constants.TITLE_NOTIFICATION_MESSAGE);
        });
    }

    /**
     * Publish content handler
     */
    handlePublish() {
        const { route: { store } } = this.props;
        const resultPromise = store.id ? store.updateContentPublished() : store.createContentPublished();
        resultPromise.then(this.handleSuccessPublishing);
    }

     /**
     * Success publishing handler
     */
    handleSuccessPublishing() {
        const { route: { store } } = this.props;
        store.clearData();
        this.redirect();
    }

    /**
     * Redirects to Manage content
     */
    redirect() {
        const { router, appStore, route: { store } } = this.props;
        router.push(appRoutes.MANAGE_CONTENT);
        appStore.setNotificationAfterRedirect(Notification.Notifications.info, constants.TITLE_NOTIFICATION_MESSAGE);
    }

    /**
     * Popup confirm handler
     */
    handleConfirmCancelPopup() {
        const { router } = this.props;
        router.push(appRoutes.MANAGE_CONTENT);
    }

    /**
     * @see Component#render()
     */
    render(){
        console.log(this.props.route.path.split("/").slice(-1)[0])
        const { route: { store }, router } = this.props;
        const { primaryInfo, contentGenres, seoDetails } = store;
        const { title: { primaryInfo: { fields: primaryInfoFields }, seoDetails: { fields: seoDetailsFields },contentGenres: { fields: contentGenresFields}}} = MultiTierContentFields;
        const variance = this.props.route.path.split("/").slice(-1)[0]
        return (
            <Content
                router={router}
                breadCrumbs={this.breadCrumbs}
                name='multiTierForm'
                onCancel={this.handleConfirmCancelPopup}
                onPublish={this.handlePublish}
                onSaveDraft={this.handleSaveDraft}
                isPublished={store.status == constants.CONTENT.STATUSES.PUBLISHED}>
                    <CollapsiblePanel name="Primary Info">
                        <PrimaryInfo store={primaryInfo} fields={primaryInfoFields}/>
                    </CollapsiblePanel>
                    <CollapsiblePanel name="Content Genres">
                        <ContentGenres store={contentGenres} fields={contentGenresFields}/>
                </CollapsiblePanel>
                <CollapsiblePanel name="Content SEO Details">
                    <SeoDetails
                        store={seoDetails}
                        fields={seoDetailsFields}
                    />
                </CollapsiblePanel>
            </Content>
        );
    }
}

export default MultiTierContentTitle;