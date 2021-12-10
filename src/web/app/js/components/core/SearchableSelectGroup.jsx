import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import debounce from 'lodash.debounce'
import Select from 'react-select'

import { getValidationMessage } from 'components/core/Utils';
import FormValidationWrapper from 'components/core/FormValidationWrapper';

/**
 * The class defines a details data of a Slider
 */
@observer
class SearchableSelectGroup extends Component {

    /** The component properties */
    static propTypes = {
        label: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        value: PropTypes.any,
        onChange: PropTypes.func,
        fetchOptions: PropTypes.func.isRequired,
        formatLabel: PropTypes.func,
        clearable: PropTypes.bool,
        optionKeys: PropTypes.shape({
            labelKey: PropTypes.string,
            valueKey: PropTypes.string,
            clearableKey: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.func
            ])
        }),
        multi: PropTypes.bool,
        noResultsText: PropTypes.string
    };

    static defaultProps = {
        placeholder: '-- Select --',
        multi: false,
        optionKeys: {
            labelKey: 'label',
            valueKey: 'value',
            clearableKey: 'clearableValue'
        },
        noResultsText: 'No results found.',
        clearable: true
    }

    /** The filter change throttle delay */
    static SEARCH_CHANGE_THROTTLE_DELAY = 500;
    /** The minimum length of a search input */
    static SEARCH_INPUT_MIN_LENGTH = 3;

    constructor(...props) {
        super(...props);

        this.handleOnSelectChanged = this.handleOnSelectChanged.bind(this);
        this.loadOptions = this.loadOptions.bind(this);
        this.fetchOptions = this.fetchOptions.bind(this);
        this.debouncedFetchOptions = debounce(
            this.fetchOptions,
            SearchableSelectGroup.SEARCH_CHANGE_THROTTLE_DELAY,
            { trailing: true }
        )
    }

    componentDidMount() {
    }

    handleOnSelectChanged(selected) {
        const { onChange } = this.props;

        onChange && onChange(selected);
    }

    fetchOptions(inputValue, callback) {
        const { fetchOptions } = this.props;

        fetchOptions(inputValue)
            .then((res) => {
                callback(null, { options: res.data });
            });
    }

    loadOptions(inputValue, callback) {
        if (inputValue.length < SearchableSelectGroup.SEARCH_INPUT_MIN_LENGTH) {
            callback(null, { options: [] });
            return;
        }

        this.debouncedFetchOptions(inputValue, callback);
    }

    setOptionsClearableFlags(value, clearableKey) {
        if (!value) return value;

        const clearablePredicate = typeof clearableKey === "function"
            ? clearableKey
            : (item) => item && item[clearableKey] !== undefined ? item[clearableKey] : true;

        if (value instanceof Array) {
            return (value || []).map((item) => Object.assign(item, { clearableValue: clearablePredicate(item) }))
        }
        else if (!!value) {
            return Object.assign(value, { clearableValue: clearablePredicate(value) });
        }
    }

    /**
     * @see Component#render()
     */
    render() {
        const { id, name, label, placeholder, 
                optionKeys: { labelKey, valueKey, clearableKey }, 
                validations, multi,
                formatLabel, noResultsText
            } = this.props;

        let { value, clearable } = this.props;

        value = this.setOptionsClearableFlags(value, clearableKey);
        clearable = value instanceof Array
            ? value.filter((item) => item.clearableValue == false).length == 0
            : value && value.clearableValue;

        return (
            <FormValidationWrapper
                validationClass
                validationMessage={getValidationMessage}>

                <div id={id} className="form-input-group">
                    <label>{label}</label>
                    <Select.Async
                        name={name}
                        autoload={false}
                        placeholder={placeholder}
                        noResultsText={noResultsText}
                        labelKey={labelKey}
                        valueKey={valueKey}
                        loadOptions={this.loadOptions}
                        valueRenderer={formatLabel}
                        optionRenderer={formatLabel}
                        value={value}
                        onChange={this.handleOnSelectChanged}
                        filterOptions={(options, filter, currentValues) => {
                            // Remove selected options
                            if (currentValues) {
                                const currentKeys = currentValues instanceof Array
                                    ? currentValues.map(x => x[valueKey])
                                    : currentValues[valueKey];
                                return options.filter(option => currentKeys.indexOf(option[valueKey]) == -1);
                            }
                            return options;
                        }}
                        validations={validations}
                        multi={multi}
                        clearable={clearable}
                        />
                </div>
            </FormValidationWrapper>
        );
    }
}

export default SearchableSelectGroup;
