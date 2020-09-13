const AWS = require('aws-sdk');

/**
 * Converts types to DynamoDB Schema
 */
const TYPES = {
    S: (val) => val,
    N: (val) => Number(val),
    B: (val) => Boolean(val)
};

/**
 * Builds http request
 */
const EVENTS = {
    INSERT: (request, doc) => {
        request.method = 'PUT';
        request.body = JSON.stringify(doc);
        request.headers = {
            ...request.headers,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(request.body)
        };
    },
    REMOVE: (request) => {
        request.method = 'DELETE';
    }
};

/**
 * Builds DynamoDB Document
 * @param {Object} record
 * @returns {Object}
 */
const buildDocument = (record) => Object.fromEntries(Object.entries(record).map(([key, tuple]) => {
    const [ object ] = Object.entries(tuple);
    const [ type, value ] =  object;
    const attribute = TYPES[type](value);
    return [ key, attribute ];
}));

/**
 * Builds AWS request to hit ElasticSearch endpoint
 * @param {Object} document
 * @param {String} eventName
 * @returns {Object}
 */
const buildRequest = (document, eventName) => {
    const { DOMAIN, INDEX, REGION, TYPE } = process.env;

    const endpoint = new AWS.Endpoint(DOMAIN);
    const request = new AWS.HttpRequest(endpoint, REGION);
    
    request.path += `${INDEX}/${TYPE}/${document.id}`;
    request.headers = {
        ...request.headers,
        host: DOMAIN,
    };

    const requestType = EVENTS[eventName];
    requestType(request, document);

    return request;
};

/**
 * Signs the request
 * @param {Object} request
 */
const signRequest = (request) => {
    const credentials = new AWS.EnvironmentCredentials('AWS');
    const signer = new AWS.Signers.V4(request, 'es');
    signer.addAuthorization(credentials, new Date());
};

/**
 * Sends the request to the endpoint
 * @param {Object} req
 * @returns {Promise}
 */
const sendRequest = (req) => new Promise((resolve, reject) => new AWS.HttpClient()
    .handleRequest(req, null, (httpResp) => {
        const respBody = [];
        httpResp
            .on('data', (chunk) => respBody.push(chunk))
            .on('end', () => resolve(respBody.join('')));
    }, (err) => reject(err))
);

/**
 * Triggers a http request to upsert/delete record in ElasticSearch
 * @param {Object} event
 * @returns {Number}
 */
exports.handler = async (event) => {
    const { Records } = event;

    for (const record of Records) {
        const { eventName, dynamodb } = record;
        if (eventName in EVENTS) {
            const recordEvent = eventName === 'INSERT'
                ? dynamodb.NewImage
                : dynamodb.Keys;

            const document = buildDocument(recordEvent);
            const request = buildRequest(document, eventName);

            try {
                signRequest(request);
                await sendRequest(request);
            } catch (error) {
                console.error(error);
                throw error;
            }  
        }
    }

    return Records.length;
};
