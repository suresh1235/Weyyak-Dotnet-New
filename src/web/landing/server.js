var express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    config = require('./project.config');

var aws = require('aws-sdk');
aws.config.update(config.db);

app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.urlencoded({extended: true}));

var pages4Languages = {
    arabic: {
        main: 'index.html',
        success: 'success.html',
        fail: 'fail.html',
        error: 'error_en.html'
    },
    english: {
        main: 'index_en.html',
        success: 'success_en.html',
        fail: 'fail_en.html',
        error: 'error_en.html'
    }
};

var handleUserRegisterRequest = function(request, response) {
    var ip = getRequesterIp(request);
    var email = request.body.email;
    var language = request.body.language;

    var db = new aws.DynamoDB.DocumentClient();
    var bindedHandleResponse = handleResponse.bind(null, response, language);
    checkUserExistence(db, { email: email }, {
        success:
            createUser.bind(null,
                db,
                { email: email, ip: ip, creationDate: new Date().toString() },
                { success: bindedHandleResponse, error: bindedHandleResponse }),
        error: bindedHandleResponse
    });
};

var handleResponse = function(response, language, error) {
    error && console.log(error);
    const pages = pages4Languages[language];
    var responseFile = pages.success;
    if (error) {
        responseFile = error.statusCode == 'User exists' ? pages.fail : pages.error;
    }
    response.sendFile(path.join(__dirname, './static', responseFile));
};

var checkUserExistence = function(db, userKey, callbacks) {
    db.get({
        TableName: 'Users',
        Key: userKey
    }, function(error, data) {
        var processedError = error || (Object.keys(data).length && { statusCode: 'User exists'});
        if (processedError) {
            return callbacks.error(processedError);
        }
        callbacks.success();
    });
};

var createUser = function(db, userData, callbacks) {
    var db = new aws.DynamoDB.DocumentClient();
    db.put({
        TableName: 'Users',
        Item: userData
    }, function(error) {
        return error ? callbacks.error(error) : callbacks.success();
    });
};

var getRequesterIp = function(request) {
    var connection = request.connection;
    var socket = (request && request.socket) || (connection && connection.socket);
    return request.headers['x-forwarded-for'] ||
        (connection && connection.remoteAddress) || (socket && socket.remoteAddress);
};

app.post('/register', handleUserRegisterRequest);

var port = config.port;
http.createServer(app).listen(port, function() {
    console.log('Express server listening on port: ' + port);
});