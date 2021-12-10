import download from 'downloadjs';

import transportConfig from 'transport/transport.config';
import endpoints from 'transport/endpoints';
import { httpStatus, httpMethod, httpContentType } from './httpConstants';

import Notification from 'components/core/Notification';
import appRoutes from 'components/app.routes.config';

/**
 * The class defines a transport level of communication with a middleware
 */
class Transport {

    /** The HTTP headers*/
    static headers = {
        authorization: 'Authorization'
    };

    /**
     * Construct a transport level
     * @param {Object} appStore - an application store
     */
    constructor(appStore) {
        this.appStore = appStore;
        this.queue = [];
    }

    /**
     * Call a middleware API method
     * @param {String} endpoint - an endpoint name of API call
     * @param {Object} payload - a call payload
     * @param {Object} params - replacement parameters
     */
    callApi(endpoint, payload = null, params = null) {
        
        const apiData = transportConfig[endpoint];
        if (!apiData) {
            throw new Error(`Unknown API call (${endpoint})`);
        }

    //    const apiBase = "https://uat.z5backoffice.com"
    //   const apiBase = "https://api-uat.z5backoffice.com"
    const apiBase = "https://api-qa.z5backoffice.com"
    // const apiBase = "https://api.z5backoffice.com"

        if (!apiData.url.includes(apiBase)) {
          apiData.url = apiBase + apiData.url;
        }
        var settings = null;
        const { url, settings: defaultSettings, private: privateCall} = apiData;
        if (defaultSettings || payload || privateCall) {
            settings = {
                ...(defaultSettings || {})
            };
            (payload || privateCall) && (settings = {
                ...settings,
                ...{
                    body: {
                        ...settings.body,
                        ...payload
                    }
                }
            });
        }
        if (privateCall) {
            const userAuthToken = this.appStore.getUserAuthToken();
            if (userAuthToken) {
                const headers = settings.headers || (settings.headers = new Headers());
                headers.set(Transport.headers.authorization,
                    `${userAuthToken.token_type} ${userAuthToken.access_token}`);

                const body = settings.body;
                if (body && body.hasOwnProperty('refresh_token')) {
                    body.refresh_token = userAuthToken.refresh_token;
                }
            }
        }
        const method = (settings && settings.method) || httpMethod.GET;
        if (method == httpMethod.GET || method == httpMethod.HEAD) {
            settings && delete settings.body;
        } else {
            this.encodeBody(settings);
        }

        return new Promise(function(resolve, reject) {
            fetch(params ? this.encodeParams(url, params) : url, settings).
            then(
                this.handleFulfilled.bind(this, apiData, {resolve, reject}, [endpoint, payload, params]),
                this.handleRejected.bind(this, apiData, reject)
            );
        }.bind(this));
    }

    /**
     * Encode body if a request type requires that
     * @param {Object} settings - an API call settings
     */
    encodeBody(settings) {
        const { headers, body } = settings;
        if (headers && body) {
            const contentType = headers.get('content-type');
            if (contentType && contentType.indexOf('x-www-form-urlencoded') != -1) {
                settings.body = Object.
                    keys(body).
                    map(param => `${encodeURIComponent(param)}=${encodeURIComponent(body[param])}`).
                    join('&');
            } else if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
                var formData = new FormData();
                let newHeaders = new Headers();
                for (var entry of headers.entries()) {
                    const [key, value] = entry;
                    if (key !== 'content-type') {
                        newHeaders.set(key, value);
                    }
                }
                Object.
                    keys(body).
                    forEach(param => formData.append(param, body[param]));
                settings.body = formData;
                settings.headers = newHeaders;
            } else {
                settings.body = JSON.stringify(body);
            }
        }
    }

    /**
     * Encode params into URL
     * @param {String} url - an URL to be encoded
     * @param {Object} params - additional params to be encoded into an URL
     * @return {String} - encoded url string
     */
    encodeParams(url, params) {
        var encodedURL = url;
        const currentParams = (params instanceof Array) ? params : [params];

        currentParams.forEach((param, index) => {
            if (param instanceof Object) {
                const [pureUrl, defaultParams] = encodedURL.split('?');
                const combinedParams = defaultParams ? {
                    ...defaultParams.split('&').reduce((output, element) => {
                        const [param, value] = element.split('=');
                        output[param] = value;
                        return output;
                    }, {}),
                    ...param
                } : param;
                encodedURL =
                    `${pureUrl}?${Object.
                        keys(combinedParams).
                        map(param =>`${param}=${encodeURIComponent(combinedParams[param])}`).
                        join('&')}`;
            } else {
                encodedURL = encodedURL.replace(new RegExp(`\\{${index}\\}`), encodeURIComponent(param));
            }
        });

        return encodedURL;
    }

    /**
     * Handle promise fulfillment
     * @param {Object} promiseData - promise handlers
     * @param {Object} requestData - request data
     * @param {Object} responseData - response data
     */
    handleFulfilled(apiData, promiseData, requestData, responseData) {
        const { resolve, reject } = promiseData;
        switch (responseData.status) {
            case httpStatus.OK:
            case httpStatus.ACCEPTED:
                this.handleOk(responseData, resolve, reject);
                break;
            case httpStatus.UNAUTHORIZED:
                this.handleUnauthorized(promiseData, requestData, responseData);
                break;
            case httpStatus.NOT_FOUND:
                this.handlePageNotFound(apiData, reject, responseData);
                break;
            default:
                this.handleRejected(apiData, reject, responseData);
        }
    }

    /**
     * Handle a successful response
     * @param {Object} responseData - a response data
     * @param {Function} resolve - a promise resolve function
     * @param {Function} reject - a promise reject function
     */
    handleOk(responseData, resolve, reject) {
        this.cleanUpError(true);

        switch (this.determineResponseContentType(responseData)) {
            case httpContentType.JSON:
                this.handleJsonResponse(responseData, resolve, reject);
                break;
            case httpContentType.EXCEL_2007:
            case httpContentType.BIN:
                this.handleFileResponse(responseData, resolve, reject);
                break;
            default:
                reject({ error: 'The content-type not supported' });
        }
    }

    /**
     * Determine a content type of a response
     * @param {Object} responseData - response data
     * @returns {String} a response content type
     */
    determineResponseContentType(responseData) {
        const { headers } = responseData;
        const responseContentType = headers && headers.get('content-type');
        if (!responseContentType || responseContentType.indexOf(httpContentType.JSON) != -1) {
            return httpContentType.JSON;
        }
        if (responseContentType.indexOf(httpContentType.EXCEL_2007) != -1) {
            return httpContentType.EXCEL_2007;
        }
        if (responseContentType.indexOf(httpContentType.BIN) != -1) {
            return httpContentType.BIN;
        }
        return null;
    }

    /**
     * Handle a successful response represented in JSON format
     * @param {Object} responseData - a response data
     * @param {Function} resolve - a promise resolve function
     * @param {Function} reject - a promise reject function
     */
    handleJsonResponse(responseData, resolve, reject) {
        responseData.text().then(text => {
            try {
                resolve(text && text.length ? JSON.parse(text) : null);
            } catch (e) {
                reject(e);
            }
        }, reject);
    }

    /**
     * Handle a successful response represented as a file
     * @param {Object} responseData - a response data
     * @param {Function} resolve - a promise resolve function
     * @param {Function} reject - a promise reject function
     */
    handleFileResponse(responseData, resolve, reject) {
        const { headers } = responseData;
        const contentDisposition = headers && headers.get('content-disposition').split(';');
        if (contentDisposition.length && contentDisposition[0] == 'attachment') {
            const fileData = contentDisposition[1] || '';
            const fileName = fileData.split('=')[1];
            if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
                responseData.arrayBuffer().then(arrayBuffer => {
                    const unicodeArrayBuffer = new Uint8Array(arrayBuffer);
                    const encodedStrings = [], sliceFrameSize = 32768;
                    var frame = 0;
                    do {
                        var frameStart = frame++ * sliceFrameSize, frameEnd = frameStart + sliceFrameSize;
                        encodedStrings.push(String.fromCharCode(...unicodeArrayBuffer.slice(frameStart, frameEnd)));
                    } while(frameEnd <= unicodeArrayBuffer.length);
                    location.href=`data:${httpContentType.BIN};base64,${btoa(encodedStrings.join(''))}`;
                }).then(resolve, reject);
            } else {
                responseData.blob().then(blob => download(blob, fileName)).then(resolve, reject);
            }
        } else {
            reject({ error: 'The content-disposition is invalid' });
        }
    }

    /**
     * Redirects to not found page
     * @param {Object} responseData - response data
     */
    handlePageNotFound(apiData, reject, responseData) {
        const { url } = responseData;
        const invalidParameter = url.substring(url.lastIndexOf('/') + 1);
        const currentLocation = this.appStore.Router.getCurrentLocation();
        (currentLocation.pathname.indexOf(invalidParameter) != -1) ?
            this.appStore.Router.push('/page_not_found') :
            this.handleRejected(apiData, reject, responseData);
    }

    /**
     * Handle unauthorized response
     * @param {Object} promiseData - promise handlers
     * @param {Object} requestData - request data
     * @param {Object} responseData - response data
     */
    handleUnauthorized(promiseData, requestData, responseData) {
        const userAuthToken = this.appStore.getUserAuthToken();
        if (userAuthToken) {
            !this.queue.length &&
                this.callApi(endpoints.AUTHENTICATE, {
                    grant_type: 'refresh_token',
                    refresh_token: userAuthToken.refresh_token
                }).then(
                    this.handleRefreshTokenSuccess.bind(this),
                    this.handleRefreshTokenFailure.bind(this)
                );
            this.queue.push({promiseData, requestData});
        } else {
            this.handleRejected(promiseData.reject, responseData);
        }
    }

    /**
     * Handle a refresh token success
     * @param {Object} responseData - response data
     */
    handleRefreshTokenSuccess(responseData) {
        this.appStore.setUserAuthToken(responseData);
        this.queue.forEach(call => {
            const { requestData, promiseData: { resolve, reject }} = call;
            this.callApi(...requestData).then(resolve, reject);
        });
        this.queue.splice(0, this.queue.length);
    }

    /**
     * Handle a refresh token failure
     * @param {Object} responseData - response data
     */
    handleRefreshTokenFailure(responseData) {
        this.appStore.setUserAuthToken(null);
        this.queue.forEach(call => { call.promiseData.reject(responseData) });
        this.queue.splice(0, this.queue.length);
        this.appStore.Router.push(appRoutes.LOGIN);
    }

    /**
     * Handle promise rejection
     * @param {Function} reject - reject handler of an inner promise
     * @param {Object} responseData - promise result data
     * @param {Object} apiData - request params
     */
     handleRejected(apiData, reject, responseData) {
        if (responseData && responseData.json && !apiData.ownErrorHandling) {
            responseData.json().then(
                 apiData.ownErrorHandling ?
                   validationData => ({...responseData, validationData}):
                   this.handleError.bind(this, reject), reject);
        } else {
            reject(responseData);
        }
     }

    /**
     * Handle an application error
     * @param {Object} responseData - a failed response data
     */
    handleError(reject, responseData) {
        const notificationData = this.createNotification(responseData);
        this.appStore.setNotification(
            notificationData.defaultNotification, notificationData.message, notificationData.data);

        this.appStore.setErrors(responseData);
        reject(responseData);
    }

    /**
     * Create an application notification
     * @param {Object} responseData - a failed response data
     */
    createNotification(responseData) {
        const { Notifications: { validation, error } } = Notification;
        const { description, invalid } = responseData;
        return description ?
            {
                defaultNotification: validation,
                data: {
                    name: description,
                    details: invalid && Object.keys(invalid).map(element => invalid[element].description)
                }
            } :
            { defaultNotification: error };
    }

    /**
     * Clean up an application error
     */
    cleanUpError(dontClearServerErrorMessages) {
        const { appStore } = this;
        appStore.clearErrorMessages(dontClearServerErrorMessages);
    }
}

export default Transport;
