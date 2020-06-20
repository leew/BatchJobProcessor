const { uuid } = require('uuid/v4');
const { DynamoDB } = require('aws-sdk');

const { AUDIT_TABLE_NAME } = require('./config');

const RECEIVED = 'received';
const IMPORTED = 'imported';
const IMPORT_FAILED = 'import_failed';

const logger = require('./logger').child('audit');

const client = new DynamoDB.DocumentClient();

const received = async ({}) => {

    try {
        const now = Date.now();
        const id = uuid();

        const params = {
            TableName: AUDIT_TABLE_NAME,
            Item: {
                Id: id,
                FileName: '',
                State: RECEIVED,
                CreatedAt: now,
                UpdatedAt: now
            },
            ReturnValues: 'ALL_NEW'
        };

        const response = await client.put(params).promise();
        
        logger.info(`Created Record with Id ${id} and Filename ${fileName}`);

        return response.Attributes;

    } catch (err) {
        logger.error(`Failed to create record in Dynamo for fileName ${fileName}`, err)
        throw err;
    } 
};

const imported = async ({Id}, err) => {
    
    try {
        const params = {
            TableName: AUDIT_TABLE_NAME,
            Key: {
                Id 
            }, 
            UpdateExpression: 'set #state = :state, #updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#state': 'State',
                '#updatedAt': 'UpdatedAt'
            },
            ExpressionAttributeValues: {
                ':state': err ? IMPORT_FAILED : IMPORTED,
                ':updatedAt': Date.now(),
            },
            ReturnValues: 'ALL_NEW'
        };

        const response = await client.update(params).promise();
        
        logger.info(`Updated Record with Id ${id} and Filename ${fileName}`);

        return response.Attributes;

    } catch (err) {
        logger.error(`Failed to create record in Dynamo for fileName ${fileName}`, err)
        throw err;
    } 
};

module.exports = {
    received,
    imported
}