import React, { Component } from 'react';
import { observer } from 'mobx-react';
import SliderConstructor from 'components/sitemanagement/SliderConstructor';

/**
 * The class contains logic of creating and editing of Slider
 */
@observer
class SliderConstructorMode extends Component {

    /**
     * Construct an instance of the component
     */
    constructor(props) {
        super(props);
        this.processSliderConstructorMode = this.processSliderConstructorMode.bind(this);

        this.state = {
            editMode: false
        };
    }

    /**
     * Fetch content on a component mounted
     * @see Component#componentDidMount()
     */
    componentDidMount() {
        this.processSliderConstructorMode();
    }

    /**
   * Clear store if creating mode after editing on a component updating
   * @param {Object} nextProps
   */
    componentDidUpdate(prevProps) {
        this.processSliderConstructorMode(prevProps);
    }

    /**
     * Process Slider selected mode
     */
    processSliderConstructorMode(prevProps = null) {
        const { route: { store }, params: { sliderId } } = this.props;

        if (prevProps && prevProps.params.sliderId === sliderId) {
            return;
        }

        if (sliderId) {
            this.setState({ editMode: true });
            store.fetchSlider(sliderId);
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

        const constructorKey = editMode ? "editSlider" : "createSlider";

        return (<SliderConstructor
                    key={constructorKey}
                    store={store}
                    route={route}
                    router={router}
                    editMode={editMode}/>)
    }
}

export default SliderConstructorMode;
