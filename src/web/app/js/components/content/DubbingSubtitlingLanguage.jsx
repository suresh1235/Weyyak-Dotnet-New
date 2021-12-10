import React, { Component, PropTypes } from 'react';
import FieldWrapper  from 'components/core/FieldWrapper';
import { getValidationMessage } from 'components/core/Utils';
import constants from 'constants/constants';

/**
 * The class defines a dubbing/subtitling language component
 */
class DubbingSubtitlingLanguage extends Component {

    /** The component's properties */
    static propTypes = {
        fields: PropTypes.shape({
            dubbing: PropTypes.shape.isRequired,
            subtitling: PropTypes.shape.isRequired
        }).isRequired,
        values: PropTypes.shape({
            languageType: PropTypes.string,
            dubbingLanguage: PropTypes.string,
            subtitlingLanguage: PropTypes.string
        }).isRequired,
        subtitling: PropTypes.shape(),
        dubbing: PropTypes.shape(),
        onChange: PropTypes.func.isRequired,
        translations: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
    };

    /**
     * Construct a dubbing subtitling language component
     * @param {Array} props - component's props
     */
    constructor(props) {
        super(props);
        this.handleLanguageChanged = this.handleLanguageChanged.bind(this);
        this.getDubbedOptions = this.getDubbedOptions.bind(this);
        this.getSubtitlingOptions = this.getSubtitlingOptions.bind(this);
        this.disableDubbingOptions = this.disableDubbingOptions.bind(this);
        this.disableSubtitlingOptions = this.disableSubtitlingOptions.bind(this);
    }

    /**
     * Get dubbed options
     * @returns {Array} dubbed options
     */
    getDubbedOptions() {
        const { dubbing } = this.props;
        return this.getOptions(dubbing, this.disableDubbingOptions);
    }

    /**
     * Get subtitling options
     * @returns {Array} subtitling options
     */
    getSubtitlingOptions() {
        const { subtitling } = this.props;
        return this.getOptions(subtitling, this.disableSubtitlingOptions);
    }

    /**
     * Get options
     * @param {Array} values - dubbing or subtitling values list
     * @param disableOptions - disable options predicate
     * @returns {Array} options
     */
    getOptions(values, disableOptions) {
        return values ? values.map(value => ({
                label: `${value.englishName}_${value.arabicName}`,
                value: value.code,
                disabled: (disableOptions && disableOptions(value.code)) || false
            })
        ) : []
    }

    /**
     * Language changed event handler
     * @param {Object} languageCodeOption - dropdown option
     * @param {Boolean} isDubbed - whether language is dubbed
     */
    handleLanguageChanged(languageCodeOption, isDubbed) {
        const { values: { languageType }, onChange } = this.props;
        const languageCode = languageCodeOption ? languageCodeOption.value : null;
        onChange && onChange(languageType, isDubbed ? languageCode : null, !isDubbed ? languageCode : null, null);
    }

    /**
     * Disable dubbing options
     * @param {String} value - dubbing option value
     * @returns {Boolean} whether dubbing option should be disabled
     */
    disableDubbingOptions(value) {
        const { translations } = this.props;
        return translations ?
            translations.some(translation => translation.dubbingLanguage !== constants.LANGUAGES.DATA.ARABIC.CODE
            && translation.dubbingLanguage === value) : false;
    }

    /**
     * Disable subtitling option
     * @param {Object} value - subtitling option value
     * @returns {Boolean} whether subtitling option should be disabled
     */
    disableSubtitlingOptions(value) {
        const { translations } = this.props;
        return translations ?
            translations.some(translation => translation.subtitlingLanguage === value ) : false;
    }

    /**
     * @see Component#render()ads
     */
    render() {
        const { fields:
            { dubbing: dubbingField, subtitling: subtitlingField },
            values: { languageType, dubbingLanguage, subtitlingLanguage }, index} = this.props;

        const isDubbed = languageType === constants.LANGUAGES.TYPES.DUBBED.NAME;
        const isSubtitled = !isDubbed && languageType === constants.LANGUAGES.TYPES.SUBTITLED.NAME;

        return (
            isDubbed || isSubtitled ?
                <FieldWrapper
                    fieldConfig={isDubbed ? dubbingField : subtitlingField}
                    handleChange={languageOption => this.handleLanguageChanged(languageOption, isDubbed)}
                    value={isDubbed ? dubbingLanguage : subtitlingLanguage}
                    getOptions={isDubbed ? this.getDubbedOptions : this.getSubtitlingOptions}
                    index={index}
                /> : null
        );
    }
}

export default DubbingSubtitlingLanguage;
