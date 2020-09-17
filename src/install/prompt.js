const { prompt } = require('inquirer')

const { prompts } = require('./prompts')

/**
 * Build params for the stacks
 * @returns {Array}
 */
const answerPrompt = async () => {
  const {
    stacks,
    s3Bucket,
    hasProfile,
    profile,
    prefix,
    refreshName,
    refreshKey,
    indexName,
    indexKey,
    streamName,
    streamKey,
    subnet1,
    subnet2,
    sgLambda,
    sgEs
  } = await prompt(prompts)

  const baseStack = {
    prefix,
    s3Bucket,
    ...(hasProfile ? { profile: `--profile ${profile}` } : {})
  }

  const refreshStack = {
    ...baseStack,
    name: refreshName,
    s3Key: refreshKey,
    s3KeyParam: 'S3KeyRefresh',
    file: 'refresh'
  }

  const indexStack = {
    ...baseStack,
    name: indexName,
    s3Key: indexKey,
    s3KeyParam: 'S3KeyIndex',
    file: 'index'
  }

  const streamStack = {
    ...baseStack,
    name: streamName,
    s3Key: streamKey,
    s3KeyParam: 'S3KeyStream',
    file: 'stream',
    additionalParameters: `ParameterKey=StreamARN,ParameterValue=${`${prefix}-${indexName}-StreamArn`} \\
              ParameterKey=SecurityGroupIdsLambda,ParameterValue=${sgLambda} \\
              ParameterKey=SecurityGroupIdsES,ParameterValue=${sgEs} \\
              ParameterKey=SubnetIds,ParameterValue="${`${subnet1}\\,${subnet2}`}"`
  }

  return [
    refreshStack,
    indexStack,
    ...(stacks === 'all' ? [streamStack] : [])
  ]
}

module.exports = {
  answerPrompt
}
