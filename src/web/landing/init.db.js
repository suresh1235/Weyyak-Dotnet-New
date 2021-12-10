var aws = require('aws-sdk');
var config = require('./project.config');

aws.config.update(config.db);

var dynamodb = new aws.DynamoDB();

var params = {
    TableName : 'Users',
    KeySchema: [
        { AttributeName: 'email', KeyType: 'HASH'}
    ],
    AttributeDefinitions: [
        { AttributeName: 'email', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
    }
});