const events = {
  ebs: require('./ebs.json'),
  ec2: require('./ec2.json'),
  eip: require('./eip.json'),
  elb: require('./elb'),
  rds: require('./rds.json'),
  redshift: require('./redshift.json')
}
const schema = require('./schema')

const invalidEvent = require('./invalid.json')

module.exports = {
  events,
  schema,
  invalidEvent
}
