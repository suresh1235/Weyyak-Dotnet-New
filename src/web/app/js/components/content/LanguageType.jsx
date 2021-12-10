import React, { Component, PropTypes } from 'react';
import FieldWrapper  from 'components/core/FieldWrapper';
import { getValidationMessage } from 'components/core/Utils';
import constants from 'constants/constants';

/**
 * The class defines a Language type component
 */
class LanguageType extends Component {

    /** The component's properties */
    static propTypes = {
        field: PropTypes.shape().isRequired,
        value: PropTypes.string,
        originTypes: PropTypes.shape(),
        onChange: PropTypes.func.isRequired,
        translations: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
    };

    /**
     * Construct a language type component
     * @param {Array} props - component's props
     */
    constructor(props) {
        super(props);
        this.handleLanguageTypeChanged = this.handleLanguageTypeChanged.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.disableOptions = this.disableOptions.bind(this);
    }

    /**
     * Language type changed event handler
     * @param {Object} originTypeOption - select option.
     */
    handleLanguageTypeChanged(originTypeOption) {
        const { onChange } = this.props;
        const languageType = originTypeOption ? originTypeOption.value : null;
        onChange && onChange(languageType, null, null, null);
    }

    /**
     * Get options
     * @returns origin types options
     */
    getOptions() {
        const { originTypes } = this.props;

        return originTypes ? originTypes.map(originType => ({
            label: originType.name,
            value: originType.id,
            disabled: this.disableOptions(originType.id)
        })) : null
    };

    /**
     * Disable options
     * @param {Object} value - option value
     * @returns {boolean} whether options should be disabled
     */
    disableOptions(value) {
        const { translations, onlyOriginal } = this.props;

        return translations ? onlyOriginal && value != constants.LANGUAGES.TYPES.ORIGINAL.NAME ||
            translations.some(translation => translation.languageType === constants.LANGUAGES.TYPES.ORIGINAL.NAME
            && translation.languageType === value) : false;
    }

    /**
     * @see Component#render()ads
     */
    render() {
        const { field, value, index } = this.props;

        return (
            <FieldWrapper
                fieldConfig={field}
                handleChange={originOption => this.handleLanguageTypeChanged(originOption)}
                value={value}
                getOptions={this.getOptions}
                index={index}
            />);
    }
}

export default LanguageType;
