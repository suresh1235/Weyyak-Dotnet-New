import React, {Component, PropTypes} from 'react';

import { Tabs, Tab } from 'react-bootstrap';

import tabComponentStyles from 'css/tabcomponent';

/**
 * The component defines a tab component behaviour
 */
class TabComponent extends Component {

    /** The component properties */
    static propTypes = {
        layout: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            key: PropTypes.string.isRequired,
            content: PropTypes.node.isRequired
        })).isRequired,
        activeTab: PropTypes.string,
        onSelect: PropTypes.func
    };

    /**
     * Render a tab
     * @param {Object} tab - a tab layout
     */
    renderTab(tab) {
        const { key, name, disabled, content } = tab;
        const tabProps = {
            key,
            eventKey: key,
            title: name,
            disabled: !!disabled
        };
        return <Tab {...tabProps}>{content}</Tab>;
    }

    /**
     * @see Component#render()
     */
    render() {
        const { activeTab, onSelect, layout } = this.props;

        return (
            <Tabs id="bo-essel-tab-component-id"
                  className="bo-essel-tab-component"
                  bsStyle="tabs" activeKey={activeTab}
                  onSelect={onSelect}>
                { layout.map(tab => this.renderTab(tab)) }
            </Tabs>
        );
    }
}

export default TabComponent;