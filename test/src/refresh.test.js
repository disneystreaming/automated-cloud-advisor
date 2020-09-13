const event = require('../events/refresh/event.json')

const {
  happy: mockSupportHappy,
  unhappy: mockSupportUnHappy
} = require('../mocks/refresh')

describe('When the scheduled event is triggered', () => {
  let handler
  describe('When invoking the refresh handler', () => {
    afterEach(() => {
      jest.restoreAllMocks()
      jest.resetModules()
    })

    describe('When the refresh API is successful', () => {
      beforeEach(() => {
        jest.mock('aws-sdk', () => mockSupportHappy)
        handler = require('../../src/refresh').handler
      })

      it('Then it should invoke the refresh api', async () => {
        const response = await handler(event)
        expect(response).toBe(event)
        const calls = mockSupportHappy.Support.mock.results[0].value
          .refreshTrustedAdvisorCheck.mock.calls.length
        expect(calls).toBe(5)
      })
    })

    describe('When the refresh API is unsuccessful', () => {
      beforeEach(() => {
        jest.mock('aws-sdk', () => mockSupportUnHappy)
        handler = require('../../src/refresh').handler
      })

      it('Then it should throw an error', async () => {
        try {
          await handler(event)
        } catch (error) {
          expect(error.message).toBe('Error')
        }
      })
    })
  })
})
