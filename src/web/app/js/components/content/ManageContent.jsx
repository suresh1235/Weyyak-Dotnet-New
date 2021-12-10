import React, { Component } from 'react';
import { Grid, Row, FormControl } from 'react-bootstrap';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import endpoints from 'transport/endpoints';
import { toJS } from 'mobx';

import PageTable from 'components/core/PageTable';
import BreadCrumbs from 'components/core/BreadCrumbs';
import Action from 'components/core/Action';
import ActionLink from 'components/core/ActionLink';
import Confirm from 'components/core/Confirm';
import appRoutes from 'components/app.routes.config';
import constants from 'constants/constants';
import moment from 'moment';
import managecontent from 'css/managecontent';
import { getMultiTierSeasonGridLayout } from '../../constants/contentFields';

/**
 * The class defines a one and multi tier data of a content
 */
@observer
class ManageContent extends Component {

    /**
     * Construct manage content component
     * @param {Array} props - components properties
     */
    constructor(props) {
        super(props);

        const {route: {store}} = props;

        this.fetchManageContentData = store.fetchManageContentData.bind(store);
        this.getData = store.getData.bind(store);
        this.handleCloseConfirmPopup = this.handleCloseConfirmPopup.bind(this);
        this.handleConfirmPopup = this.handleConfirmPopup.bind(this);
        this.renderAddChildItemAction = this.renderAddChildItemAction.bind(this);
        this.renderAddChildItem = this.renderAddChildItem.bind(this);
        this.renderEditItemAction = this.renderEditItemAction.bind(this);
        // this.renderEditItemActionExceptRightSection = this.renderEditItemActionExceptRightSection.bind(this);
        this.renderDeleteItemAction = this.renderDeleteItemAction.bind(this);

        this.breadCrumbs = [
            { name: constants.CONTENT_MANAGEMENT, path: appRoutes.MANAGE_CONTENT },
            { name: constants.MANAGE_CONTENT }
        ];

        this.state = {
            confirmPopup: {
                show: false,
                html: '',
                handler: null
            }
        };

        this.manageContentLayout = {
            columns: [
                {
                    name: 'Content Title',
                    key: 'transliteratedTitle',
                    actions: item => {
                        if (toJS(item.children) && Object.keys(toJS(item.children)).length !== 0) {
                            return [ item.children && <Action key={`item_${item.id}`}
                                icon={`${item.expanded ? 'minus-square-o' : 'plus-square-o'}`}
                                title="Expand/Collpase"
                                onClick={this.toggleExpand.bind(this, item)}/>,

                            <span
                                key="contentTitleParent"
                                className="content-title ">
                                {item.contentTitle}
                            </span>]
                        } else {
                        return [
                            <span
                                key="contentTitleParent"
                                className="content-title ">
                            {item.contentTitle}
                            </span>]
                        }
                    }
                },
                {
                    name: 'Status',
                    key: 'status',
                    actions: item => [
                        <FormControl
                            key="select"
                            className="form-control"
                            componentClass="select"
                            onChange={this.handleChangeStatus.bind(this, item)}
                            disabled={!item.statusCanBeChanged}
                            value={item.status}>
                            {
                                store.parentStatuses && store.parentStatuses.map((option, index) =>
                                    <option key={index} value={option.id}>
                                        {option.name}
                                    </option>
                                )
                            }
                        </FormControl>
                    ]
                },
                {
                    name: 'Sub-State',
                    key: 'subStatusName',
                    className: 'text-center'
                },
                {
                    name: 'Scheduled On',
                    key: 'schedulingDateTime',
                    className: 'text-center',
                    format: value => value && moment(value).format('DD/MM/YYYY HH:mm:ss')
                },
                {
                    name: 'Digital Rights Start Date',
                    key: 'digitalRightsStartDate',
                    className: 'text-center',
                    actions: item => [
                        item.level === 1 ?
                            item.rights && item.rights.digitalRightsStartDate && moment(item.rights.digitalRightsStartDate).format('DD/MM/YYYY') :
                            item.level === 2 ?
                                item.parent.rights && item.parent.rights.digitalRightsStartDate && moment(item.parent.rights.digitalRightsStartDate).format('DD/MM/YYYY') :
                                null
                    ]
                },
                {
                    name: 'Digital Rights End Date',
                    key: 'digitalRightsEndDate',
                    className: 'text-center',
                    actions: item => [
                        item.level === 1 ?
                            item.rights && item.rights.digitalRightsEndDate && moment(item.rights.digitalRightsEndDate).format('DD/MM/YYYY') :
                            item.level === 2 ?
                                item.parent.rights && item.parent.rights.digitalRightsEndDate && moment(item.parent.rights.digitalRightsEndDate).format('DD/MM/YYYY') :
                                null
                    ]

                },
                {
                    name: 'Rights Type',
                    key: 'rightsType',
                    actions: item => [
                        item.level === 1 ? (item.rights.digitalRightsType == 1? "AVOD":"SVOD") : null
                    //     <FormControl
                    //         key="select"
                    //         className="form-control rights-type-select"
                    //         componentClass="select"
                    //         onChange={this.handleRightsTypeChanged.bind(this, item)}
                    //         value={item.rights.digitalRightsType}>
                    //         {
                    //             store.digitalRightsTypes && store.digitalRightsTypes.map((option, index) =>
                    //                 <option key={index} value={option.id} disabled={option.id != 1}>
                    //                     {option.name}
                    //                 </option>
                    //             )
                    //         }
                    //     </FormControl> : null
                     ]
                },
                {
                    name: 'Created By',
                    key: 'createdBy'
                },
                {
                    name: 'Actions',
                    key: 'actions',
                    actions: item => {
                        return [
                            this.renderAddChildItem(item),
                            //  this.renderEditItemActionExceptRightSection(item),
                            this.renderAddChildItemAction(item),
                            this.renderEditItemAction(item),
                            this.renderDeleteItemAction(item)
                        ];
                    }
                }
            ]
        };

        this.filters = [
            {
                name: 'searchText',
                type: 'search',
                defaultValue: '',
                placeholder: 'Search',
                page:'Contents'
            },
            {
                name: 'contentType',
                type: 'select',
                data: [
                    {
                        id: 'All',
                        name: 'Content Type',
                        selected: true
                    },
                    {
                        id: 'Movie',
                        name: 'Movie',
                        selected: false
                    },
                    {
                        id: 'Series',
                        name: 'Series',
                        selected: false
                    },
                    {
                        id: 'Program',
                        name: 'Program',
                        selected: false
                    },
                    {
                        id: 'Play',
                        name: 'Play',
                        selected: false
                    }
                ]
            }
        ];
    }

    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    /**
     * Shows or hides child rows.
     * @param {Object} item - current row data.
     */
    toggleExpand(item) {
        const {route: {store}} = this.props;
        store.toggleExpand(item)
    }

    /**
     * Rights type changed handle
     * @param {Object} item - content item
     * @param {Object} event - event object
     */
    handleRightsTypeChanged(item, event) {
        const { route: { store }} = this.props;
        let value = event.target.value;

        store.fetchUpdateDigitalRightsType(item, value)
            .then(() => store.setRightsType(item, value));
    }

    /**
     * Change status handler
     * @param {Object} item - content item
     * @param {Object} event - event object
     */
    handleChangeStatus(item, event) {
        const status = event.target.value;
        const { route: { store }} = this.props;

        if (item.type === constants.CONTENT.TIERS.ONE_TIER.ID) {
            item.level === 0 && store.fetchUpdateStatus(item.id, item.id, status, endpoints.UPDATE_OTC_STATUS);
            item.level === 1 && store.fetchUpdateStatus(item.parent.id, item.id, status, endpoints.VARIANCES.UPDATE_STATUS);
        } else {
            item.level === 0 && store.fetchUpdateStatus(item.id, item.id, status, endpoints.UPDATE_MTC_STATUS);
            item.level === 1 && store.fetchUpdateStatus(item.parent.id, item.id, status, endpoints.SEASONS.UPDATE_STATUS);
            item.level === 2 && store.fetchUpdateStatus(item.parent.parent.id, item.id, status, endpoints.EPISODES.UPDATE_STATUS);
        }
    }

    /**
     * Delete content or variance handler
     * @param {Object} item - content item
     */
    handleDelete(item, deleteItemConfig) {
        let html = deleteItemConfig.html,
            title = `Delete ${deleteItemConfig.itemName}`,
            cancelText = 'No',
            confirmText = 'Yes',
            handler = this.deleteContent.bind(this, item);

        if (item.type === constants.CONTENT.TIERS.ONE_TIER.ID &&
            item.level === 1 &&
            item.parent.children.length === constants.CONTENT.CONTENT_VARIANCES.MIN_AMOUNT) {

                html = `There is only one Variance. It can not be deleted`;
                cancelText = null;
                confirmText = 'Ok';
                handler = this.handleCloseConfirmPopup.bind(this);
        }

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
     * Fetch fetch digital rights types and fetch digital rights regions on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const { route: { store }} = this.props;
        store.fetchParentStatuses();
        store.fetchDigitalRightsTypes();
        store.fetchDigitalRightsRegions();
        var searchValue = this.getCookie('searchText');
        var contentType = this.getCookie('contentType');
        this.filters[0].defaultValue = searchValue;
        this.filters[1].value = contentType == "" ? "All" : contentType;
    }

    /**
     * Delete content
     * @param {Object} item - content item
     */
    deleteContent(item) {
        const { route: {store} } = this.props;

        let deleteContentPromise = null;

        if (item.type === constants.CONTENT.TIERS.ONE_TIER.ID) {
            if (item.level === 0) {
                deleteContentPromise = store.fetchDeleteContent(item.id);
            } else {
                deleteContentPromise = store.fetchDeleteVariance(item.parent.id, item.id)
            }
        } else {
            if (item.level === 0) {
                deleteContentPromise = store.fetchDeleteMultiTierContent(item.id);
            } else if (item.level === 1) {
                deleteContentPromise = store.fetchDeleteSeason(item.parent.id, item.id);
            } else {
                deleteContentPromise = store.fetchDeleteEpisode(item.parent.parent.id, item.parent.id, item.id);
            }
        }

        deleteContentPromise.then(this.handleCloseConfirmPopup.bind(this));
    }

    /**
     * Render add child action for parent item
     * @param {Object} item - content item
     */
    renderAddChildItemAction(item) {
        let addChildItemConfig = {
            route : null,
            itemName : null,
            className : null
        };

        if (item.type === constants.CONTENT.TIERS.ONE_TIER.ID) {
            // Content Variances Disabled
            // if (item.level === 0) {
            //     addChildItemConfig.route = appRoutes.ADD_VARIANCE.replace(':contentId', item.id);
            //     addChildItemConfig.itemName = 'Variance';
            //     addChildItemConfig.className = classNames({'bo-essel-action-disabled': item.children.length === constants.CONTENT.CONTENT_VARIANCES.MAX_AMOUNT});
            // }
        } else {
            if (item.level === 0) {
                addChildItemConfig.route = appRoutes.ADD_SEASON.replace(':contentId', item.id);
                addChildItemConfig.itemName = 'Season';
            }
            if (item.level === 1) {
                addChildItemConfig.route = appRoutes.ADD_EPISODE.replace(':contentId', item.parent.id).replace(':seasonId', item.id);
                addChildItemConfig.itemName = 'Episode';
            }
        }

        return (
            addChildItemConfig.route &&
            <ActionLink key="plus"
                        to={addChildItemConfig.route}
                        title={`Add ${addChildItemConfig.itemName}`}
                        icon="plus"
                        className={addChildItemConfig.className}/>
        );
    }

    renderAddChildItem(item) {
        let addChildItemConfig = {
            route : null,
            itemName : null,
            className : null
        };
        if (item.type === constants.CONTENT.TIERS.MULTI_TIER.ID){
            // if (item.level === 0) {
            //     addChildItemConfig.route = appRoutes.ADD_SEASON.replace(':contentId', item.id);
            //     addChildItemConfig.itemName = 'Season';
            // }
            if (item.level === 1) {
                addChildItemConfig.route = appRoutes.EDIT_SEASON_VARIANCE.replace(":seasonId",item.id);
                addChildItemConfig.itemName = 'Variance';
            }
        }


        // if (item.type === constants.CONTENT.TIERS.ONE_TIER.ID) {
        //     // Content Variances Disabled
        //     // if (item.level === 0) {
        //     //     addChildItemConfig.route = appRoutes.ADD_VARIANCE.replace(':contentId', item.id);
        //     //     addChildItemConfig.itemName = 'Variance';
        //     //     addChildItemConfig.className = classNames({'bo-essel-action-disabled': item.children.length === constants.CONTENT.CONTENT_VARIANCES.MAX_AMOUNT});
        //     // }
        // } else {
        //     if (item.level === 0) {
        //         addChildItemConfig.route = appRoutes.ADD_SEASON.replace(':contentId', item.id);
        //         addChildItemConfig.itemName = 'Season';
        //     }
        //     if (item.level === 1) {
        //         addChildItemConfig.route = appRoutes.MULTI_TIER_CONTENT_SEASON_VARIANCE;
        //         addChildItemConfig.itemName = 'Episode';
        //     }
        // }

        return (
            addChildItemConfig.route &&
            <ActionLink key="plus1"
                        to={addChildItemConfig.route}
                        title={`Add ${addChildItemConfig.itemName}`}
                        icon="addv"
                        className={addChildItemConfig.className}/>
        );
    }

    /**
     * Render edit action for item
     * @param {Object} item - content item
     */
    renderEditItemAction(item) {
        let editItemConfig = {
            route: null,
            itemName: null
        };

        if (item.type === constants.CONTENT.TIERS.ONE_TIER.ID) {
            if (item.level === 0) {
                editItemConfig.route = appRoutes.EDIT_ONE_TIER_CONTENT.replace(':contentId', item.id);
                editItemConfig.itemName = 'Title';
            } else {
                editItemConfig.route = appRoutes.EDIT_VARIANCE.replace(':contentId', item.parent.id).replace(':varianceId', item.id);
                editItemConfig.itemName = 'Variance';
            }
        } else {
            if (item.level === 0) {
                editItemConfig.route = appRoutes.EDIT_TITLE.replace(':contentId', item.id);
                editItemConfig.itemName = 'Title';
            } else if (item.level === 1) {
                editItemConfig.route = appRoutes.EDIT_SEASON.replace(':seasonId', item.id);
                editItemConfig.itemName = 'Season';
            } else {
                editItemConfig.route = appRoutes.EDIT_EPISODE.replace(':episodeId', item.id);
                editItemConfig.itemName = 'Episode';
            }
        }

        return (
            editItemConfig.route &&
            <ActionLink key="edit"
                        to={editItemConfig.route}
                        title={`Edit ${editItemConfig.itemName}`}
                        icon="edit"/>
        );
    }
/**
     * Render edit action for item except Right section
     * @param {Object} item - content item
     */
    // renderEditItemActionExceptRightSection(item) {
    //     let editItemConfig = {
    //         route: null,
    //         itemName: null
    //     };

    //     if (item.type === constants.CONTENT.TIERS.ONE_TIER.ID) {
    //         if (item.level === 0) {
    //             editItemConfig.route = appRoutes.EDIT_ONE_TIER_CONTENT.replace(':contentId', item.id);
    //             editItemConfig.itemName = 'Title';
    //         } else {
    //             editItemConfig.route = appRoutes.EDIT_VARIANCE.replace(':contentId', item.parent.id).replace(':varianceId', item.id);
    //             editItemConfig.itemName = 'Variance';
    //         }
    //     } else {
    //         if (item.level === 0) {
    //             editItemConfig.route = appRoutes.EDIT_TITLE.replace(':contentId', item.id);
    //             editItemConfig.itemName = 'Title';
    //         } else if (item.level === 1) {
    //             editItemConfig.route = appRoutes.EDIT_SEASON_VARIANCE.replace(':seasonId', item.id);
    //             editItemConfig.itemName = 'Season';
    //         } else {
    //             editItemConfig.route = appRoutes.EDIT_EPISODE.replace(':episodeId', item.id);
    //             editItemConfig.itemName = 'Episode';
    //         }
    //     }

    //     if(item.level === 1){
    //              return (
    //         editItemConfig.route &&
    //         <ActionLink key="editsection"
    //                     to={editItemConfig.route}
    //                     title={`Edit ${editItemConfig.itemName}`}
    //                     icon="edit"/>
    //     );
    //     }

        
    // }


    /**
     * Render edit action for item
     * @param {Object} item - content item
     */
    renderDeleteItemAction(item) {
        const questionText = "Are you sure you want to delete";

        let deleteItemConfig = {
            itemName: null,
            html: null
        };

        if (item.type === constants.CONTENT.TIERS.ONE_TIER.ID) {
            if (item.level === 0) {
                deleteItemConfig.itemName = 'Title';
                deleteItemConfig.html = `${questionText} ${item.transliteratedTitle} title with all its Variances?`;
            } else {
                deleteItemConfig.itemName = 'Variance';
                deleteItemConfig.html = `${questionText} ${item.contentTitle} variance?`;

            }
        } else {
            if (item.level === 0) {
                deleteItemConfig.itemName = 'Title';
                deleteItemConfig.html = `${questionText} ${item.transliteratedTitle} title with all its Seasons and Episodes?`;
            } else if (item.level === 1) {
                deleteItemConfig.itemName = 'Season';
                deleteItemConfig.html = `${questionText} ${item.contentTitle} season with all its Episodes?`;
            } else {
                deleteItemConfig.itemName = 'Episode';
                deleteItemConfig.html = `${questionText} ${item.contentTitle} episode?`;
            }
        }

        return (
            <Action key="remove"
                    icon="remove"
                    title={`Delete ${deleteItemConfig.itemName}`}
                    onClick={this.handleDelete.bind(this, item, deleteItemConfig)}/>
        );
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
     * @see Component#render()
     */
    render() {
        const { router } = this.props;

        return (
            <Grid>
                <Row className="bread-crumbs">
                    <BreadCrumbs router={router} crumbs={this.breadCrumbs} />
                </Row>
                <Row className="main-content">
                    <PageTable
                        layout={this.manageContentLayout}
                        filters={this.filters}
                        fetchData={this.fetchManageContentData}
                        getData={this.getData}>
                    </PageTable>
                </Row>
                {this.renderConfirmationView()}
            </Grid>
        );
    }
}

export default ManageContent;
