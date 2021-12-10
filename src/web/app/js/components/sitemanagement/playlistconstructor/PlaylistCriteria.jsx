import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import { getValidationMessage } from 'components/core/Utils';
import validationMessages from 'validations/validationMessages';
import Action from 'components/core/Action';
import PageTable from 'components/core/PageTable';
import SearchGroup from 'components/core/SearchGroup';
import Playlist from 'components/sitemanagement/playlistconstructor/Playlist';
import classNames from 'classnames';
import Confirm from 'components/core/Confirm';
import { findDOMNode } from 'react-dom';

import {
    FormControl,
    Select,
    Row,
    Col,
    Modal,
    Button
} from 'react-bootstrap';

import playlistcriteria from 'css/playlistcriteria';

/**
 * The class defines a Playlist Criteria component
 */
@observer
class PlaylistCriteria extends Component {

    static componentConstants = {
        minSearchTextLength: 2,
        productionYearTypeNumber: 12,
        languageTypeNumber: 13
    }

    /** The component's properties */
    static propTypes = {
        store: PropTypes.object.isRequired,
        value:PropTypes.string
    };

    /**
     * Construct Playlist Criteria component
     * @param {Object} props - components properties
     */
    constructor(props) {
        super(props);

        const { store,fields } = this.props;

        this.prevFilterType = null;

        this.state = {
            sourceItemsExpanded: [],
            playlistItemsExpanded: [],
            confirmPopup: {
                show: false,
                html: '',
                handler: null
            }
        }

        this.playlistCriteriaLayout = {
            columns: [
                {
                    name: 'name',
                    key: 'name',
                    actions: item => {
                        const activityState = this.state.sourceItemsExpanded.indexOf(item.id) != -1;
                        return [
                            <span key="name" className="item-name">{`${item.name}`}</span>,
                            <Action key="addItem"
                                    icon="plus"
                                    className="add-item"
                                    title="Add Item"
                                    onClick={this.addItem.bind(this, item,this.props.value)}/>,
                                this.isGroup(item.type) ? <Action key="viewActivity"
                                icon={`${!activityState ? 'angle-down' : 'angle-up'}`}
                                title="Show child elements"
                                className="show-hide-child-elements-item"
                                onClick={this.toggleChildrenView.bind(this, item.id, 'sourceItemsExpanded')}/> : null
                        ];
                    }
                }
            ]
        };

        this.playlistCriteriaChildrenLayout = {
            columns: [
                {
                    name: 'name',
                    key: 'name',
                    actions: item => {
                        return [
                            <span key={item.id}>{`${item.name}`}</span>
                        ];
                    }
                }
            ]
        }

        this.fetchPlaylistFilters = store.fetchPlaylistFilters.bind(store);
        this.fetchPlaylistTypes = store.fetchPlaylistTypes.bind(store);
        this.fetchLanguages = store.fetchLanguages.bind(store);
        this.changeSearchFilter = this.changeSearchFilter.bind(this)
        this.changeType = this.changeType.bind(this)
        this.setSearchText = this.setSearchText.bind(this);
        this.fetchSourceItems = store.fetchSourceItems.bind(store);
        this.getSourceItems = store.getSourceItems.bind(store);
        this.getFilteredTableData = this.getFilteredTableData.bind(this);
        this.handleCloseConfirmPopup = this.handleCloseConfirmPopup.bind(this);
    }

    /**
     * Add new item to plalist
     * @param {Object} item
     */
    addItem(item,value) {
        const {contentType, store} = this.props;
        console.log(this.props.value)
        console.log(item.type)

        console.log(this.prevFilterTypeNew)

        if(this.props.value=="pagecontent" && item.type!=14)
        {
            let html = '', title = '', confirmText = 'Ok';
            title = 'Can\'t add item';
            html = 'Add item with correct contenttype';
            this.setState({
                confirmPopup: {
                    show : true,
                    html,
                    confirmText,
                    title
                }
            });
            return false

        }

        if(this.props.value=="content" && item.type==14)
        {
            let html = '', title = '', confirmText = 'Ok';
            title = 'Can\'t add item';
            html = 'Add item with correct contenttype';
            this.setState({
                confirmPopup: {
                    show : true,
                    html,
                    confirmText,
                    title
                }
            });
            return false

        }

        var ttype= this.prevFilterTypeNew !=undefined ? this.prevFilterTypeNew : this.props.value
        // console.log(store.findType(this.prevFilterTypeNew))
        if(store.findType(ttype))
        {
            let html = '', title = '', confirmText = 'Ok';
            title = 'Can\'t add item';
            html = 'Please add item with same Content Type';
            this.setState({
                confirmPopup: {
                    show : true,
                    html,
                    confirmText,
                    title
                }
            });
            return false

        }

        if ( !(this.props.value=="pagecontent" && item.type!=14) && !(this.props.value=="content" && item.type==14) && !store.findType(ttype) && store.addItem(item)) {
            let html = '', title = '', confirmText = 'Ok';
            title = 'Can\'t add item';
            html = 'This item has already been added to the playlist';
            this.setState({
                confirmPopup: {
                    show : true,
                    html,
                    confirmText,
                    title
                }
            });

        }



        
    }

    /**
     * Emptiess source expandable items and retrieves table data
     */
    getFilteredTableData() {
        const { store } = this.props;
        this.setState({
            sourceItemsExpanded: []
        });
        store.getFilteredTableData();
    }

    /**
     * Sets search text to store
     * @param {event} object - event data
     */
    setSearchText(event) {
        const { store } = this.props;
        const { target: { value } } = event;
        if (this.prevFilterType == PlaylistCriteria.componentConstants.productionYearTypeNumber) {
            this.validateProductionYearValue(value);
        } else {
            store.setSearchText(value);
        }
    }

    /**
     * Validates input value (YYYY or YYYY-YYYY format)
     * @param {String} value - input value
     */
    validateProductionYearValue(value) {
        const { store } = this.props;
        ((/^\d{0,4}$/).test(value) || (/^\d{4}-\d{0,4}$/).test(value)) && store.setSearchText(value)
    }

    /**
     * Sets search filter to store
     * @param {event} object - event data
     */
    changeSearchFilter(event) {
        const { store } = this.props;
        const { languageTypeNumber, productionYearTypeNumber } = PlaylistCriteria.componentConstants;
        let { target: { value } } = event;
        if ((this.prevFilterType != languageTypeNumber && value == languageTypeNumber) ||
                (this.prevFilterType == languageTypeNumber && value != languageTypeNumber) ||
            (this.prevFilterType != productionYearTypeNumber && value == productionYearTypeNumber) ||
                (this.prevFilterType == productionYearTypeNumber && value != productionYearTypeNumber)) {
            store.setSearchText('');
        }
        this.prevFilterType = value
        store.changeSearchFilter(value);
    }

    changeType(event) {
        const { store } = this.props;
        const { languageTypeNumber, productionYearTypeNumber } = PlaylistCriteria.componentConstants;
        let { target: { value } } = event;
        if ((this.prevFilterType != languageTypeNumber && value == languageTypeNumber) ||
                (this.prevFilterType == languageTypeNumber && value != languageTypeNumber) ||
            (this.prevFilterType != productionYearTypeNumber && value == productionYearTypeNumber) ||
                (this.prevFilterType == productionYearTypeNumber && value != productionYearTypeNumber)) {
            store.setSearchText('');
        }
        this.prevFilterTypeNew = value
        store.changeType(value);
    }

    /**
     * Show or hide content type item nodes
     * @param {String} itemId - a item identifier
     * @param {String} listName - list name
     */
    toggleChildrenView(itemId, listName) {
        let childrenList = this.state[listName];
        const index = childrenList.indexOf(itemId);
        if (index == -1) {
            childrenList.push(itemId)
        } else {
            childrenList.splice(index, 1)
        }
        this.setState({ [listName]: childrenList });
    }

    /**
     * Remove element from playlist
     * @param {Object} store - store
     * @param {Object} dataItem - current item
     */
    removeElement(dataItem, event) {
        let childrenList = this.state['playlistItemsExpanded'];
        const { store } = this.props;
        const index = this.state['playlistItemsExpanded'].indexOf(dataItem.id);
        if (index != -1) {
           childrenList.splice(index, 1);
           this.setState({ ['playlistItemsExpanded']: childrenList });
        }
        store.removeElement(dataItem);
    }

    /**
     * Is select available
     * @param {Number} filterType - filter type
     * @returns {Boolean} is select available
     */
    isSelectAvailable(filterType) {
        return filterType == PlaylistCriteria.componentConstants.languageTypeNumber
    }

    /**
     * Is dynamic group
     * @param {Number} type - item type
     * @returns {Boolean} is corrent item is dynamic group
     */
    isGroup(type) {
        return type > 3
    }

    /**
     * Is search enabled
     * @param {String} searchText - input value
     * @returns {Boolean} is production year value valid
     */
    isProductionYearValueValid(searchText) {
        return (/^\d{4}(-\d{4})?$/).test(searchText);
    }

    /**
     * Is search enabled
     * @param {String} searchText - input value
     * @param {String} filterType - filter type
     * @returns {Boolean} is search enabled
     */
    searchEnabled(searchText, filterType) {
        const { productionYearTypeNumber, minSearchTextLength } = PlaylistCriteria.componentConstants;
        if (this.prevFilterType == productionYearTypeNumber) {
            return this.isProductionYearValueValid(searchText);
        } else {
            return (searchText.length > minSearchTextLength &&
                        filterType.length != 0 &&
                        searchText.trim().length)
        }
    }

    /**
     * Returns node table of parent element
     * @param {Object} data - children object
     * @returns {Element} table
     */
    getExpandableItems(data) {
        const { store } = this.props;

        return data ? data.data.reduce((value, item) => {
                value[item.id] = (this.state.sourceItemsExpanded.indexOf(item.id) != -1) ? <PageTable
                    key={`${item.name}_${item.id}`}
                    fetchData={store.fetchSourceItemsData.bind(store, item.id, item.type)}
                    getData={store.getSourceItemsData.bind(store, item.id)}
                    hideTableHead={true}
                    layout={this.playlistCriteriaLayout}
                    tableClassName={classNames({'bo-essel-page-inner-table': true})}
                    isRowActive={() => true}
                    pageSize={10}
                /> : null;
                return value;
            }, {}) : null;
    }

    /**
     * Returns node element
     * @param {Object} data - children object
     * @returns {Element} table row
     */
    renderPlaylistItem(data) {
        const { store } = this.props;
        const playlistTypes = store.getPlaylistTypes();

        return data && data.map(item => {
            const activityState = this.state.playlistItemsExpanded.indexOf(item.id) != -1;
            return playlistTypes.length ? <Playlist
                        key={item.id}
                        playlistItem={item}
                        activityState={activityState}
                        playlistTypes={playlistTypes}
                        isGroup={this.isGroup(item.type)}
                        moveElementUpper={store.moveElementUpper.bind(store, item)}
                        moveElementLower={store.moveElementLower.bind(store, item)}
                        removeElement={this.removeElement.bind(this, item)}
                        toggleChildrenView={this.toggleChildrenView.bind(this, item.id, 'playlistItemsExpanded')}
                        fetchPlaylistItems={store.fetchPlaylistItems.bind(store, item.id, item.type)}
                        getPlaylistItems={store.getPlaylistItems.bind(store, item.id)}
                        gridLayout={this.playlistCriteriaChildrenLayout}
                    /> : null
        })
    }

    /**
     * Render confirmation popup
     * @returns {ReactNode} popup node
     */
    renderConfirmationView() {
        const { html, show, cancelText, confirmText, title } = this.state.confirmPopup;
        return (
            <Confirm
                key="confirm"
                onConfirm={this.handleCloseConfirmPopup}
                onClose={this.handleCloseConfirmPopup}
                body={html}
                visible={show}
                cancelText=''
                confirmText={confirmText}
                title={title}
            />
        );
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
     * Fetch playlist filters on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        this.fetchPlaylistFilters();
        this.fetchPlaylistTypes();
        this.fetchLanguages();
    }

    /**
     * @see Component#render()
     */
    render() {
        const {
            store,
            store: {
                searchText,
                filterTypes,
                filterType,
                filterTypeNew,
                playlistData,
                languages,
                searchActivated,
                
            }
        } = this.props;
        console.log(filterType)
        const isSelectAvailable = this.isSelectAvailable(filterType);

        return (
            <FormValidationWrapper
                validationClass
                validationMessage={getValidationMessage}
                ref={wrapper => {
                    this.playlistCriteria = wrapper ?
                        wrapper.wrappedInstance.refs['playlistCriteria'] :
                        null
                    }
                }>
                <div className="playlist-criteria">
                    <SearchGroup
                        label="Select content to add *"
                        changeHandler={this.changeSearchFilter}
                        changeType={this.changeType}
                        inputHandler={this.setSearchText}
                        selectValue={filterType}
                        selectValueNew={this.props.value!=null ? this.props.value :filterTypeNew}
                        dropdownOprions={filterTypes}
                        inputValue={searchText}
                        playlisttype={this.props.value}
                        searchHandler={this.getFilteredTableData}
                        disabled={isSelectAvailable ?
                            ( searchText.length == 0 || filterType.length == 0 ) :
                            !this.searchEnabled(searchText, filterType)}
                        isSelectAvailable={isSelectAvailable}
                        selectData={languages}
                        buttonText="Search"
                    />
                    <Row>
                        <Col md={6}>
                            { searchActivated ? <PageTable
                                fetchData={this.fetchSourceItems}
                                getData={this.getSourceItems}
                                layout={this.playlistCriteriaLayout}
                                hideTableHead={true}
                                pageSize={10}
                                expandableItems={this.getExpandableItems(store.getSourceItems())}
                            /> : null }
                        </Col>
                        <Col md={6} className="playlist" ref="playlistBlock">
                            {this.renderPlaylistItem(playlistData)}
                        </Col>
                    </Row>
                    <FormControl
                        type="text"
                        className="form-control hide"
                        reference="playlistCriteria"
                        name="playlistCriteria"
                        value={playlistData ? playlistData.length: ''}
                        readOnly
                        validations={[
                            {
                                name: 'required',
                                customMessage: validationMessages.containItems,
                                msgArgs: ['Playlist', 1]
                            }
                        ]}/>
                </div>
                {this.renderConfirmationView()}
            </FormValidationWrapper>
        )
    }
}

export default PlaylistCriteria;
