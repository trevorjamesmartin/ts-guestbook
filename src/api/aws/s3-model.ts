import aws from 'aws-sdk';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
const credentials:CredentialsOptions = { accessKeyId, secretAccessKey };
const region = 'us-east-1';
const bucketName = process.env.S3_BUCKET_NAME
const signatureVersion = 'v4';
if (!credentials || 
  !(credentials.accessKeyId.length > 4) || 
  !(credentials.secretAccessKey.length > 4)) {
  throw Error('credentials for AWS not found.')
}

const s3 = new aws.S3({
  region,
  credentials,
  signatureVersion
});

export async function generateSignedURL(fileName:string, fileType:string) {
  console.log({ fileName, fileType });
  const s3Params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: 60,
  };
  const signedRequest = await s3.getSignedUrlPromise('putObject', s3Params);
  return signedRequest;
}


