const { exec } = require('child_process')
const { promisify } = require('util')
const cmd = promisify(exec)

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

module.exports = {
  zipToS3,
  deployCFT,
  waitForCFT
}
