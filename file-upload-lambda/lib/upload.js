const { S3 } = require('aws-sdk');
const { received, imported } = require('./audit');
const S3_BUCKET_NAME = require('./config').get('S3_BUCKET_NAME');

const logger = require('./logger').child('handler');

const s3 = new S3();

const uploadContents = async ({ name, body}) => {
    var params = { 
        Bucket: S3_BUCKET_NAME, 
        Key: name, 
        Body: body};
    await s3.upload(params).promise();
}

module.exports = async (event) => {
    
    try {            
        const job = await received(event);

        logger.info('Uploading Content for Job Id: ', job.Id); 

        await uploadContents({
            name,
            body
        });

        const currentState = await imported(job);

        return {
            statusCode: 200,
            body: JSON.stringify(currentState)
        };

    } catch (err) {
        await imported(job, err);
        throw err
    }
}