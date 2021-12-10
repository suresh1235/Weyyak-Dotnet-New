import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';

import Details from 'components/sitemanagement/shared/Details';
import FormValidationWrapper from 'components/core/FormValidationWrapper';

/**
 * The class defines a details data of a Slider
 */
@observer
class SliderDetails extends Component {

    /** The component properties */
    static propTypes = {
        store: PropTypes.object.isRequired,
        fields: PropTypes.object.isRequired,
        onChange: PropTypes.func
    };

    constructor(...props) {
        super(...props);
    }

    componentDidMount() {
        const { store, editMode } = this.props;
        store.fetchSliderTypes()
            .then(() => editMode || store.setDefaultType());

        store.fetchPublishingPlatformsList();
        store.fetchPreviewLayouts();
    }

    renderPreviewImage() {
        const { store: { previewImageUrl } } = this.props;

        return previewImageUrl && (
            <div className="preview-layout">
                <img src={previewImageUrl} />
            </div>
        );
    }

    /**
     * @see Component#render()
     */
    render() {
        const { store, fields: { fields } } = this.props;
        return (
            <FormValidationWrapper>
                <Details
                    store={store}
                    fields={fields}/>
                {this.renderPreviewImage()}
            </FormValidationWrapper>
        );
    }
}

export default SliderDetails;
