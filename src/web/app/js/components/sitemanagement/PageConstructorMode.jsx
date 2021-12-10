import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PageConstructor from 'components/sitemanagement/PageConstructor';

/**
 * The class contains logic of creating and editing of Page
 */
@observer
class PageConstructorMode extends Component {

    /**
     * Construct an instance of the component
     */
    constructor(props) {
        super(props);
        this.processPageConstructorMode = this.processPageConstructorMode.bind(this);

        this.state = {
            editMode: false
        };
    }

    /**
     * Fetch content on a component mounted
     * @see Component#componentDidMount()
     */
    componentDidMount() {
        this.processPageConstructorMode();
    }

      /**
     * Clear store if creating mode after editing on a component updating
     * @param {Object} nextProps
     */
    componentDidUpdate(prevProps) {
        this.processPageConstructorMode(prevProps);
    }

    /**
     * Process Page selected mode
     */
    processPageConstructorMode(prevProps = null) {
        const { route: {store}, params: { pageId } } = this.props;

        if (prevProps && prevProps.params.pageId === pageId) {
            return;
        }

        if (pageId) {
            this.setState({ editMode: true });
            store.fetchPage(pageId);
        } else {
            this.setState({ editMode: false });
            store.clearStore();
        }
    }


    /**
     * @see Component#render()
     */
    render() {
        const { route: { store }, route, router } = this.props;
        const { editMode } = this.state;

        const constructorKey = editMode ? "editPage" : "createPage";

        return (<PageConstructor
                    key={constructorKey}
                    store={store}
                    route={route}
                    router={router}
                    editMode={editMode}/>)
    }
}

export default PageConstructorMode;
