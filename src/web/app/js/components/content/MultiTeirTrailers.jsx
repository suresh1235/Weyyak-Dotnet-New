import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import {
    Row,
    Col,
    Button
} from 'react-bootstrap';
import LanguageType from 'components/content/LanguageType';
import Dialect from 'components/content/Dialect';
import DubbingSubtitlingLanguage from 'components/content/DubbingSubtitlingLanguage';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import { getSetterName, buildString, getValidationMessage } from 'components/core/Utils'
import ContentId from 'components/content/ContentId';
import UploaderComponent from 'components/content/UploaderComponent';
import constants from '../../constants/constants';
import validationMessages from '../../validations/validationMessages';
import FieldWrapper from 'components/core/FieldWrapper';
import Confirm from 'components/core/Confirm';
import MultiTierContentTrailerComponent from 'components/content/MultiTierContentTrailerComponent';

/**
 * The class defines a variance contentId and language component
 */
@observer
class MultiTeirTrailers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            TrailerIndex: null,
            varianceIndex: null,
            ShowTrailerAlert: false,
        }
    }


    /** The component properties */
    static propTypes = {
        fields: PropTypes.shape().isRequired,
        store: PropTypes.shape().isRequired,
        // index: PropTypes.number.isRequired,
        // variance: PropTypes.shape().isRequired
    };

    addOneMoreTrailer = () => {
        const { store } = this.props;
        store.addNewTrailer(store);
    }

    removeTrailerRepeaterField(TrailerIndex, varianceIndex) {
        const { store } = this.props;
        store.removeTrailerItem(TrailerIndex);
        this.setState({ ShowTrailerAlert: false });
    }

    /**
   * Render trailer cancel confirmation popup
   * @returns {ReactNode} popup node
   */
    renderTrailerConfirmationView() {
        let { TrailerIndex, varianceIndex } = this.state;
        const bodyHtml = <p>Are you sure you want to remove this Trailer?</p>;

        return (
            <Confirm
                key="Trailerconfirm"
                onConfirm={this.removeTrailerRepeaterField.bind(this, TrailerIndex)}
                onClose={() => {
                    this.setState({
                        ShowTrailerAlert: false,
                    });
                }}
                body={bodyHtml}
                visible={this.state.ShowTrailerAlert}
                cancelText="NO"
                confirmText="YES"
                title="Remove Trailer"
            />
        );
    }

    /**
     * @see Component#render()
     */
    render() {
        const { store,
            store: { dubbing, subtitling, dialects, originTypes, data: variances },
            fields: {
                Trailers: TrailersField,
                TrailerID: TrailerIDField,
                TrailerPoster: TrailerPosterfield,
                ValidateTrailersTitle: TrailerTitleValidater,
                ValidateTrailerPoster: TrailerPosterValidater
            },
            variance, index, videoContentIds, TrailerNum } = this.props;


        return (
            <div className="variance-item">

                <FormValidationWrapper
                    validationClass
                    validationMessage={getValidationMessage}>
                    <Row>
                        <Col>
                            <div className="text-right">
                                <Button
                                    disabled={store.hasMaxTrailerReached(index)}
                                    onClick={() => this.addOneMoreTrailer(index)}
                                >Add Trailer</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {variances.map((item, TrailerIndex) => {

                                return <div className="variance-item" key={TrailerIndex}>
                                    <h3 className="block">Trailer {TrailerIndex + 1}</h3>

                                    {
                                        store.hasMinTrailerExceeded(index) &&
                                        <div className="forms-remove"
                                            onClick={() =>
                                                this.setState({
                                                    // varianceIndex: index,
                                                    TrailerIndex: TrailerIndex,
                                                    ShowTrailerAlert: true,
                                                })}>
                                            &#10006;
                                     </div>
                                    }

                                    <MultiTierContentTrailerComponent
                                        TrailerNum={TrailerIndex}
                                        //    index={index}
                                        variance={item}
                                        //  variance={variance}
                                        //    videoContentIds={videoContentIds}
                                        store={store}
                                        fields={{
                                            TrailerID: TrailerIDField,
                                            Trailers: TrailersField,
                                            TrailerPoster: TrailerPosterfield,
                                            ValidateTrailersTitle: TrailerTitleValidater,
                                            ValidateTrailerPoster: TrailerPosterValidater
                                        }}
                                    />
                                </div>
                            })}

                        </Col>
                    </Row>

                </FormValidationWrapper>
                {this.renderTrailerConfirmationView()}
            </div>
        );
    }
}

export default MultiTeirTrailers;
