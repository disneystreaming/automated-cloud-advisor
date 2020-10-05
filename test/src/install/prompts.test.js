
describe('When invoking when conditions for the prompts', () => {
  let response

  afterEach(() => {
    jest.resetModules()
  })

  describe('When invoking the when', () => {
    it('Then it should return function value', async () => {
      const { when } = require('../../../src/install/prompts')
      response = when.hasProfile({ hasProfile: true })
      expect(response).toBe(true)

      response = when.allStacks({ stacks: 'all' })
      expect(response).toBe(true)

      response = when.allServerless({ stacks: 'serverless' })
      expect(response).toBe(true)
    })
  })

  describe('When invoking the addWhen', () => {
    it('Then it should return function value', async () => {
      const { addWhen } = require('../../../src/install/prompts')
      const { when: func } = addWhen.allStacksOrServerless({})
      response = func({ stacks: 'serverless' })
      expect(response).toBe(true)
    })
  })
})
