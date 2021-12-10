import validationConfig from 'validations/validation.config';

/**
 * Validate data against validations
 * @param {Object} data - a data to be validated
 * @param {Array} validations - a list of validations
 */
export const validate = (data, validations) => {
    var validationError = null;

    validations && validations.some(validation => {
        var validationName, customMessage, args, msgArgs;
        if (validation instanceof Object) {
            validationName = validation.name;
            customMessage = validation.customMessage;
            args = validation.args;
            msgArgs = validation.msgArgs;
        } else {
            validationName = validation;
        }

        const validationData = validationConfig[validationName] || {};
        const validate = validationData.validate || (() => true);
        const validationResult = validate(validation.data || data, args);

        if (validationData.server) {
            return validationError = validationResult
                    .then(validationData.validationResolved.bind(validationData, validationData, data))
                    .catch(validationData.validationFailed.bind(validationData, validationData, data));
        }

        if (!validationResult) {
            const { type, message } = validationData;
            const validationMessage = customMessage || message;
            validationError = {
                type,
                data: validation.data ? constructValidationData(validation.data) : data,
                constructData: validation.data ? constructValidationData.bind(this, validation.data) : null,
                message:
                    msgArgs ? constructValidationMessage(validationMessage, msgArgs) : validationMessage
            };
        }
        return !!validationError;
    });

    return validationError;
};

/**
 * Construct a validation message in case if message arguments provided
 * @param {String} message - a skeleton validation message to be used as a base
 * @param {Array} msgArgs - an array of message arguments
 * @returns {String} constructed validation message
 */
const constructValidationMessage = (message, msgArgs) => {
    var constructedMessage = message;
    msgArgs.forEach((msgArg, index) => constructedMessage = constructedMessage.replace(new RegExp(`\\{${index}\\}`), msgArg));
    return constructedMessage;
};

/**
 * Construct a validation string from value for validation
 * @param {Object} validationData - validation data
 * @returns {String} string of values
 */
const constructValidationData = validationData => Object.values(validationData).join('_');
