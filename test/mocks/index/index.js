const success = () => true;
const error = () => { throw Error('Error') };

const happy = {
    DynamoDB: jest.fn(() => ({
        putItem: jest.fn().mockReturnValue({
            promise: jest.fn(success)
        })
    }))
};

const unhappy = {
    DynamoDB: jest.fn(() => ({
        putItem: jest.fn().mockReturnValue({
            promise: jest.fn(error)
        })
    }))
};

module.exports = {
    happy,
    unhappy
}