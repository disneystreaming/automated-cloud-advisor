const AWS = require('aws-sdk')

const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

const COST = 'Estimated Monthly Savings'
const REGION = 'Region'

/**
 * Converts cost string to a number
 * @param {Number} value
 */
const convert = (value) => Math.floor(Number(value.split('$')[1]))

/**
 * Calculate ttl for DynamoDB Record
 */
const ttl = () => {
  const SECONDS_IN_AN_HOUR = 60 * 60
  const DAY = 24
  const TTL = DAY * SECONDS_IN_AN_HOUR
  const secondsSinceEpoch = Math.round(Date.now() / 1000)
  const expirationTime = secondsSinceEpoch + TTL
  return expirationTime.toString()
}

/**
 * Schema for DynamoDB record
 * @param {Object} metaData - Contains more details on AWS Resource
 * @param {Number} monthlyCost
 * @param {String} region
 * @param {String} resourceId
 * @param {String} resourceName
 * @param {String} service
 */
const schema = (metaData, monthlyCost, region, resourceId, resourceName, service) => ({
  id: { S: `${service}-${region}-${resourceName}` },
  ttl: { N: ttl() },
  updatedTime: { N: Date.now().toString() },
  // metaData,
  monthlyCost: { N: `${monthlyCost}` },
  region: { S: region },
  resourceId: { S: resourceId },
  resourceName: { S: resourceName },
  service: { S: service }
})

/**
 * Converts AWS Trusted Advisor events to a DynamoDB Schema
 */
const CHECK_NAME = {
  'Amazon RDS Idle DB Instances': (record, resourceId) => schema(
    { ...record },
    convert(record['Estimated Monthly Savings (On Demand)']),
    record[REGION],
    resourceId,
    record['DB Instance Name'],
    'rds'
  ),
  'Low Utilization Amazon EC2 Instances': (record, resourceId) => {
    const [country, code, az] = record[`${REGION}/AZ`].split('-')
    const [zone] = az.split('')
    return schema(
      { ...record },
      convert(record[COST]),
            `${country}-${code}-${zone}`,
            resourceId,
            record['Instance ID'],
            'ec2'
    )
  },
  'Underutilized Amazon EBS Volumes': (record, resourceId) => schema(
    { ...record },
    convert(record['Monthly Storage Cost']),
    record[REGION],
    resourceId,
    record['Volume ID'],
    'ebs'
  ),
  'Unassociated Elastic IP Addresses': ({ 'IP Address': resourceName, Region: region }) => schema(
    {},
    Number(0.01 * 731),
    region,
        `arn:aws:ec2:${region}:*:eip/${resourceName}`,
        resourceName,
        'eip'
  ),
  'Idle Load Balancers': (record, resourceId) => schema(
    { ...record },
    convert(record[COST]),
    record[REGION],
    resourceId,
    record['Load Balancer Name'],
    'elb'
  ),
  'Underutilized Amazon Redshift Clusters': (record, resourceId) => schema(
    { ...record },
    Number(record[COST]),
    record[REGION],
    resourceId,
    record.Cluster,
    'redshift'
  )
}
/**
 * Triggers a upsert/delete to dynamodb
 * @param {Object} event
 * @returns {Number}
 */
exports.handler = async (event) => {
  const {
    resource_id: resourceId,
    'check-name': checkName,
    'check-item-detail': checkItemDetail
  } = event.detail

  let Item = null

  if (checkName in CHECK_NAME) {
    const resourceType = CHECK_NAME[checkName]
    Item = resourceType(checkItemDetail, resourceId)
    const params = {
      TableName: process.env.DB_NAME,
      Item
    }
    try {
      await dynamodb
        .putItem(params)
        .promise()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return Item
}
