#!/usr/bin/env node

const { answerPrompt } = require('./prompt')
const {
  zipToS3,
  deployCFT,
  waitForCFT
} = require('./cmd')

/**
 * Zips lambda files to S3 and run cloudformation commands through the AWS CLI
 */
const install = async () => {
  try {
    for (const stack of await answerPrompt()) {
      await zipToS3(stack)

      const stackName = await deployCFT(stack)
      console.log(`Building ${stackName}...\n`)

      await waitForCFT(stackName, stack.profile)
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

install()
