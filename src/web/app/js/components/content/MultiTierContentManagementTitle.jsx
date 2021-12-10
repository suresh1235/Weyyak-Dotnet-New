import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MultiTierContentTitle from 'components/content/MultiTierContentTitle';

/**
 * The class contains logic of creating and editing of multi tier contet
 */
@observer
class MultiTierContentManagementTitle extends Component {

    /**
     * Construct an instance of the component
     */
    constructor(props) {
        super(props);
        this.processMultitierContentManagementMode = this.processMultitierContentManagementMode.bind(this);
    }

    /**
     * Fetch content on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const { route: {store}} = this.props;
        this.processMultitierContentManagementMode();
    }

    /**
     * Fetch content on a component update
     * @see Component#componentDidUpdate()
     */
    componentDidUpdate() {
        const { route: {store}} = this.props;
        this.processMultitierContentManagementMode();
    }

    /**
     * Process MTC Title selected mode
     */
    processMultitierContentManagementMode() {
        const { route: {store}, params: { contentId } } = this.props; 
        store.fetchContent(contentId);
    }


    /**
     * @see Component#render()
     */
    render() {
        const { route: { store }, route, router } = this.props;
        return (<MultiTierContentTitle store={store} route={route} router={router}/>)
    }
}

export default MultiTierContentManagementTitle;
