const success = (command, callback) => callback(null, { stdout: 'true' })
const error = (command, callback) => callback(null, { stderr: 'Error' })

const happy = {
  exec: jest.fn(success)
}

const unhappy = {
  exec: jest.fn(error)
}

module.exports = {
  happy,
  unhappy
}
