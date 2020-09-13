const Events = require('events')
const eventEmitter = new Events()

const success = () => true

const endpoint = {
  protocol: 'https:',
  host: 'endpoint.com',
  port: 443,
  hostname: 'endpoint.com',
  pathname: '/',
  path: '/',
  href: 'https://endpoint.com/'
}

const request = {
  body: '',
  path: '/',
  headers: {
    'User-Agent': 'aws-sdk-nodejs/2.673.0 darwin/v12.16.0'
  },
  endpoint: endpoint,
  region: 'us-east-1',
  _userAgent: 'aws-sdk-nodejs/2.673.0 darwin/v12.16.0'
}

const credentials = {
  expired: false,
  expireTime: null,
  refreshCallbacks: [],
  accessKeyId: undefined,
  sessionToken: undefined,
  envPrefix: 'AWS'
}

const happy = {
  Endpoint: jest.fn(() => endpoint),
  HttpRequest: jest.fn(() => request),
  EnvironmentCredentials: jest.fn(() => credentials),
  Signers: {
    V4: jest.fn(() => ({
      addAuthorization: jest.fn(success)
    }))
  },
  HttpClient: jest.fn(() => ({
    handleRequest: jest.fn((httpRequest, httpOptions, callback) => {
      callback(eventEmitter)
    })
  }))
}

const unhappy = {
  Endpoint: jest.fn(() => endpoint),
  HttpRequest: jest.fn(() => request),
  EnvironmentCredentials: jest.fn(() => credentials),
  Signers: {
    V4: jest.fn(() => ({
      addAuthorization: jest.fn(success)
    }))
  },
  HttpClient: jest.fn(() => ({
    handleRequest: jest.fn((httpRequest, httpOptions, callback, errCallback) => {
      errCallback(new Error('Error'))
    })
  }))
}

module.exports = {
  happy,
  unhappy,
  eventEmitter
}
