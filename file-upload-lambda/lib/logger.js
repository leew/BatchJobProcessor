const bunyan = require('bunyan');
const config = require('./config');

const logger = bunyan.createLogger({name: config.get('APP_NAME')});

module.exports = {
    child: (name) => logger.child({
        module: name
    })
}