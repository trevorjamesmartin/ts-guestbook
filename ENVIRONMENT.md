## Environment

__*Requires__ PORT to listen for incoming connections.





|variable              | required?  |    used for    | see also  |
|----------------------|------------|----------------|-----------|
|HOST                  |   ~        |  access        |express 'host-validation' list at the end of [configure.ts](src/api/configure.ts)|
|PORT                  |   yes      |  access        |options that will be forwarded to the cors module in [server.ts](src/api/server.ts)|
|JWT_SECRET            |   yes      |  auth/encrypt  |           |
|DATABASE_URL          |            |  database uri  | [knexfile](knexfile.ts)|
|AWS_ACCESS_KEY_ID     |            |  s3 bucket     |           |
|AWS_SECRET_ACCESS_KEY |            |  s3 bucket     | [generating a presigned URL](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)|
|S3_BUCKET_NAME        |            |  s3 bucket     |           |
|REDIS_KEY             |            |   adapter      | the name of the key to pub/sub events on as prefix (socket.io)     |
|REDIS_URL             |            |   adapter      | [redis adapter](https://socket.io/docs/v4/redis-adapter/)     |



