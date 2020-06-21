const { handler } = require('../index');
const { requestValidator } = require('../lib/validation');
const upload = require('../lib/upload');

jest.mock('../lib/validation')
jest.mock('../lib/upload')

describe('AWS Event Handler', () => {
    describe('Request Validation', () => {

        beforeEach(() => {
            requestValidator.mockImplementation(() => true);
        });

        it('calls requestValidator with the provided event', async () => {
            const event = {}

            await handler(event);

            expect(requestValidator).toHaveBeenCalledWith(event);
            expect(requestValidator).toHaveBeenCalledTimes(1);
        })

        it('returns 400 when request validation returns false', async () => {
            requestValidator.mockImplementation(() => false);

            expect(await handler({})).toEqual({
                statusCode: 400
            });
        })

        it('returns 500 when request validation throws an error', async () => {
            requestValidator.mockImplementation(() => {
                throw new Error('error')
            });
            
            expect(await handler({})).toEqual({
                statusCode: 500
            });
        });
    });

    describe('Call Uploads for all valid events', () => {
        beforeEach(() => {
            requestValidator.mockImplementation(() => true);
            upload.mockImplementation(() => Promise.resolve({id: 'UploadedJob'}));
        });

        it('calls upload with the provided event', async () => {
            const event = {}

            await handler(event);

            expect(upload).toHaveBeenCalledWith(event);
            expect(upload).toHaveBeenCalledTimes(1);
        })

        it('returns 200 and the details of the created job', async () => {
            expect(await handler({})).toEqual({
                statusCode: 200,
                body: JSON.stringify({ id: 'UploadedJob' })
            });
        })

        it('returns 500 when upload throws an error', async () => {
            upload.mockImplementation(() => {
                throw new Error('error')
            });
            
            expect(await handler({})).toEqual({
                statusCode: 500
            });
        });
    })
    
})