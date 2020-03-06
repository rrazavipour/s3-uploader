import express from 'express';
import {BucketDetails, getBucketDetails, uploadObject} from './util/S3';
import {lookupBucketName, lookupBucketRegion} from './util/runtime-settings';

let router = express.Router();

const LogRequest = (req: any) => {
    // logger.debug(`Incoming request
    //     headers: ${req.headers}
    //     url: ${req.url}
    //     method: ${req.method}
    //     body: ${req.body}
    // `);
};

router.get('/', (req, res) => {
    LogRequest(req);
    res.send(
        'Welcome to the S3 uploader service! Brought to you by the good folks at EcoAtm...:'
    );
});

router.post('/api/v1/upload-image', async (req, res) => {
    const body = req.body;
    if (!body || !body.key || !body.bucket || !body.data) {
        return res.status(400).send('incorrect parameters');
    }

    let data = Buffer.from(body.data, 'base64');

    try {
        var result = await getBucketDetails(body.bucket);
        if (!result || !result.Body) {
            throw new Error('missing bucket details');
        }
        // console.log(result.Body);

        const bodyString = result.Body.toString('utf-8');
        if (!bodyString) {
            throw new Error('malformed body');
        }

        let parsedOjb = JSON.parse(bodyString);
        // console.log(parsedOjb);
        let details: BucketDetails = {...parsedOjb};

        const s3Details = await uploadObject(details, data, body.key);

        return res.status(200).send(s3Details.Location);
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.post('/api/v1/configure', (req, res) => {
    const body = req.body;

    if (
        !body ||
        !body.region ||
        !body.bucket ||
        !body.accessKeyId ||
        !body.secretAccessKey
    ) {
        return res.status(400).send('incorrect parameters');
    }

    const bucketDetailsStore: BucketDetails = new BucketDetails();

    bucketDetailsStore.bucket = lookupBucketName;
    bucketDetailsStore.region = lookupBucketRegion;
    // RXR
    // will not need these if I already have write access
    // which should be configured
    if (!process.env.accessKeyId || !process.env.secretAccessKey) {
        return res.status(400).send('environment setup is incomplete');
    }
    bucketDetailsStore.accessKeyId = process.env.accessKeyId;
    bucketDetailsStore.secretAccessKey = process.env.secretAccessKey;

    uploadObject(
        bucketDetailsStore,
        Buffer.from(JSON.stringify(body)),
        body.bucket
    )
        .then(result => {
            return res.status(200).send('success');
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

export = router;
