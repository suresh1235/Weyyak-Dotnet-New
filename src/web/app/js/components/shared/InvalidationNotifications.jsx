import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import CollapsiblePanel from 'components/core/CollapsiblePanel';

@observer
class InvalidationNotifications extends Component {

    static propTypes = {
        store: PropTypes.shape()
    };

    componentDidMount() {
        const { store } = this.props;
        store.fetchData && store.fetchData();
    }

    renderItem(item, index) {
        return <li key={index} className="bo-essel-server-details">{item.message}</li>
    }
  
    /**
     * @see Component#render()
     */
    render() {
        const { store } = this.props;
        const data = store.getData();

        if (data && data.length) {
            return (
                <div className="alert alert-error bo-essel-notification summary error">
                     <CollapsiblePanel name="Validation Errors" expanded={false}>
                        <ul className="bo-essel-notification raw error">
                            {data.map((item, index) => this.renderItem(item, index))}
                        </ul>
                     </CollapsiblePanel>
                </div>
            );
        }
        return null;
    }
}

export default InvalidationNotifications;
