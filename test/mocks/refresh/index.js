const success = () => true;
const error = () => { throw Error('Error') }

const happy = {
    Support: jest.fn(() => ({
        refreshTrustedAdvisorCheck: jest.fn().mockReturnValue({
            promise: jest.fn(success)
        })
    }))
};

const unhappy = {
    Support: jest.fn(() => ({
        refreshTrustedAdvisorCheck: jest.fn().mockReturnValue({
            promise: jest.fn(error)
        })
    }))
};

module.exports = {
    happy,
    unhappy
}