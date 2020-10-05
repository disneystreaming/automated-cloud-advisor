const {
  happy: mockProcessHappy,
  unhappy: mockProcessUnHappy
} = require('../../mocks/install/process')

describe('When invoking the child process exec', () => {
  let execute
  let response

  afterEach(() => {
    jest.restoreAllMocks()
    jest.resetModules()
  })

  describe('When the command is valid', () => {
    beforeEach(() => {
      jest.mock('child_process', () => mockProcessHappy)
      execute = require('../../../src/install/process').execute
    })

    it('Then it should return STDOUT', async () => {
      response = await execute('ls')
      expect(response).toBe('true')
    })
  })

  describe('When the command is invalid', () => {
    beforeEach(() => {
      jest.mock('child_process', () => mockProcessUnHappy)
      execute = require('../../../src/install/process').execute
    })

    it('Then it should return STDERR', async () => {
      try {
        await execute('ls')
      } catch (err) {
        expect(err.message).toBe('Error')
      }
    })
  })
})
