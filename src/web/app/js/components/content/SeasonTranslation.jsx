import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import {
    Row,
    Col
} from 'react-bootstrap';

import FormValidationWrapper from 'components/core/FormValidationWrapper';
import { getSetterName, buildString, getValidationMessage } from 'components/core/Utils'
import LanguageType from 'components/content/LanguageType';
import Dialect from 'components/content/Dialect';
import DubbingSubtitlingLanguage from 'components/content/DubbingSubtitlingLanguage';

/**
 * The class defines a season translation component
 */
@observer
class SeasonTranslation extends Component {

    /** The component properties */
    static propTypes = {
        fields: PropTypes.shape().isRequired,
        store: PropTypes.shape().isRequired
    };

    /**
     * Construct season translation component
     * @param {Array} props component's arguments
     */
    constructor(props) {
        super(props);

        const { store } = this.props;
        this.updateLanguage = store.updateLanguage.bind(store);
    }

    /**
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const { store } = this.props;
        store.fetchAllMaps();
    }

    /**
     * @see Component#render()
     */
    render() {
        const { store: {data, dubbing, subtitling, originTypes, dialects },
            fields: {
                dubbingLanguage: dubbingLanguageFields,
                subtitlingLanguage: subtitlingLanguageFields,
                originType: originTypeFields,
                dialect: dialectFields
            }, translations } = this.props;

        return (
            <FormValidationWrapper
                validationClass
                validationMessage={getValidationMessage}>
                <Row>
                    <Col md={6}>
                        <LanguageType
                            field={originTypeFields}
                            translations={translations}
                            originTypes={originTypes}
                            onlyOriginal={false}
                            value={data.languageType}
                            onChange={this.updateLanguage}
                        />
                    </Col>
                    <Col md={6}>
                        <DubbingSubtitlingLanguage
                            fields={{dubbing: dubbingLanguageFields, subtitling: subtitlingLanguageFields}}
                            translations={translations}
                            values={data}
                            dubbing={dubbing}
                            subtitling={subtitling}
                            onChange={this.updateLanguage}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={6} className="pull-right">
                        <Dialect
                            field={dialectFields}
                            translations={translations}
                            values={data}
                            dialects={dialects}
                            onChange={this.updateLanguage}
                        />
                    </Col>
                </Row>
            </FormValidationWrapper>
        );
    }
}

export default SeasonTranslation;
