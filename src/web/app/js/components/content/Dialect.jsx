import React, { Component, PropTypes } from 'react';
import FieldWrapper  from 'components/core/FieldWrapper';
import { getValidationMessage } from 'components/core/Utils';
import constants from 'constants/constants';

/**
 * The class defines dialect component
 */
class Dialect extends Component {

    /** The component's properties */
    static propTypes = {
        field: PropTypes.shape().isRequired,
        values: PropTypes.shape({
            languageType: PropTypes.string,
            dubbingLanguage: PropTypes.string,
            dubbingDialectId: PropTypes.number,
        }).isRequired,
        dialects: PropTypes.shape(),
        onChange: PropTypes.func.isRequired,
        translations: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
    };

    /**
     * Construct a dialect component
     * @param {Array} props - component's props
     */
    constructor(props) {
        super(props);
        this.getOptions = this.getOptions.bind(this);
        this.disableDialectOptions = this.disableDialectOptions.bind(this);
    }

    /**
     * Get options
     * @returns {Array} dialect options
     */
    getOptions() {
        const { dialects } = this.props;
        return dialects ? dialects.map(dialect => ({
            label: `${dialect.englishName}_${dialect.arabicName}`,
            value: dialect.id,
            disabled: this.disableDialectOptions(dialect.id)
        })): [];
    }

    /**
     * Dialect changed event handler
     * @param {Object} dialectOption - select option.
     */
    handleDialectChanged(dialectOption) {
        const { onChange, values: { languageType, dubbingLanguage }} = this.props;
        const dialectId = dialectOption ? dialectOption.value : null;
        onChange && onChange(languageType, dubbingLanguage, null, dialectId);
    }

    /**
     * Disable dialect option
     * @param {Object} value - option value
     * @returns {Boolean} whether option should be disabled
     */
    disableDialectOptions(value) {
        const { translations } = this.props;
        return translations ?
            translations.some(translation => translation.dubbingDialectId === value )
            : false;
    }

    /**
     * @see Component#render()ads
     */
    render() {
        const { values: { languageType, dubbingLanguage, dubbingDialectId }, field, index } = this.props;

        const isDubbed = languageType === constants.LANGUAGES.TYPES.DUBBED.NAME;
        const isDialectEnabled = isDubbed && dubbingLanguage === constants.LANGUAGES.DATA.ARABIC.CODE;

        return isDialectEnabled ?
            <FieldWrapper fieldConfig={field}
                          handleChange={dialectOption => this.handleDialectChanged(dialectOption)}
                          value={dubbingDialectId}
                          getOptions={this.getOptions}
                          index={index}
            /> : null

    }
}

export default Dialect;
