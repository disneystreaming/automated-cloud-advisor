#!/usr/bin/env node

const { exec } = require('child_process')
const { promisify } = require('util')
const cmd = promisify(exec)

const { prompt } = require('inquirer')

const whenAllStacks = answers => answers.stacks === 'all'
const whenAllServerless = answers => answers.stacks === 'serverless'

// User prompts
const prompts = [{
  type: 'list',
  name: 'stacks',
  message: 'Which stacks do you want to build',
  choices: [
    { name: 'All - Refresh, Index, and Stream.', value: 'all' },
    { name: 'Serverless - Refresh and Index.', value: 'serverless' }
  ],
  default: 'all'
}, {
  type: 'list',
  name: 'hasProfile',
  message: 'Do you want to add an aws profile argument',
  choices: [
    { name: 'Yes - I will pass a profile argument', value: true },
    { name: 'No - I will use another way of authenticating', value: false }
  ],
  default: false
}, {
  type: 'input',
  name: 'profile',
  when: answers => answers.hasProfile,
  message: 'What is your profile argument value',
  default: 'profile-value'
}, {
  type: 'input',
  name: 's3Bucket',
  message: 'What is your S3 bucket name',
  default: 'aca-test'
}, {
  type: 'input',
  name: 'prefix',
  message: 'What prefix do you want on your infrastructure',
  default: 'teamName'
}, {
  type: 'input',
  name: 'refreshName',
  message: 'What is your Refresh Stack name',
  when: whenAllStacks || whenAllServerless,
  default: 'aca-refresh'
}, {
  type: 'input',
  name: 'refreshKey',
  message: 'What is the S3 key for your Refresh Lambda',
  when: whenAllStacks || whenAllServerless,
  default: 'refresh.zip'
}, {
  type: 'input',
  name: 'indexName',
  message: 'What is your Index Stack name',
  when: whenAllStacks || whenAllServerless,
  default: 'aca-index'
}, {
  type: 'input',
  name: 'indexKey',
  message: 'What is the S3 key for your Index Lambda',
  when: whenAllStacks || whenAllServerless,
  default: 'index.zip'
}, {
  type: 'input',
  name: 'streamName',
  message: 'What is your Stream Stack name',
  when: whenAllStacks,
  default: 'aca-stream'
}, {
  type: 'input',
  name: 'streamKey',
  message: 'What is the S3 key for your Stream Lambda',
  when: whenAllStacks,
  default: 'stream.zip'
}, {
  type: 'input',
  name: 'subnet1',
  message: 'What is the value for Subnet 1',
  when: whenAllStacks,
  default: 'subnet-xxxxxxx1'
}, {
  type: 'input',
  name: 'subnet2',
  message: 'What is the value for Subnet 2',
  when: whenAllStacks,
  default: 'subnet-xxxxxxx2'
}, {
  type: 'input',
  name: 'sgLambda',
  message: 'What is the Security Group for the Lambda',
  when: whenAllStacks,
  default: 'sg-xxxxxxla'
}, {
  type: 'input',
  name: 'sgEs',
  message: 'What is the Security Group for the Elastic Search',
  when: whenAllStacks,
  default: 'sg-xxxxxxes'
}]

/**
 * Build params for the stacks
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

/**
 * Execute bash child process
 * @param {String} command
 * @returns {String}
 */
const execute = async (command) => {
  const { stdout, stderr } = await cmd(command)
  if (stderr) throw Error(stderr)
  console.log(stdout)
  return stdout.trim()
}

/**
 * Zips the source code and uploads to S3
 * @param {Object}
 * @returns {String}
 */
const zipToS3 = async ({ s3Bucket, s3Key, file, profile = '' }) => await execute(`
    pushd $(npm root -g)/automated-cloud-advisor/src/lambda
        zip -X ${s3Key} ${file}.js
        aws s3 cp \\
            ${profile} \\
            ${s3Key} s3://${s3Bucket}
        rm -rf ${s3Key}
    popd
`)

/**
 * Deploys Cloudformation Template Stack
 * @param {Object}
 * @returns {String}
 */
const deployCFT = async ({ prefix, name, s3Bucket, s3KeyParam, s3Key, file, profile = '', additionalParameters = '' }) => await execute(`
    REFRESH_STACK=$(aws cloudformation \\
        create-stack \\
        ${profile} \\
        --region us-east-1 \\
        --stack-name ${prefix}-${name} \\
        --template-body file://$(npm root -g)/automated-cloud-advisor/src/aws/${file}.yml \\
        --capabilities CAPABILITY_NAMED_IAM \\
        --parameters ParameterKey=ResourcePrefix,ParameterValue=${prefix} \\
        ParameterKey=ResourceName,ParameterValue=${name} \\
        ParameterKey=S3Bucket,ParameterValue=${s3Bucket} \\
        ParameterKey=${s3KeyParam},ParameterValue=${s3Key} \\
        ${additionalParameters} | jq '.StackId' | tr -d '"')
    echo ${prefix}-${name}
`)

/**
 * Waits until the CloudFormation Template has been completed
 * @param {String} stackName
 * @param {String} profile
 * @returns {String}
 */
const waitForCFT = async (stackName, profile = '') => await execute(`
    aws cloudformation wait \\
        stack-create-complete \\
        ${profile} \\
        --stack-name ${stackName}
    echo ${stackName} has been deployed!
`)

const install = async () => {
  try {
    const stacks = await answerPrompt()
    for (const stack of stacks) {
      const { profile } = stack
      await zipToS3(stack)
      const stackName = await deployCFT(stack)
      console.log(`Building ${stackName}...\n`)
      await waitForCFT(stackName, profile)
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

install()
