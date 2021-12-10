import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Table, Pagination } from 'react-bootstrap';
import debounce from 'lodash.debounce';
import pageTableStyles from 'css/pagetable';
import Loader from 'components/core/Loader'
import moment from 'moment';

/**
 * The class represents a table component with paging support
 */
@observer
class PageTable extends Component {

    /** The component properties */
    static propTypes = {
        fetchData: PropTypes.func.isRequired,
        getData: PropTypes.func.isRequired,
        filters: PropTypes.array,
        layout: PropTypes.shape({
            columns: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    key: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
                    action: PropTypes.arrayOf(PropTypes.string)
                })).isRequired
        }),
        tableClassName: PropTypes.string.isRequired,
        isRowActive: PropTypes.func,
        pageSize: PropTypes.number,
        hideTableHead: PropTypes.bool
    };

    /** The default component properties */
    static defaultProps = {
        tableClassName: 'bo-essel-page-table',
        pageSize: 50
    };

    /** The filter change throttle delay */
    static FILTER_CHANGE_THROTTLE_DELAY = 1000;
    /** The minimum length of a search filter */
    static SEARCH_FILTER_MIN_LENGTH = 3;

    /**
     * Construct the component
     */
    constructor(...args) {
        super(...args);
        const [props] = args;
        this.initState(props);

        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handlePageSelection = this.handlePageSelection.bind(this);
        this.handleFetch = this.handleFetch.bind(this);
        this.debounceHandleFetch = debounce(
            this.handleFetch,
            PageTable.FILTER_CHANGE_THROTTLE_DELAY,
            { trailing: true }
        );
    }

    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 15 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
     * Initialise a component's state
     * @param {Object} props - component's properties
     */
    initState(props) {
        const { filters } = props;
        const state = this.state = {};
        state.DateValidation = false
        state.errMessage = ""
        state.StartDate = ""
        state.EndDate = ""
        if (filters) {
            state.filter = {};
            filters.forEach(filter => state.filter[filter.name] = '');
        }
    }

    /**
     * Fetch data before the component is mounted to DOM
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        this.handleFetch({ limit: this.props.pageSize });
    }

    /**
     * Fetch data before the component is mounted to DOM
     * @see Component#componentWillMount()
     */
    componentDidMount() {
        if (this.props.filters !== undefined) {
            const searchLastValue = this.props.filters[0].defaultValue;
            if (this.props.filters[0].page == 'Contents') {
                document.getElementsByName('searchText')[0].value = searchLastValue;
                document.getElementsByName('contentType')[0].value = this.props.filters[1].value;
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.ExportErrorMessage){
            this.setState({
                errMessage : nextProps.ExportErrorMessage,
                DateValidation : true
            })
        }
    }

    /**
     * Handle data fetching
     * @param {Object} params - data fetching parameters
     */
    handleFetch(params = null) {
        const { fetchData } = this.props;
        if (this.props.filters !== undefined) {
            if (this.props.filters[0].page == 'Contents') {
                params["searchText"] = this.getCookie('searchText');
                params["contentType"] = this.getCookie('contentType');
            }
        }
        fetchData(params);
    }

    /**
     * Handle a filter change event
     * @param {Object} event - a change event
     */
    handleFilterChange(event) {

        this.setState({
            DateValidation: false
        })

        const { target: { name, value, type } } = event;
        let filter = { ...this.state.filter, [name]: value };

        let findDateFilters = this.props.filters.some(el => el.type == "Date" );

        if (this.state.StartDate && this.state.EndDate) {
            filter = { ...this.state.filter, [name]: value, StartDate: this.state.StartDate, EndDate: this.state.EndDate };
        } else if(findDateFilters){
            document.getElementById("StartDate").value = null;
            document.getElementById("EndDate").value = null;
        }

        this.setState({ filter });
        const page = this.props.filters[0].hasOwnProperty('page') ? this.props.filters[0].page : 'undefined';
        if (type == 'search') {
            if ((value.length >= PageTable.SEARCH_FILTER_MIN_LENGTH || !value)) {
                if (page == 'Contents') {
                    this.setCookie('searchText', value, 1);
                }

                filter = Object.keys(filter).filter(key => filter[key] !== '').reduce((value, key) => { value[key] = filter[key]; return value; }, {})

                this.debounceHandleFetch({
                    limit: this.props.pageSize,
                    ...filter
                });
            }
            else {
                this.setCookie('searchText', '', 1);
            }
        }
        else {
            if (page == 'Contents') {
                this.setCookie('contentType', value, 1);
            }
            this.handleFetch(
                Object.
                    keys(filter).
                    filter(key => filter[key] !== '').
                    reduce((value, key) => { value[key] = filter[key]; return value; }, {})
            );
        }

        let filterDataInfo = {...filter}

        if (this.state.StartDate && this.state.EndDate) {
            filterDataInfo.StartDate= this.state.StartDate, 
            filterDataInfo.EndDate= this.state.EndDate 
        } else {
            filterDataInfo.StartDate= null, 
            filterDataInfo.EndDate= null
        }

        if(findDateFilters){
            this.props.ApplyFiltersInfo(filterDataInfo)
            this.props.RemoveErrorMessage()
        }

        
    }

    /**
     * Handle a page selection
     * @param {Number} page - a selected page number
     */
    handlePageSelection(page) {
        const { pageSize } = this.props;

        let filter = {...this.state.filter}

        if (this.state.StartDate && this.state.EndDate) {
            filter = { ...this.state.filter, StartDate: this.state.StartDate, EndDate: this.state.EndDate };
        }

       let filterData = Object.keys(filter).filter(key => filter[key] !== '').reduce((value, key) => { value[key] = filter[key]; return value; }, {})

        this.handleFetch({
            offset: (page - 1) * pageSize,
            limit: pageSize,
            ...filterData
        });
    }

    /**
     * Render a page table header
     * @param {Object} layout - a page table layout
     * @returns {ReactNode} React component
     */
    renderHeader(layout) {
        return (
            <thead>
                <tr>
                    {layout.columns.map(item => <th key={item.reactKey || item.key}>{item.name}</th>)}
                </tr>
            </thead>
        );
    }

    /**
     * Render a page table body
     * @param {Object} model - a page table model
     * @returns {ReactNode} React component
     */
    renderBody(model) {
        const { customErrorMessage } = this.props;
        return (
            <tbody>
                {
                    model.length ?
                        model.map(this.renderTableRow.bind(this)) :
                        <tr key="noMatches" className="no-matches">
                            <td colSpan="100%">
                                {customErrorMessage ?
                                    customErrorMessage :
                                    'No matches were found for your request'}
                            </td>
                        </tr>
                }
            </tbody>
        );
    }

    /**
     * Render a page table row
     * @param {Object} rowData - row data
     * @param {Integer} index - a row index
     * @returns {ReactNode} React component
     */
    renderTableRow(rowData, index) {
        const { layout: { columns }, expandableItems, isRowActive } = this.props;
        const rowActive = isRowActive ? isRowActive(rowData) : true;

        const tableRowClassName = `bo-static
            ${rowData.level ? `row-data-${rowData.level}` : ''}
            ${!rowActive ? `bo-essel-table-row-inactive` : ''}`;

        const row =
            <tr className={tableRowClassName} key={index}>
                {
                    columns.map(column =>
                        <td
                            className={column.className}
                            key={`${column.reactKey || column.key}_${index}`}>
                            {this.getColumnData(column, rowData)}
                        </td>
                    )
                }
            </tr>,
            expandableItem = expandableItems && expandableItems[rowData.id];

        return expandableItem ? [
            row,
            <tr key={`expandable_${index}`}>
                <th className="bo-essel-inner-table-wrapper" colSpan={`${columns.length}`}>
                    {expandableItem}
                </th>
            </tr>
        ] : row;
    }

    /**
     * Get a column data
     * @param {String} column - a column name
     * @param {Object} rowData - a row data
     * @returns {Object} a column data
     */
    getColumnData(column, rowData) {
        const { key, format, actions } = column;

        let cellData = rowData;
        let keyParts;
        if (typeof key == 'string') {
            keyParts = key.split('.');
            cellData = rowData;
            keyParts.forEach(key => {
                cellData = cellData[key];
            });
        } else {
            keyParts = [];
            key.forEach(item => keyParts.push(...item.split('.')));
            keyParts.forEach((key, index) => {
                cellData[index] = rowData[key];
            });
        }

        if (format) {
            return key instanceof Array ?
                format(...key.map((key, index) => cellData[index])) :
                format(cellData);
        }

        if (actions) {
            return <div className="bo-essel-actions">{actions(rowData)}</div>;
        }

        return cellData;
    }

    getFilterData(event) {
        this.setState({
            DateValidation: false
        })
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    ApplyDateFilter(state) {

        if (!state.StartDate || !state.EndDate) {
            this.setState({
                DateValidation: true,
                errMessage: "Please select Start date and End date"
            })
        } else if (state.StartDate < state.EndDate) {
            const filter = { ...state.filter, StartDate: state.StartDate, EndDate: state.EndDate };

            this.props.ApplyFiltersInfo(filter)
            this.props.RemoveErrorMessage()
            // this.handleFetch({ StartDate: state.StartDate, EndDate: state.EndDate });

            this.handleFetch(
                Object.
                    keys(filter).
                    filter(key => filter[key] !== '').
                    reduce((value, key) => { value[key] = filter[key]; return value; }, {})
            );
        } else {
            this.setState({
                DateValidation: true,
                errMessage: "End Date should be bigger than the Start Date"
            })
        }
    }

    ClearDateFilter(state) {
        this.setState({
            DateValidation: false,
        })

        const filter = { ...state.filter, StartDate: "", EndDate: "" };

        this.setState({
            StartDate:null,
            EndDate:null,
            filter:filter
        })

        this.props.ApplyFiltersInfo(filter)
        this.props.RemoveErrorMessage()

        document.getElementById("StartDate").value = null;
        document.getElementById("EndDate").value = null;

        this.handleFetch(
            Object.
                keys(filter).
                filter(key => filter[key] !== '').
                reduce((value, key) => { value[key] = filter[key]; return value; }, {})
        );
    }

    /**
     * Render table's filters
     */
    renderFilters() {
        const { filters } = this.props;
        let Today = moment(new Date()).format('L')
        let format = Today.split('/')
        let Currentdate = `${format[2]}-${format[0]}-${format[1]}`
        return filters ?
            <div>
                <div className="bo-essel-filters clearfix">
                    {/* { filters.some(filter => filter.type == 'select') ? <span>Filters</span> : null } */}
                    {filters.map((filter, index) => this.renderFilter(filter, index))}
                </div>
                {
                    filters.map((items) => {
                        if (items.type == "Date") {
                            return <div className="bo-essel-filters clearfix" >

                                <input className="dateInput"
                                    id="StartDate"
                                    name="StartDate"
                                    type="date"
                                    placeholder="Start Date"
                                    onKeyDown={(e) => e.preventDefault()}
                                    max={Currentdate}
                                    onChange={(e) => this.getFilterData(e)}></input>
                                <input className="dateInput"
                                    id="EndDate"
                                    name="EndDate"
                                    type="date"
                                    placeholder="End Date"
                                    max={Currentdate}
                                    onKeyDown={(e) => e.preventDefault()}
                                    onChange={(e) => this.getFilterData(e)}></input>

                                <button className="btn btn-default " style={{ margin: '8px', fontSize: '17px' }} onClick={() => this.ApplyDateFilter(this.state)}>Apply</button>
                                <button className="btn btn-default " style={{ margin: '8px', fontSize: '17px' }} onClick={() => this.ClearDateFilter(this.state)}>Clear</button>
                                {
                                    this.state.DateValidation ?
                                        <div className="bo-essel-error error" style={{ fontSize: "15px" }}>{this.state.errMessage}</div>
                                        : ""
                                }

                            </div>
                        }
                    })
                }

            </div> : null;
    }

    /**
     * Render a table's filter
     * @param {Object} filter - filter configuration
     * @return {ReactNode} React element
     */
    renderFilter(filter, index) {
        const { name, type } = filter;
        switch (type) {
            case 'search':
                const { placeholder } = filter;
                return (
                    <div key={name} className={type}>
                        <i className={`fa fa-search`} />
                        <input name={name}
                            type={type}
                            placeholder={placeholder}
                            onChange={this.handleFilterChange}
                        />
                    </div>
                );
            case 'select':
                const { data, defaultValue } = filter;
                if (!data) {
                    return (
                        <span key={index}>
                            { <Loader className="bo-essel-loader-small" display="inline" />}
                        </span>
                    );
                }
                return (
                    <span key={name} className={type}>
                        <select name={name}
                            onChange={this.handleFilterChange}
                        >
                            {defaultValue && <option key={defaultValue} value="">{defaultValue}</option>}
                            {
                                data.map(item => (item instanceof Object) ?
                                    <option key={item.id} value={item.id}>{item.name}</option> :
                                    <option key={item} value={item}>{item}</option>)
                            }
                        </select>
                    </span>
                );
            case 'Adselect':
                if (filter.data) {
                    const { data, defaultValue } = filter;
                    if (!data) {
                        return (
                            <span key={index}>
                                { <Loader className="bo-essel-loader-small" display="inline" />}
                            </span>
                        );
                    }
                    return (
                        <span key={name} className={type}>
                            <select name={name}
                                onChange={this.handleFilterChange}
                            >
                                {defaultValue && <option key={defaultValue} value="">{defaultValue}</option>}
                                {
                                    data.map(item => (item instanceof Object) ?
                                        <option key={item.id == 0 ? true : false} value={item.id == 0 ? true : false}>
                                            {item.name == 'Active' ?
                                                (name == 'VerificationStatus' ? 'Verified' : 'Enabled') :
                                                (name == 'VerificationStatus' ? 'Non-Verified' : 'Disabled')}
                                        </option> :
                                        <option key={item} value={item}>{item}</option>)
                                }
                            </select>
                        </span>
                    );
                }
            case 'LeadSelect':
                if (filter.data) {
                    const { data, defaultValue } = filter;
                    if (!data) {
                        return (
                            <span key={index}>
                                { <Loader className="bo-essel-loader-small" display="inline" />}
                            </span>
                        );
                    }
                    return (
                        <span key={name} className={type}>
                            <select name={name}
                                onChange={this.handleFilterChange}
                            >
                                {defaultValue && <option key={defaultValue} value="">{defaultValue}</option>}
                                {
                                    data.map(item => (item instanceof Object) ?
                                        <option key={item.name} value={item.name}>{item.name}</option> :
                                        <option key={item} value={item}>{item}</option>)
                                }
                            </select>
                        </span>
                    );
                }

            default:
                return null;
        }
    }

    /**
     * Render table's paging controls
     * @param {Object} pagination - a pagination data
     */
    renderPagingControls(pagination) {
        if (pagination) {
            const { size, offset } = pagination;
            const { pageSize } = this.props;
            return size > pageSize ?
                (
                    <div className="bo-essel-pagination">
                        <Pagination
                            prev
                            next
                            first
                            last
                            ellipsis
                            boundaryLinks
                            items={Math.ceil(size / pageSize)}
                            maxButtons={5}
                            activePage={offset / pageSize + 1}
                            onSelect={this.handlePageSelection} />
                    </div>
                ) : null;
        }
        return null;
    }

    /**
     * @see Component#render()
     */
    render() {
        const { getData, layout, tableClassName, hideTableHead } = this.props;
        const data = getData();

        if (data) {
            var { data: model, pagination } = data;
        }
        return (
            <div>
                { this.renderFilters()}
                <div>
                    <Table className={`${tableClassName} default`} responsive bordered>
                        {!hideTableHead && this.renderHeader(layout)}
                        {model && this.renderBody(model)}
                    </Table>
                    {!model && <Loader className="bo-essel-loader-center" />}
                </div>
                { this.renderPagingControls(pagination)}
            </div>
        );
    }
}

export default PageTable;
