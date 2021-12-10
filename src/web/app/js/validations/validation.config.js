import AppStore from 'stores/AppStore';
import endpoints from 'transport/endpoints';
import { httpStatus } from 'transport/httpConstants';

/** The validation configuration */
export default {
    required: {
        type: 'error',
        message: 'The field is required',
        validate: data => !!data && (typeof (data) == 'string' ? !!data.trim() : true)
    },
    selectRequired: {
        type: 'error',
        message: 'The field is required',
        validate: data => (!!data || data === 0) && (typeof (data) == 'string' ? !!data.trim() : true)
    },
    multipleSelect: {
        type: 'error',
        message: 'Please select value',
        validate: data => data ? !!data.length : data
    },
    email: {
        type: 'error',
        message: 'Please insert a valid email address',
        validate: data => /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(data)
    },
    dataInRange: {
        type: 'error',
        message: 'The value must be between {0} and {1} characters.',
        validate: (data, args) => {
            data = ( data == null ) ? '' : data;
            return (data.length >= args[0] && data.length <= args[1])
        }
    },
    minuteSeconds:{
        type:'error',
        message:'Please Enter Valid Time (mm:ss)',
        validate: data => /^[0-5]?\d:[0-5]\d$/.test(data)
    },
    hourMinuteSeconds:{
        type:'error',
        message:'Please Enter Valid Time (hh:mm:ss)',
        // validate: data => /^(?:([01]?\d|2[0-3]):([0-5]?\d):)?([0-5]?\d)$/.test(data)
        validate: data => /^((?=(?:\D*\d\D*){6})(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d))$/gm.test(data)


    },
    minuteSecondsoptional:{
        type:'error',
        message:'Please Enter Valid Time (mm:ss)',
        validate: data => /(^$|^[0-5]?\d:[0-5]\d$)/.test(data)
    },
    hourMinuteSecondsoptional:{
        type:'error',
        message:'Please Enter Valid Time (hh:mm:ss)',
        // validate: data => /^(?:([01]?\d|2[0-3]):([0-5]?\d):)?([0-5]?\d)$/.test(data)
        validate: data => /(^$|^((?=(?:\D*\d\D*){6})(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d))$)/gm.test(data)


    },
    consistNotOnlySpecialSymbols: {
        type: 'error',
        message: 'The value must contain at least one letter or one number or \'_\' symbol.',
        validate: (data) => /^[^`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]+$/.test(data)
    },
    urlSafeCharacters: {
        type: 'error',
        message: 'The value should contain only alphanumeric and "-", "_", ".", "," characters',
        validate: (data) => /^[A-Za-z0-9\u0600-\u06FF.,_-\s]+$/.test(data)
    },
    urlSafeCharactersEnglish: {
        type: 'error',
        message: 'The value should contain only alphanumeric and "-", "_", ".", "," characters',
        validate: (data) => /^[A-Za-z0-9.,_-\s]+$/.test(data)
    },
    dataInRangeInteger: {
        type: 'error',
        message: '{0} should be an integer between {1} and {2}.',
        validate: (data, args) => (parseInt(data) >= args[0] && parseInt(data) <= args[1] && !isNaN(data))
    },
    maxLength: {
        type: 'error',
        message: 'The value is too long. It should have {0} characters or less.',
        validate: (data, args) => data.length <= args[0]
    },
    match: {
        type: 'error',
        message: 'Values don\'t match.',
        validate: (data, args) => data === args
    },
    exists: {
        type: 'error',
        message: '{0} already exists.',
        validate: (data, args) =>
            args.reduce((previousValue, currentValue) =>
                (data == currentValue) ? ++previousValue : previousValue, 0) < 2
    },
    unique: {
        type: 'error',
        message: '{0} must be unique.',
        validate: (data, args) => args.every(arg => Object.keys(arg).some(key => arg[key] != data[key]))
    },
    numericRange: {
        type: 'error',
        message: 'Value should be between {0} and {1}',
        validate: (data, args) => {
            if (data.length) {
                const numeric = Number.parseInt(data);
                return !isNaN(numeric) && (data.length == numeric.toString().length)
                    && (numeric >= args[0] && numeric <= args[1]);
            } else {
                return true
            }
        }
    },
    dateTimeIsNotPast: {
        type: 'error',
        message: '{0} should not be in the past',
        validate: (data) => {
            return data === null || data >= new Date();
        }
    },
    requiredOne: {
        type: 'error',
        message: 'Please, specify {0} or {1}',
        validate: (firstData, secondArgs) => {
            const secondData =  (secondArgs instanceof Function ? secondArgs() : secondArgs) || '';

            if (!firstData.trim().length && !secondData.trim().length) {
                return false;
            }

            return true;
        }
    },
    transcoding: {
        type: 'error',
        messages: {
            [httpStatus.OK]: 'Content with such Content ID already exists',
            [httpStatus.BAD_REQUEST]: 'File with the ID entered is not found',
            [httpStatus.SERVER_ERROR]: 'You are not permitted to perform this operation',

        },
        server: true,
        validationResolved: (validationData, data, result) => ({
            data,
            type: validationData.type,
            errorStatus: httpStatus.OK,
            serverError: true,
            message: validationData.messages[httpStatus.OK]
        }),
        validationFailed: (validationData, data, result) =>
            result.status !== httpStatus.NOT_FOUND && {
                data,
                type: validationData.type,
                errorStatus: result.status,
                serverError: true,
                message: validationData.messages[result.status]
            },
        validate: data => AppStore.getInstance().transport.callApi(endpoints.TRANSCODIN_SERVER_VALIDATION, null, [data])
    },
    arrayEmpty: {
        type: 'error',
        validate: (arr) => !arr || arr.length == 0
    }
};
