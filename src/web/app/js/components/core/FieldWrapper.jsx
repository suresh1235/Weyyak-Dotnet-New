import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import Loader from 'components/core/Loader';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import { buildString, getValidationMessage } from 'components/core/Utils';

/**
 * Field wrapper component renders field according config type
 */
@observer
class FieldWrapper extends Component {
    /** The component properties */
    static propTypes = {
        isZeroValidValue: PropTypes.bool
    };

    static defaultProps = {
        isZeroValidValue: false,
    }

    /**
     * Construct FieldWrapper component
     * @param {Array} args component's arguments
     */
    constructor(...args) {
        super(...args);

        this.renderField = this.renderField.bind(this);

        this.renderSelectField       = this.renderSelectField.bind(this);
        this.renderMultiSelectField = this.renderMultiSelectField.bind(this);
        this.renderTextField         = this.renderTextField.bind(this);
    }

    /**
     * Renders field according fieldConfig
     *
     * @param {Object} fieldConfig
     * @returns {ReactNode} - rendered field component
     */
    renderField(fieldConfig) {       
       
        const { props: { type, key }, elementType = null } = fieldConfig;
        const { getStoreValue = null, value } = this.props;
        const fieldValue = this.getFirstDefinedOrDefaultFromArr([value, (getStoreValue && getStoreValue(key))]);
        
        let fieldNode;

        switch (elementType || type) {
            case 'select':
                fieldNode = this.renderSelectField(fieldConfig, fieldValue);
                break;
            case 'multiselect':
                fieldNode = this.renderMultiSelectField(fieldConfig, fieldValue);
                break;
            case 'text':
            case 'textarea':
                fieldNode = this.renderTextField(fieldConfig, fieldValue);
                break;
            default:
                fieldNode = null;
        }

        return fieldNode;
    }

    getFirstDefinedOrDefaultFromArr(values = [], defaultValue = '') {
        const { isZeroValidValue } = this.props;
        for (let index = 0; index < values.length; index++) {
            const value = values[index];
            if (!!value || (isZeroValidValue && value === 0)) {
                return value;
            }
        }
        return defaultValue;
    }

    /**
     * Sets name of the element
     *
     * @param {Object} props - props of the element
     * @param {Object} elementProps - props of the field and element
     * @returns {String} - new field name
     */
    setElementName(props, elementProps) {
        return props.index !== undefined && !elementProps.name.match(/\d+/g) ?
        `${elementProps.name}${props.index}` :
        elementProps.name;
    }

    /**
     * Renders select field type
     *
     * @param {Object} fieldConfig
     * @param {Object} value
     * @returns {ReactNode} - rendered ReactNode
     */
    renderSelectField(fieldConfig, value) {
        const { handleChange } = this.props;
        const { getStoreValue } = this.props;
        const {
            element,
            props,
            children,
            config: {
                optionsKey,
                optionValue,
                optionLabel,
                emptyOption,
                getOptions
            }
        } = fieldConfig;

        getStoreValue(optionsKey)
        const options = (getOptions && getOptions(optionsKey)) || (getStoreValue && getStoreValue(optionsKey));
        let elementChildren = [];

        // return Loader component if options were not fetched.
        if (options === null) {
            return (
                <span className="select-loader">
                    { <Loader className="bo-essel-loader-small" display="inline"/> }
                </span>
            );
        }

        if (children) {
            elementChildren = children instanceof Function ? children(this) : children;
        }

        if (options) {
            emptyOption && elementChildren.push(<option key="empty" value=""></option>);

            elementChildren = [].concat(elementChildren, options.map((option, index) =>
                <option key={index} value={buildString(optionValue, option)} disabled={option.locked}>
                    {buildString(optionLabel, option)}
                </option>
            ));
        }

        const elementProps = props instanceof Function ? props(this) : props;
        
        elementProps['value'] = value;
        elementProps['onChange'] = handleChange;
        elementProps['name'] = this.setElementName(this.props, elementProps);

        return (
            <div>
                {
                    React.createElement(
                        element,
                        elementProps,
                        elementChildren
                    )
                }
            </div>
        );
    }

    /**
     * Renders search select field type
     *
     * @param {Object} fieldConfig
     * @param {Object} value
     * @returns {ReactNode} - rendered ReactNode
     */
    renderMultiSelectField(fieldConfig, value) {
        let options, newOptions;
        const { handleChange, getStoreValue } = this.props;

        const {
            element,
            props,
        } = fieldConfig;

        if (fieldConfig.config) {
            const {
                config: {
                    optionsKey,
                    optionValue,
                    optionLabel,
                    getOptions
                }
            } = fieldConfig;

            options = (getOptions && getOptions(optionsKey)) || (getStoreValue && getStoreValue(optionsKey));

            if (options && optionValue && optionLabel) {
                newOptions = [];
                options.map((option) => {
                    newOptions.push({
                        value: buildString(optionValue, option),
                        label: buildString(optionLabel, option)
                    });
                });
            }
        }
        else {
            const { getOptions } = this.props;
            options = getOptions && getOptions();
        }

        // return Loader component if options were not fetched.
        if (options === null) {
            return (
                <span className="select-loader">
                    { <Loader className="bo-essel-loader-small" display="inline"/> }
                </span>
            );
        }


        const elementProps = props instanceof Function ? props(this) : props;

        elementProps['value'] = value;
        elementProps['onChange'] = handleChange;
        elementProps['options'] = newOptions || options || [];
        elementProps['multi'] = !!props.multiple;
        elementProps['name'] = this.setElementName(this.props, elementProps);

        return (
            <div>
                {
                    React.createElement(
                        element,
                        elementProps,
                        null
                    )
                }
            </div>
        );
    }

    /**
     * Renders text or textarea field type
     *
     * @param {Object} fieldConfig
     * @param {Object} value
     * @returns {ReactNode} - rendered ReactNode
     */
    renderTextField(fieldConfig, value) {
        const { handleChange } = this.props;
        const { element, props, children } = fieldConfig;
        const elementProps = props instanceof Function ? props(this) : props;
        elementProps['value'] = value;
        elementProps['onChange'] = handleChange;
        elementProps['name'] = this.setElementName(this.props, elementProps);

        return React.createElement(element,
            elementProps instanceof Function ? props(this) : props,
            children instanceof Function ? children(this) : children);
    }

    /**
     * @see Component#render()
     */
    render() {
        const { fieldConfig, fieldConfig: { label, actions, props: { key: fieldKey } }, required } = this.props;

        return (
            <FormValidationWrapper validationClass validationMessage={getValidationMessage}>
                <div className="form-input-group">
                    <label>{label}</label>
                    {this.renderField(fieldConfig)}
                    {actions && actions(fieldKey) }
                </div>
            </FormValidationWrapper>
        );
    }
}

export default FieldWrapper;
