import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

import debounce from 'lodash.debounce';
import { validate } from 'validations/validation';
import validationStyles from 'css/validation';
import Loader from 'components/core/Loader';

/**
 * The class is a form validation wrapper.
 * Usage:
 * - any react component containing a form might be wrapped by this component
 * - a validation field has to have these two mandatory attributes: name and validations
 */
@inject('appStore')
@observer
class FormValidationWrapper extends Component {

    /** The context definition */
    static contextTypes = {
        validations: PropTypes.array
    };

    /** The child context definition */
    static childContextTypes = {
        validations: PropTypes.array
    };

    static ASYNC_VALIDATION_DEBOUNCE_DELAY = 1500;

    /**
     * @see Component#getChildContext()
     */
    getChildContext() {
        return {
            validations: this.validations
        };
    }

    /**
     * Construct form validation wrapper
     * @param {Array} args - arguments
     */
    constructor(...args) {
        super(...args);

        this.validations = [];
        this.state = { errors: {} };
        this.serverErrorsNamesList = {};

        this.runDebouncedValidation = debounce(
            this.performSeverValidation.bind(this),
            FormValidationWrapper.ASYNC_VALIDATION_DEBOUNCE_DELAY,
            {trailing: true}
        );
    }

    /**
     * @see Component#componentDidMount()
     */
    componentDidMount() {
        this.context.validations && this.context.validations.push(this.validateForm.bind(this));
    }

    /**
     * @see Component#componentWillUnmount()
     */
    componentWillUnmount() {
        this.props.appStore.clearErrorMessages();
    }

    /**
     * Handle blur event for an input field
     * @param {Array} validations - the validations to be issued for an input element
     * @param {String} name - field name.
     * @param {Function} origOnBlur - original handler of element.
     */
    handleOnBlur(validations, name, origOnBlur, event) {
        origOnBlur && origOnBlur(event);
        const hasServerValidationError = (this.state.errors[name] || {}).serverError;

        if (hasServerValidationError) {
            return;
        }

        const validationError = this.validateField(this.refs[name].props.value,
            validations.filter(validation => !validation.formScope));
        this.handleValidationError(validationError, name);
    }

    /**
     * Handle change event for an input field and sets validation to null.
     * @param {Array} validations - the validations to be issued for an input element
     * @param {String} name - field name.
     * @param {Function} origOnChange - original handler of element.
     */
    handleOnChange(validations, name, origOnChange, event) {
        origOnChange && origOnChange(event);
        this.props.appStore.deleteServerErrorMessage(this.serverErrorsNamesList[name]);
        this.setState({errors: {...this.state.errors, [name]: null}});
    }

    /**
     * Handle input event for an input field which has server validation.
     * @param {Array} validations - the validations to be issued for an input element
     * @param {String} name - field name.
     * @param {Function} origOnInput - original handler of element.
     */
    handleOnInput(validations, name, origOnInput, event) {
        origOnInput && origOnInput(event);
        this.runDebouncedValidation(validations, name, event);
    }

    /**
     * Debounced function for server validation
     * @param {Array} validations - the validations to be issued for an input element
     * @param {String} name - field name.
     */
    performSeverValidation(validations, name, event) {
        const value = this.refs[name].props.value;
        if (value) {
            let serverValidations = validations && validations.filter(validation => validation.server);
            this.setState({loading: {[name]: true}});
            const validationError = this.validateField(value, serverValidations);

            validationError.then(validationError => {
                this.handleValidationError(validationError, name);
                this.setState({loading: {[name]: false}});
            });
        }
    }

    /**
     * Handles validation error
     * @param {Object} validationError - validation error object
     * @param {String} name - firld name
     */
    handleValidationError(validationError, name) {
        (validationError || this.state.errors[name]) &&
            this.setState({errors: {...this.state.errors, [name]: validationError}});
    }

    /**
     * Validate a field
     * @param {Object} value - a field value
     * @param {Array} validations - an array of validations a field should be validated against to
     */
    validateField(value, validations) {
        return validate(value, validations);
    }

    /**
     * Validate a form
     * @param {String} dataFormType - type of form validation.
     * @param {Array} validationsFormPerType - list of field names which must validate instead of all fields which have validations.
     * @returns {Boolean} true if a form is valid, otherwise false
     */
    validateForm(dataFormType, validationsFormPerType) {
        const { errors } = this.state;
        const newErrorsStates = {};
        Object.keys(errors)
            .filter(key => errors[key] && errors[key].serverError)
            .forEach(key => newErrorsStates[key] = errors[key]);

        this.setState({errors: newErrorsStates});

        var areChainedFormsValid = true;
        this.validations.forEach(validate => areChainedFormsValid &= validate(dataFormType, validationsFormPerType));
        const validationFieldRefs = dataFormType && validationsFormPerType ?
            Object.keys(this.refs).filter(ref => validationsFormPerType.find(item =>
                (ref == item || item == ref.substr(0, item.length)))) :
            Object.keys(this.refs);

        if (!validationFieldRefs.length && areChainedFormsValid) return true;
        var isFormValid = true;

        validationFieldRefs.forEach(ref => {
            const validationField = this.refs[ref];
            const dataValidationsKey = 'data-validations';
            const { name, value, [dataValidationsKey]: validations } = validationField.props;

            if ((validations && !validations.some(validation => validation.server)) || !newErrorsStates[ref]) {
                let filteredValidations = validations && validations.filter(validation => !validation.server);
                const validationError = this.validateField(value, filteredValidations);
                validationError && (isFormValid = false);
                newErrorsStates[name] = validationError;
            }

            if (validations && validations.some(validation => validation.server) && newErrorsStates[ref]) {
                isFormValid = false;
            }
        });

        return isFormValid && areChainedFormsValid;
    }

    /**
     * Checks is field has server validation
     * @param {Array} validations - validations list
     * @returns {Boolean} true if field has server validation, otherwise false
     */
    hasServerValidation(validations) {
        return validations.some(validation => validation.server);
    }

    /**
     * Shows error message
     * @param {Object} error - validation error
     * @param {String} value - current value
     * @param {Function} message - construct element with error message
     * @returns {Element} error message
     */
    renderErrorMessage(error, value, message) {
        if (error && error.data == (error.constructData ? error.constructData() : value)) {
            return message ?
                message(error.message) :
                <span className={classNames({ 'bo-essel-error': true, [error.type]: true })}>
                  { error.message }
                </span>
        }
        return null;
    }

    /**
     * Shows error message from server
     * @param {Object} serverValidationErrors - a list of a validation errors
     * @param {String} fieldName - current field name
     * @returns {Element} error message
     */
    renderServerErrorMessage(serverValidationErrors, fieldName, value) {
        if (serverValidationErrors && serverValidationErrors.invalid ) {
            const errorKey = Object.keys(serverValidationErrors.invalid).filter((errorKey, errorKeyIndex) => {
                const [errorFieldPart1, errorFieldPart2, errorFieldPart3] = errorKey.split('.');
                const errorFieldName = errorFieldPart3 || errorFieldPart2 || errorFieldPart1;
                const errorChildFieldName = errorFieldPart2 || errorFieldPart1;
                const errorFieldIndex = errorChildFieldName && errorChildFieldName.match(/\[(.*?)\]/);
                const errorFieldFullName = errorFieldIndex ?
                    `${errorFieldName}${errorFieldIndex[1] || ''}` :
                    errorFieldName;

                return errorFieldFullName == fieldName;
            })[0];

            this.serverErrorsNamesList[fieldName] = errorKey;

            if (errorKey) {
                return <span
                    key={fieldName}
                    className='bo-essel-error error'>
                    { serverValidationErrors.invalid[errorKey].description }
                </span>;
            }
        }
        return null;
    }

    /**
     * Shows loader
     * @returns {Element} loader element
     */
    renderLoader() {
        return (
            <span className="validation-await">
                <Loader className="bo-essel-loader-small" display="inline"/>
            </span>
        )
    }

    /**
     * Decorate component children.
     * Responsibilities:
     * - find all input elements and make them to be validation elements;
     * - substitute onSubmit handler of a form.
     *
     * @param {Array} children - the children to be decorated
     * @returns {Array} the decorated children
     */
    decorateChildren(children) {
        const { appStore: { appState: { serverValidationErrors }}} = this.props;
        // workaround for react-select children prop
        if (children instanceof Function) {
            return children;
        }
        return React.Children.map(children, child => {
            if (!React.isValidElement(child)) return child;

            const {
                validations,
                validationsFormPerType,
                children,
                onSubmit,
                onBlur,
                onInput,
                onChange,
                reference,
                ...otherChildProps
            } = child.props;

            if (onSubmit) {
                return React.createElement(
                    child.type,
                    {
                        onSubmit: event => {
                            event.preventDefault();
                            const dataFormType = event.currentTarget.getAttribute('data-form-type');
                            if (this.validateForm(dataFormType, validationsFormPerType)) {
                                this.props.appStore.clearErrorMessages();
                                onSubmit(event);
                            }

                        },
                        ref: reference,
                        ...otherChildProps
                    },
                    children && this.decorateChildren(children));
            }

            if (validations) {
                const fieldName = otherChildProps.name;
                const validationError = this.state.errors[fieldName];

                return (
                    <div className={classNames({
                            'validate-error': (this.props.validationClass && validationError),
                            'validate-highlight': (validationError && validationError.errorStatus)
                        })}>

                        {
                            React.createElement(
                                child.type,
                                {
                                    ref: fieldName,
                                    onBlur: this.handleOnBlur.bind(this, validations, fieldName, onBlur),
                                    onInput: this.hasServerValidation(validations) ?
                                        this.handleOnInput.bind(this, validations, fieldName, onInput) :
                                        onInput,
                                    onChange: (validationError || this.serverErrorsNamesList[fieldName]) ?
                                        this.handleOnChange.bind(this, validations, fieldName, onChange) :
                                        onChange,
                                    'data-validations': validations,
                                    ...otherChildProps
                                },
                                children && this.decorateChildren(children))
                        }

                        { this.renderServerErrorMessage(serverValidationErrors, fieldName, child.props.value) }

                        { this.renderErrorMessage(validationError, child.props.value, this.props.validationMessage) }
                        { this.state.loading && this.state.loading[fieldName] && this.renderLoader() }
                    </div>
                );
            }
            return React.cloneElement(child, null, children && this.decorateChildren(children));
        });
    }

    /**
     * @see Component#render()
     */
    render() {
        const { children } = this.props;
        return (
            <div className="bo-essel-form-validation-wrapper">
                { this.decorateChildren(children) }
            </div>
        );
    }
}

export default FormValidationWrapper;
