
const {
  happy: mockProcessHappy
} = require('../../mocks/install/process')

jest.mock('child_process', () => mockProcessHappy)

const {
  zipToS3,
  deployCFT,
  waitForCFT
} = require('../../../src/install/command')

describe('When invoking the command scripts', () => {
  let response

  afterAll(() => {
    jest.restoreAllMocks()
    jest.resetModules()
  })

  it('Then it should execute zipToS3', async () => {
    response = await zipToS3({})
    expect(response).toBe('true')
  })

  it('Then it should execute deployCFT', async () => {
    response = await deployCFT({})
    expect(response).toBe('true')
  })

  it('Then it should execute waitForCFT', async () => {
    response = await waitForCFT({})
    expect(response).toBe('true')
  })
})
