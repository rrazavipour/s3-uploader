import * as _ from 'lodash';
import {RuntimeSettings} from './runtime-settings';
import {logger} from './logger';

const delay = async (time: number) => {
    setTimeout(console.log, time);
};

export const timeTheBatchProcessingTime = async (
    batchId: number,
    count: number
) => {
    let done: boolean = false;

    const start = Date.now();
    logger.debug(
        `starting the timer for batch ${batchId} containing ${count} imeis`
    );

    while (!done) {
        // done = await checkBatchStatus(batchId);
        if (done) {
            break;
        }

        await delay(300000);
    }

    const duration = (Date.now() - start) / 1000;
    logger.debug(`batch ${batchId} took  ${duration} seconds to run`);
};

export const getAccessKey = () => {
    return RuntimeSettings.AWSAccessKeyId;
};

export const getAccessSecret = () => {
    return RuntimeSettings.AWSSecretKey;
};
