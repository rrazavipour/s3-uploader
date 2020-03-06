import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import router from './routes';

import {RuntimeSettings} from './util/runtime-settings';
import {logger} from './util/logger';

const app = express();

logger.debug('What rolls down stairs');
logger.info('alone or in pairs,');
logger.info('and over your neighbors dog?');
logger.warn('Whats great for a snack,');
logger.info('And fits on your back?');
logger.error('Its log, log, log');

app.use(express.static(__dirname + '/dist'));
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json({limit: '10gb'}));

app.use('/', router);

process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
        logger.error(`{reason} Unhandled Rejection at Promise  ${p}`);
    })
    .on('uncaughtException', err => {
        console.error(
            new Date().toUTCString() + ' uncaughtException:',
            err.message
        );
        console.error(err.stack);
        logger.error(err.stack);
        process.exit(1);
    });

//@ts-ignore
const port = RuntimeSettings.port;
app.listen(port, () => {
    logger.debug(
        `S3 uploader server running (version ${RuntimeSettings.version}) on port ${port}!`
    );
});
