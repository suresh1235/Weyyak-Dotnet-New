import React, { Component } from 'react';
import { observer, toJS } from 'mobx-react';
import {
    Form,
    FormGroup,
    FormControl,
    Button,
    ButtonGroup,
    Label,
    Select
} from 'react-bootstrap';
import Loader from 'components/core/Loader';
import Multiselect from 'react-select';

import FormValidationWrapper from 'components/core/FormValidationWrapper';
import { getSetterName, buildString, getValidationMessage } from 'components/core/Utils'

/**
 * Render a single field item
 * @param {Object} field - a configuration object for the field
 * @param {Number} index - index of the field in array
 * @returns {ReactNode} React component
 */
@observer
class Field extends Component {

    constructor(...props) {
        super(...props);
    }

    setSelectType(options) {
        const {
            store, fieldConfig: field, handleChange, onInputChange,
            getStoreValue, onSelectResetsInput, repeaterIndex} = this.props;

        const value =
            this.props.hasOwnProperty('value') ?
                this.props.value :
                getStoreValue ?
                    getStoreValue(field.key) :
                    store.data[field.key];

        if (!field.multiple) {
            return <FormControl
                className="form-control"
                bsClass=""
                name={repeaterIndex ? `${field.name}${repeaterIndex}` : field.name}
                multiple={field.multiple}
                componentClass="select"
                onChange={handleChange}
                validations={field.validationRules}
                value={value}>
                { field.includeEmptyOption && <option value="">{field.emptyOption}</option> }
                { options && options.map((option, index) => {
                    let disabled = (store.data.length > 1) && (store.data.some((item) => item.genreId == option.id));
                    return (
                        <option key={index} value={buildString(field.optionValue, option)} disabled={disabled}>
                            {buildString(field.optionLabel, option)}
                        </option>
                    )
                })}
            </FormControl>;
        } else {

            var newOptions = [];

            options && options.map((option, index) => {
                newOptions.push({
                    value: buildString(field.optionValue, option),
                    label: buildString(field.optionLabel, option)
                });
            });

            return <Multiselect
                name={repeaterIndex ? `${field.name}${repeaterIndex}` : field.name}
                validations={field.validationRules}
            	value={value}
                multi={true}
            	options={newOptions}
                onChange={handleChange}
                onInputChange={onInputChange}
                onSelectResetsInput = {onSelectResetsInput}
            />;
        }
    }

    /**
     * Add artuments to validation which need for dynamic arguments
     * @param {Array} validationRules - list of validation rules
     * @param {Object} store - current store
     * @param {Number} value - current value
     */
    addDynamicArgsToFieldValidation(validationRules, store) {
        validationRules && validationRules.forEach(validationRule => {
            if (validationRule.dynamicArgs && store.data[validationRule.dynamicArgs]) {
                let dynamicArgs = store.data[validationRule.dynamicArgs].toJS();
                validationRule.args = dynamicArgs;
                validationRule.data = store.validationData;
            }
        });
    }

    /**
     * @see Component#render()
     */
    render() {
        let fieldNode = null;

        const { store, fieldConfig: field, handleChange, repeaterTitle, required} = this.props;
        const type = field.type;
        const value = this.props.hasOwnProperty('value') ? this.props.value : store.data[field.key];

        this.addDynamicArgsToFieldValidation(field.validationRules, store, value);

        switch (type) {
            case 'select':
                let options = this.props.options || field.options;
                if(options.indexOf('.') === -1){
                    options = store[options];
                }else{
                    let path = options.split('.');
                    if(!store[path[0]][this.props.dynamicValue]){
                        store.addObservale(path[0], this.props.dynamicValue, []);
                        this.props.dynamicValue && store.fetchSubgenres(this.props.dynamicValue);
                    }

                    options = store[path[0]].get([this.props.dynamicValue]);
                }
                fieldNode = (options === null) ? (
                    <span className="select-loader">
                        { <Loader className="bo-essel-loader-small" display="inline"/> }
                    </span>
                ) : (
                    this.setSelectType(options)
                );
                break;
            case 'text':
                fieldNode =
                    <FormControl
                        type="text"
                        className="form-control"
                        bsClass=""
                        name={field.name}
                        onChange={handleChange}
                        value={value}
                        disabled={field.disabled}
                        validations={field.validationRules}/>;
                break;
            case 'textarea':
                fieldNode =
                    <FormControl
                        componentClass="textarea"
                        name={field.name}
                        onChange={handleChange}
                        value={value}
                        disabled={field.disabled}
                        placeholder={field.placeholder}
                        validations={field.validationRules} />;
                break;

        }
        return (
            <FormValidationWrapper
                validationClass
                validationMessage={getValidationMessage}>
                <div className="form-input-group">
                    <label>{`${repeaterTitle ? repeaterTitle : ''}${field.label}`}</label>
                    {fieldNode}
                </div>
            </FormValidationWrapper>
        );
    }
}

export default Field;
