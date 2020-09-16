const {
  events,
  schema,
  invalidEvent
} = require('../events/index')

const {
  happy: mockDynamoDBHappy,
  unhappy: mockDynamoDBUnHappy
} = require('../mocks/index')

describe('When the pattern based event is triggered', () => {
  let handler
  let response
  describe('When invoking the index handler', () => {
    afterEach(() => {
      jest.restoreAllMocks()
      jest.resetModules();
      [
        'DB_NAME'
      ].forEach(key => delete process.env[key])
    })

    describe('When the event pattern is invalid', () => {
      beforeEach(() => {
        handler = require('../../src/lambda/index').handler
      })

      it('Then it should skip the putItem', async () => {
        response = await handler(invalidEvent)
        expect(response).toBe(null)
      })
    })

    describe('When the putItem API is successful', () => {
      beforeEach(() => {
        jest.mock('aws-sdk', () => mockDynamoDBHappy)
        handler = require('../../src/lambda/index').handler
        process.env.DB_NAME = 'Table'
      })

      Object.entries(events).forEach(([key, event]) => {
        describe(`When the event is ${key}`, () => {
          it('Then it should invoke the putItem API', async () => {
            response = await handler(event)
            const expectedResponse = schema[key]
            expectedResponse.ttl = { N: response.ttl.N }
            expectedResponse.updatedTime = { N: response.updatedTime.N }
            expect(JSON.stringify(response)).toBe(JSON.stringify(expectedResponse))
          })
        })
      })
    })

    describe('When the putItem API is unsucessful', () => {
      beforeEach(() => {
        jest.mock('aws-sdk', () => mockDynamoDBUnHappy)
        handler = require('../../src/lambda/index').handler
      })

      it('Then it should throw an error', async () => {
        try {
          await handler(Object.values(events)[0])
        } catch (error) {
          expect(error.message).toBe('Error')
        }
      })
    })
  })
})
