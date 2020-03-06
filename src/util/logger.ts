import {createLogger, format, transports} from 'winston';
import {RuntimeSettings} from './runtime-settings';

//@ts-ignore
const logLevel = RuntimeSettings.logLevel;

// const homedir = require('os').homedir();
// console.log(homedir);

const consoleTransport = new transports.Console({
    level: logLevel,

    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(
            (info: any) => `${info.timestamp} ${info.level}: ${info.message}`
        )
    )
});

const logFile = new transports.File({
    filename: '/var/log/imei-lookup/imei.log',
    level: logLevel,
    format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.printf(
            (info: any) => `${info.timestamp} ${info.level}: ${info.message}`
        )
    )
});

const logger = createLogger({
    // change level if in dev environment versus production
    level: logLevel,
    format: format.combine(
        format.printf(
            (info: any) => `${info.timestamp} ${info.level}: ${info.message}`
        )
    ),
    transports: [consoleTransport, logFile]
});

export {logger};
