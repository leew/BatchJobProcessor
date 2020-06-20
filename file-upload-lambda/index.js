const { requestValidator } = require('./lib/validation');
const upload = require('./lib/upload');

const logger = require('./lib/logger').child('handler');

exports.handler = async (event) => {
    
    try {
        if (!requestValidator.validate(event)) {
            logger.info('Received invalid request returning 400');
            return {
                statusCode: 400
            }
        }

        const job  = await upload(event);

        return {
            statusCode: 200,
            body: JSON.stringify(job)
        }

    } catch (err) {
        logger.error("Failed to process request", err);

        return {
            statusCode: 500
        }
    }

};