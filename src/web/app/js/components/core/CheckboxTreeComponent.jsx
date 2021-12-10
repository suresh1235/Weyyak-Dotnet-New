import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import {
    FormControl,
    Row,
    Col,
} from 'react-bootstrap';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import CheckboxTree from 'react-checkbox-tree';
import { getValidationMessage } from 'components/core/Utils';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import { findDOMNode } from 'react-dom';

/**
 * The class defines a Checkbox Tree component component
 */
@observer
class CheckboxTreeComponent extends Component {

    /** The component properties */
    static defaultProps = {
        index: '',
        searchEnabled: false
    };

    /** The component properties */
    static propTypes = {
        index: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        setExpandedNodes: PropTypes.func.isRequired,
        getExpandedNodes: PropTypes.func.isRequired,
        checked: PropTypes.object,
        onChange: PropTypes.func,
        data: PropTypes.array,
        fieldConfig: PropTypes.object.isRequired,
        searchEnabled: PropTypes.bool
    };

    /**
     * Min length of search input to start nodes search
     */
    static MIN_SYMBOLS_FOR_SEARCH = 2;

    /**
     * Construct a Checkbox Tree component
     * @param {Array} props component's arguments
     */
    constructor(props) {
        super(props);

        this.state = {
            checked: [],
            nodes: []
        };

        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.findNodes = this.findNodes.bind(this);
        this.getNodesToExpand = this.getNodesToExpand.bind(this);
    }

    /**
     * @see Component#componentWillReceiveProps()
     */
    componentWillReceiveProps(nextProps) {
        const { checked } = nextProps;
        checked && checked.toJS() ?
            this.setState({ checked: checked.toJS().map(item => item.toString()) }) :
            this.setState({ checked: [] });
    }

    /**
     * @see Component#componentDidMount()
     */
    componentDidMount() {
        const { data } = this.props;
        this.setState({ nodes: data });
    }

    /**
     * Handle checkbox status
     * @param {Array} checked checked items
     */
    onCheck(checked) {
        const {
            onChange,
            fieldConfig: {
                props: {
                    name,
                    disabled
                }
            }
        } = this.props;

        if (!disabled) {
            onChange && onChange(name, checked ? checked : null);
            if ( checked.length < 1 ) {
                const domNode = findDOMNode(this.checkboxTreeComponent);
                const x = window.scrollX, y = window.scrollY;
                domNode.focus();
                window.scrollTo(x, y);
                setInterval(() => {
                    domNode.blur()
                }, 0);
            }
            this.setState({ checked });
        }
    }

    /**
     * Handle checkbox tree expand status
     * @param {Array} expanded active node
     */
    onExpand(expanded) {
        const { setExpandedNodes } = this.props;
        setExpandedNodes(expanded);
    }

    /**
     * Handle search input changed, then search the nodes
     * @param {Event} e
     */
    onSearchChanged(e) {
        const { data, setExpandedNodes } = this.props;
        const expandedRoot = [data[0].value];

        let searchText = e.target.value.trim().toLowerCase();

        if (!searchText || searchText.length < CheckboxTreeComponent.MIN_SYMBOLS_FOR_SEARCH) {
            setExpandedNodes(expandedRoot);
            return this.setState({ nodes: data });
        }

        let nodes = data.map(node => this.findNodes(node, searchText));
        let expanded = this.getNodesToExpand(nodes);
        setExpandedNodes(expanded.length ? expanded : expandedRoot);
        return this.setState({ nodes });
    }

    /**
     * Recursively finds nodes with searchText match
     * @param {*} node
     * @param {String} searchText
     * @returns {Object}
     */
    findNodes(node, searchText) {
        const children = (node.children || []).map(node => this.findNodes(node, searchText));

        let foundInNode = node.label.trim().toLowerCase().indexOf(searchText) !== -1;
        let foundInChildren = children.filter(x => x.isFound).length;
        return {
                ...node,
                label: foundInNode ? (<span className='found-node'>{node.label}</span>) : node.label,
                children: children,
                isFound: foundInNode || foundInChildren
        };
    }

    /**
     * Get nodes, that should be expanded after search was completed
     * @param {Array} nodes
     * @returns {Array}
     */
    getNodesToExpand(nodes) {
        let expanded = [];

        for (var index in nodes) {
            let node = nodes[index];
            if (node.isFound) {
                expanded.push(node.value);
            }

            if (node.hasOwnProperty(`children`)) {
                let childNodes = this.getNodesToExpand(node.children);
                expanded.push(...childNodes);
            }
        }

        return expanded;
    }

    renderSearchInput() {
        const { fieldConfig: { props: { placeholder = 'Search', disabled } } } = this.props;

        return (
            <div className="input-group">
                <span className="input-group-addon" id="search-bar">
                    <i className="fa fa-search" aria-hidden="true" />
                </span>
                <input disabled={disabled} type="search" className="form-control" placeholder={placeholder}
                    aria-describedby="search-bar" onChange={this.onSearchChanged}
                />
            </div>
        );
    }

    /**
     * @see Component#render()
     */
    render() {
        const { checked, nodes } = this.state;
        const {
            index,
            searchEnabled,
            fieldConfig: {
                label,
                props: {
                    name,
                    disabled,
                    validations
                }
            },
            getExpandedNodes
        } = this.props;

        return (
            <FormValidationWrapper
                validationClass
                validationMessage={getValidationMessage}
                ref={wrapper => {
                    this.checkboxTreeComponent = wrapper ?
                        wrapper.wrappedInstance.refs[`${name}${index}`] :
                        null}
                }>
                <div className={`checkbox-tree-component ${disabled ? 'disabled' : ''}`}>
                    <Row>
                        <Col md={6} className="form-input-group">
                            <label>{label}</label>
                            {searchEnabled && this.renderSearchInput()}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <CheckboxTree
                                checked={checked}
                                expanded={getExpandedNodes()}
                                nodes={nodes}
                                onCheck={this.onCheck.bind(this)}
                                showExpandAll
                                onExpand={this.onExpand.bind(this)}
                            />
                            <FormControl
                                type="text"
                                className="form-control hidden-form-control"
                                name={`${name}${index}`}
                                value={checked.length ? checked.length : ''}
                                readOnly
                                validations={validations}/>
                        </Col>
                    </Row>
                </div>
            </FormValidationWrapper>
        );
    }
}

export default CheckboxTreeComponent;
