const events = {
  ebs: require('./ebs.json'),
  ec2: require('./ec2.json'),
  eip: require('./eip.json'),
  elb: require('./elb'),
  rds: require('./rds.json'),
  redshift: require('./redshift.json')
}
const schema = {
  ebs: {
    id: { S: 'ebs-us-east-1-vol-123456789012' },
    ttl: { N: '86400000' },
    updatedTime: { N: '1589136344695' },
    monthlyCost: { N: '2.50' },
    region: { S: 'us-east-1' },
    resourceId: { S: 'arn:aws:ec2:us-east-1:123456789012:volume/vol-123456789012' },
    resourceName: { S: 'vol-123456789012' },
    service: { S: 'ebs' }
  },
  ec2: {
    id: { S: 'ec2-eu-central-1-i-123456789012' },
    ttl: { N: '86400000' },
    updatedTime: { N: '1589136894406' },
    monthlyCost: { N: '1257.12' },
    region: { S: 'eu-central-1' },
    resourceId: {
      S: 'arn:aws:ec2:eu-central-1:123456789012:instance/i-123456789012'
    },
    resourceName: { S: 'i-123456789012' },
    service: { S: 'ec2' }
  },
  eip: {
    id: { S: 'eip-us-west-2-0.0.0.0' },
    ttl: { N: '86400000' },
    updatedTime: { N: '1589136894408' },
    monthlyCost: { N: '7.31' },
    region: { S: 'us-west-2' },
    resourceId: { S: 'arn:aws:ec2:us-west-2:*:eip/0.0.0.0' },
    resourceName: { S: '0.0.0.0' },
    service: { S: 'eip' }
  },
  elb: {
    id: { S: 'elb-us-east-1-example' },
    ttl: { N: '86400000' },
    updatedTime: { N: '1589138308034' },
    monthlyCost: { N: '18.00' },
    region: { S: 'us-east-1' },
    resourceId: {
      S: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/example'
    },
    resourceName: { S: 'example' },
    service: { S: 'elb' }
  },
  rds: {
    id: { S: 'rds-us-east-1-example' },
    ttl: { N: '86400000' },
    updatedTime: { N: '1589138119304' },
    monthlyCost: { N: '230.00' },
    region: { S: 'us-east-1' },
    resourceId: { S: 'arn:aws:rds:us-east-1:123456789012:example' },
    resourceName: { S: 'example' },
    service: { S: 'rds' }
  },
  redshift: {
    id: { S: 'redshift-us-east-1-example' },
    ttl: { N: '86400000' },
    updatedTime: { N: '1589136894424' },
    monthlyCost: { N: '684' },
    region: { S: 'us-east-1' },
    resourceId: { S: 'arn:aws:redshift:us-east-1:123456789012:cluster:example' },
    resourceName: { S: 'example' },
    service: { S: 'redshift' }
  }
}

const invalidEvent = require('./invalid.json')

module.exports = {
  events,
  schema,
  invalidEvent
}
