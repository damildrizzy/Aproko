'use strict';

const winston = require('winston');
const logger = winston.createLogger({
    transports: [new (winston.transports.File)({
        level: 'debug',
        filename: './aprokoDebug.log',
        handleExceptions: true
    })],
    exitOnError: false 

})

module.exports = logger