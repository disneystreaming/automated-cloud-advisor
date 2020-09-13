const insert = {
  Records: [
    {
      eventID: 'cb60effe377331f5907118d565b79854',
      eventName: 'INSERT',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'us-east-1',
      dynamodb: {
        ApproximateCreationDateTime: 1588982137,
        Keys: {
          id: { S: 'ebs-us-east-1-vol-123456789012' },
          updatedTime: { N: '1589136894406' }
        },
        NewImage: {
          resourceId: {
            S: 'arn:aws:ec2:us-east-1:123456789012:volume/vol-123456789012'
          },
          service: { S: 'ebs' },
          resourceName: { S: 'vol-123456789012' },
          id: { S: 'ebs-us-east-1-vol123456789012' },
          updatedTime: { N: '1589136894406' },
          region: { S: 'us-east-1' },
          ttl: { N: '86400000' },
          monthlyCost: { N: '3' }
        },
        SequenceNumber: '100000000048144348062',
        SizeBytes: 237,
        StreamViewType: 'NEW_IMAGE'
      },
      eventSourceARN: 'arn:aws:dynamodb:us-east-1:123456789012:table/xxxxxxxxxx/stream/2020-05-08T23:36:37.039'
    }
  ]
}

const invalid = {
  Records: [
    {
      eventID: 'cb60effe377331f5907118d565b79854',
      eventName: 'INVALID',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'us-east-1',
      dynamodb: {
        ApproximateCreationDateTime: 1588982137,
        Keys: {
          id: { S: 'ebs-us-east-1-vol-123456789012' },
          updatedTime: { N: '1589136894406' }
        }
      },
      eventSourceARN: 'arn:aws:dynamodb:us-east-1:123456789012:table/xxxxxxxxxx/stream/2020-05-08T23:36:37.039'
    }
  ]
}

const remove = {
  Records: [
    {
      eventID: 'cb60effe377331f5907118d565b79854',
      eventName: 'REMOVE',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'us-east-1',
      dynamodb: {
        ApproximateCreationDateTime: 1588982137,
        Keys: {
          id: { S: 'ebs-us-east-1-vol-123456789012' },
          updatedTime: { N: '1589136894406' },
          fakeKey: { B: 'true' }
        }
      },
      eventSourceARN: 'arn:aws:dynamodb:us-east-1:123456789012:table/xxxxxxxxxx/stream/2020-05-08T23:36:37.039'
    }
  ]
}

module.exports = {
  insert,
  invalid,
  remove
}
