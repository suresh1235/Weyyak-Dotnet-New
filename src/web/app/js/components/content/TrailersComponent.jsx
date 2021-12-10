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

/**
 * The class defines a variance contentId and language component
 */
@observer
class TrailersComponent extends Component {

    constructor (props) {
        super (props);

        this.TrailerUpdateFile = this.TrailerUpdateFile.bind (this);
        this.resetTrailerField = this.resetTrailerField.bind (this);
        this.setTrailerUploadStatus = this.setTrailerUploadStatus.bind (this);

      }
    

    /** The component properties */
    static propTypes = {
        fields: PropTypes.shape().isRequired,
        store: PropTypes.shape().isRequired,
        index: PropTypes.number.isRequired,
        variance: PropTypes.shape().isRequired
    };

    handleTrailerContent(index, TrailerNum, TrailerKey, event) {
        const { store } = this.props;
        const { target: { value } } = event;
        store.setData(index, 'varianceTrailers', value, TrailerNum, TrailerKey);
    }

    TrailerUpdateFile(fieldName, file, event) {
        const { store, index,TrailerNum } = this.props;
        store.TrailerUpdateFile(index,TrailerNum, fieldName, file);
    }

    resetTrailerField(fieldName, event) {
        const { store, index,TrailerNum } = this.props;
        store.resetTrailerField(index,TrailerNum, fieldName);
    }

    setTrailerUploadStatus(fieldName, status, event) {
        const { store, index ,TrailerNum} = this.props;
        store.setTrailerUploadStatus(index,TrailerNum, fieldName, status);
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
        const uploadersData = store.getData();
        const uploadStatus = store.getTrailerUploadStatus(index,TrailerNum);
        const updateLanguage = store.updateLanguage.bind(store, index);
        // const handleTrailerContent = this.handleTrailerContent.bind(this, index, TrailerNum);

            let PosterField = variance.videoTrailerId ? TrailerPosterValidater : TrailerPosterfield

            // console.log("---->",uploadStatus[PosterField.name])


        return (
            <FormValidationWrapper
                validationClass
                validationMessage={getValidationMessage}>
                {/* <Row>
                    <Col>
                        <h3 className="block">Trailer {TrailerNum + 1}</h3>
                    </Col>
                </Row> */}
                <Row>
                    <Col md={6}>
                        <FieldWrapper fieldConfig={TrailerIDField}
                            handleChange={(event) => this.handleTrailerContent(index, TrailerNum, 'videoTrailerId', event)}
                            index={index}
                            value={variance.videoTrailerId} />
                    </Col>
                    <Col md={12}>
                        <UploaderComponent
                            key={PosterField.key}
                            fieldData={PosterField}
                            uploadStatus={uploadStatus[PosterField.name]}
                            updateFile={this.TrailerUpdateFile}
                            resetField={this.resetTrailerField}
                            setUploadStatus={this.setTrailerUploadStatus}
                            fileData={uploadersData[index].varianceTrailers[TrailerNum][PosterField.name]}
                            preview={PosterField.preview}
                            dataType={PosterField.dataType} />
                    </Col>


                </Row>
                <Row>
                    <div>
                        <Col md={6}>
                            <FieldWrapper fieldConfig={variance.videoTrailerId ? TrailerTitleValidater[0] : TrailersField[0]}
                                handleChange={(event) => this.handleTrailerContent(index, TrailerNum, 'englishTitle', event)}
                                index={index}
                                value={variance.englishTitle}
                            />
                        </Col>
                        <Col md={6}>
                            <FieldWrapper fieldConfig={variance.videoTrailerId ? TrailerTitleValidater[1] : TrailersField[1]}
                                handleChange={(event) => this.handleTrailerContent(index, TrailerNum, 'arabicTitle', event)}
                                index={index}
                                value={variance.arabicTitle}
                            />
                        </Col>
                    </div>
                </Row>
            </FormValidationWrapper>
        );
    }
}

export default TrailersComponent;
