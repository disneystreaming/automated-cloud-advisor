const {
  all: mockAllStacks,
  serverless: mockSeverLess
} = require('../../mocks/install/prompt')

describe('When prompting the user', () => {
  let answerPrompt
  let response

  afterEach(() => {
    jest.restoreAllMocks()
    jest.resetModules()
  })

  describe('When the user wants to build all stacks', () => {
    beforeEach(() => {
      jest.mock('inquirer', () => mockAllStacks)
      answerPrompt = require('../../../src/install/prompt').answerPrompt
    })

    it('Then it should return all three stacks meta data', async () => {
      response = await answerPrompt()
      expect(response.length).toBe(3)
    })
  })

  describe('When the user wants to build all stacks', () => {
    beforeEach(() => {
      jest.mock('inquirer', () => mockSeverLess)
      answerPrompt = require('../../../src/install/prompt').answerPrompt
    })

    it('Then it should return all three stacks meta data', async () => {
      response = await answerPrompt()
      expect(response.length).toBe(2)
    })
  })
})
