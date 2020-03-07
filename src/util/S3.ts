import AWS from 'aws-sdk';
import { lookupBucketName, lookupBucketRegion } from './runtime-settings';
export const uploadObject = async (
    details: BucketDetails,
    body: Buffer,
    key: string
) => {
    const params = {
        Bucket: details.bucket,
        Region: details.region,
        Key: key,
        Body: body
        // , ACL: 'public-read'
    };

    const s3 = new AWS.S3({
        region: details.region,
        accessKeyId: details.accessKeyId,
        secretAccessKey: details.secretAccessKey
    });

    return await s3.upload(params).promise();
};

export const getBucketDetails = async (name: string) => {
    const s3 = new AWS.S3({
        region: lookupBucketRegion,
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
    });

    const params = {
        Bucket: lookupBucketName,
        Key: name
    };

    return s3.getObject(params).promise();

    // let retVal : BucketDetails = new BucketDetails();
    // retVal.region = 'us-east-2';
    // retVal.accessKeyId = 'AKIAJ4NRTAGMCPBSFM3Q';
    // retVal.secretAccessKey =  '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';
    // return retVal;
};

export class BucketDetails {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
}
