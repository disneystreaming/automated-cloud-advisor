const {
  all: mockAllStacks
} = require('../../mocks/install/prompt')

const {
  happy: mockProcessHappy
} = require('../../mocks/install/process')

describe('When invoking the install script', () => {
  afterAll(() => {
    jest.restoreAllMocks()
    jest.resetModules()
  })

  describe('When the install is successful', () => {
    beforeEach(() => {
      jest.mock('inquirer', () => mockAllStacks)
      jest.mock('child_process', () => mockProcessHappy)
    })

    it('Then it should not throw an error', async () => {
      await require('../../../src/install/index')
    })
  })
})
