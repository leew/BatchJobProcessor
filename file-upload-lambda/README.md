# File Upload

Lambda to accept content in the body or as part of a multi-part form request and upload to S3
This function will also record the upload to dynamo to allow polling of the status of the upload.

The upload is expected to be in the form of CSV file. 
The lambda will perform basic validation on the file to confirm that the required header elements are present.

## Build run test

### Test

npm -i
npm run test

## File Format