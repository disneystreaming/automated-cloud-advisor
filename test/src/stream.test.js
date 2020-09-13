const {
  insert,
  invalid,
  remove
} = require('../events/stream')

const {
  happy: mockAWSHappy,
  unhappy: mockAWSUnHappy,
  eventEmitter
} = require('../mocks/stream')

describe('When the batch stream event is triggered', () => {
  let handler
  let response
  describe('When invoking the stream handler', () => {
    afterEach(() => {
      jest.restoreAllMocks()
      jest.resetModules();
      [
        'DOMAIN',
        'INDEX',
        'REGION',
        'TYPE'
      ].forEach(key => delete process.env[key])
    })

    describe('When the event name is invalid', () => {
      beforeEach(() => {
        handler = require('../../src/stream').handler
      })

      it('Then it should skip the request', async () => {
        response = await handler(invalid)
        expect(response).toBe(1)
      })
    })

    describe('When the handleRequest API is successful', () => {
      beforeEach(() => {
        jest.mock('aws-sdk', () => mockAWSHappy)
        handler = require('../../src/stream').handler
        process.env.DOMAIN = 'endpoint.com'
        process.env.INDEX = 'trusted-advisor'
        process.env.REGION = 'us-east-1'
        process.env.TYPE = '_doc'
      })

      describe('When the event name is INSERT', () => {
        it('Then it should invoke the handleRequest api', async () => {
          const promise = handler(insert)
          eventEmitter.emit('data')
          eventEmitter.emit('end')
          response = await promise
          expect(response).toBe(1)
        })
      })

      describe('When the event name is REMOVE', () => {
        it('Then it should invoke the handleRequest api', async () => {
          const promise = handler(remove)
          eventEmitter.emit('data')
          eventEmitter.emit('end')
          response = await promise
          expect(response).toBe(1)
        })
      })
    })

    describe('When the handleRequest API is unsuccessful', () => {
      beforeEach(() => {
        jest.mock('aws-sdk', () => mockAWSUnHappy)
        handler = require('../../src/stream').handler
      })

      it('Then it should throw an error', async () => {
        try {
          await handler(insert)
        } catch (error) {
          expect(error.message).toBe('Error')
        }
      })
    })
  })
})
