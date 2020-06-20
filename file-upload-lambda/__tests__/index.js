const { handler } = require('../index');
const { requestValidator } = require('../lib/validation');

jest.mock('../lib/validation')
jest.mock('../lib/logger')

describe('AWS Event Handler', () => {
    test('Function passes', async () => {
        requestValidator.mockImplementation(() => new Error('error'));
        expect(handler()).rejects.toThrow();
    })
})