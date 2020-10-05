const {
  all: mockAllStacks
} = require('../../mocks/install/prompt')

const {
  happy: mockProcessHappy,
  unhappy: mockProcessUnHappy
} = require('../../mocks/install/process')

describe('When invoking the install script', () => {
  beforeEach(() => {
    jest.mock('inquirer', () => mockAllStacks)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.resetModules()
  })

  describe('When the install is successful', () => {
    beforeEach(() => {
      jest.mock('child_process', () => mockProcessHappy)
    })

    it('Then it should not throw an error', async () => {
      const response = await require('../../../src/install/install').install()
      expect(response).toBe(true)
    })
  })

  describe('When the install is has an error', () => {
    beforeEach(() => {
      jest.mock('child_process', () => mockProcessUnHappy)
    })

    it('Then it should throw an error', async () => {
      try {
        await require('../../../src/install/install').install()
      } catch (err) {
        expect(err.message).toBe('Error')
      }
    })
  })
})
