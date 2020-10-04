
const all = {
  prompt: jest.fn().mockResolvedValue({ stacks: 'all', hasProfile: true })
}

const serverless = {
  prompt: jest.fn().mockResolvedValue({ stacks: 'serverless', hasProfile: false })
}

module.exports = {
  all,
  serverless
}
