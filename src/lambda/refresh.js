const AWS = require('aws-sdk')

const support = new AWS.Support({ apiVersions: '2013-04-15' })

/**
 * Id values that map to trusted advisor event
 */
const CHECK_IDS = {
  'Amazon RDS Idle DB Instances': 'Ti39halfu8',
  'Low Utilization Amazon EC2 Instances': 'Qch7DwouX1',
  'Underutilized Amazon EBS Volumes': 'DAvU99Dc4C',
  'Unassociated Elastic IP Addresses': 'Z4AUBRNSmz',
  'Idle Load Balancers': 'hjLMh88uM8'
}
/**
 * Triggers a refresh on Trusted Advisor Check to get an update on AWS resources
 * @param {Object} event
 * @returns {Object}
 */
exports.handler = async (event) => {
  for (const id of Object.values(CHECK_IDS)) {
    const params = {
      checkId: id
    }
    try {
      await support
        .refreshTrustedAdvisorCheck(params)
        .promise()
    } catch (error) {
      console.error(id, error)
      throw error
    }
  }
  return event
}
