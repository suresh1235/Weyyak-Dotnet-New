import React, {Component, PropTypes} from 'react';

import { Panel } from 'react-bootstrap';

import Action from 'components/core/Action';

import collapsiblePanelStyles from 'css/collapsiblepanel';

/**
 * The class defines a behaviour of a collapsible panel component
 */
class CollapsiblePanel extends Component {

    /** The component properties */
    static propTypes = {
        className: PropTypes.string,
        deletable: PropTypes.bool,
        onDelete: PropTypes.func,
        onToggle: PropTypes.func,
        expanded: PropTypes.bool,
        name: PropTypes.string
    };

    /** The default component properties */
    static defaultProps = {
        expanded: true
    };

    /** The icons for panel's expand actions */
    static PANEL_EXPAND_ICON = 'chevron-circle-down';
    static PANEL_COLLAPSE_ICON = 'chevron-circle-up';

    /**
     * Construct an instance of the component
     */
    constructor(...args) {
        super(...args);

        const [props] = args;
        const { expanded } = props;

        this.state = { expanded };

        this.togglePanelState = this.togglePanelState.bind(this);
        this.handleDeletePanel = this.handleDeletePanel.bind(this);
    }

    /**
     * @see Component#componentWillReceiveProps(nextProps)
     */
    componentWillReceiveProps(nextProps) {
        const { expanded } = nextProps;
        if (this.state.expanded !== expanded) {
            this.setState({ expanded });
        }
    }

    /**
     * Toggle a panel state
     */
    togglePanelState() {
        const { onToggle } = this.props;
        onToggle && onToggle();
        this.setState({expanded: !this.state.expanded});
    }

    /**
     * Handle a panel deletion
     */
    handleDeletePanel() {
        const { onDelete } = this.props;
        onDelete && onDelete();
    }

    /**
     * @see Component#render()
     */
    render() {
        const { expanded } = this.state;
        const { children, name, deletable } = this.props;

        return (
            <div className="bo-essel-collapsible-panel">
                <Action className="trigger"
                        icon={expanded ? CollapsiblePanel.PANEL_COLLAPSE_ICON : CollapsiblePanel.PANEL_EXPAND_ICON}
                        name={name}
                        title="Expand/Collapse section"
                        onClick={this.togglePanelState}
                />
                { deletable &&
                    <Action className="delete"
                            icon="times"
                            title="Delete section"
                            onClick={this.handleDeletePanel}/> }
                <Panel collapsible expanded={expanded}>
                    { children }
                </Panel>
            </div>
        );
    }
}

export default CollapsiblePanel;