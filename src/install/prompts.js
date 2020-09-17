// This file was written to avoid duplicate code that sonar kept finding :(

// Maps to these objects types
const tuple = {
  list: ([name, message, choices, defaultValue]) => ({
    type: 'list',
    name,
    message,
    choices,
    default: defaultValue
  }),
  input: ([name, message, defaultValue]) => ({
    type: 'input',
    name,
    message,
    default: defaultValue
  })
}

// Ask prompt if previous questions are valid
const when = {
  hasProfile: answers => answers.hasProfile,
  allStacks: answers => answers.stacks === 'all',
  allServerless: answers => answers.stacks === 'serverless'
}

// Add when conditions to prompt
const addWhen = {
  hasProfile: (prompt) => ({
    when: when.hasProfile,
    ...prompt
  }),
  allStacksOrServerless: (prompt) => ({
    when: when.allStacks || when.allServerless,
    ...prompt
  }),
  allStacks: (prompt) => ({
    when: when.allStacks,
    ...prompt
  })
}

const listPrompts = [[
  'stacks',
  'Which stacks do you want to build',
  [
    { name: 'All - Refresh, Index, and Stream.', value: 'all' },
    { name: 'Serverless - Refresh and Index.', value: 'serverless' }
  ],
  'all'
], [
  'hasProfile',
  'Do you want to add an aws profile argument',
  [
    { name: 'Yes - I will pass a profile argument', value: true },
    { name: 'No - I will use another way of authenticating', value: false }
  ],
  false
]].map(tuple.list)

const profilePrompts = [[
  'profile',
  'What is your profile argument value',
  'profile-value'
]].map(tuple.input)
  .map(addWhen.hasProfile)

const inputPrompts = [[
  'prefix',
  'What prefix do you want on your infrastructure',
  'teamName'
], [
  's3Bucket',
  'What is your S3 bucket name',
  'aca-test'
]].map(tuple.input)

const refreshPrompts = [[
  'refreshName',
  'What is your Refresh Stack name',
  'aca-refresh'
], [
  'refreshKey',
  'What is the S3 key for your Refresh Lambda',
  'refresh.zip'
]].map(tuple.input)
  .map(addWhen.allStacksOrServerless)

const indexPrompts = [[
  'indexName',
  'What is your Index Stack name',
  'aca-index'
], [
  'indexKey',
  'What is the S3 key for your Index Lambda',
  'index.zip'
]].map(tuple.input)
  .map(addWhen.allStacksOrServerless)

const streamPrompts = [[
  'streamName',
  'What is your Stream Stack name',
  'aca-stream'
], [
  'streamKey',
  'What is the S3 key for your Stream Lambda',
  'stream.zip'
], [
  'subnet1',
  'What is the value for Subnet 1',
  'subnet-xxxxxxx1'
], [
  'subnet2',
  'What is the value for Subnet 2',
  'subnet-xxxxxxx2'
], [
  'sgLambda',
  'What is the Security Group for the Lambda',
  'sg-xxxxxxla'
], [
  'sgEs',
  'What is the Security Group for the Elastic Search',
  'sg-xxxxxxes'
]].map(tuple.input)
  .map(addWhen.allStacks)

// User prompts
const prompts = [
  ...listPrompts,
  ...profilePrompts,
  ...inputPrompts,
  ...refreshPrompts,
  ...indexPrompts,
  ...streamPrompts
]

module.exports = {
  prompts
}
