---
id: stream
title: Stream Index To ElasticSearch
---

![alt-text](/automated-cloud-advisor/img/view_data.png)

This stack will automate the process of updating/deleting the data in ElasticSearch.

## Resources

Here are the types of the various AWS resources created by this stack.

```yml
Policy: AWS::IAM::ManagedPolicy
Role: AWS::IAM::Role
ElasticSearch: AWS::Elasticsearch::Domain
Lambda: AWS::Lambda::Function
LambdaStream: AWS::Lambda::EventSourceMapping
```

### Event Source Mapping

The previous Index CFT will have exported the `StreamARN` value which needs to be passed in as a parameter to get the Stream ARN to map the stream events to the Lambda.

```yml
EventSourceArn:
    Fn::ImportValue:
        !Sub '${StreamARN}'
```

### VPC

You will need to create two SGs and two Subnets in a VPC as a prerequisite.

#### Subnets

These will shared for the Lambda and ElasticSearch service.

### Lambda

The Lambda parse the event from the stream and `post` or `delete` the elastic search document.

```js
const doc = buildDoc(record);
const request = buildRequest(doc, eventName);
signRequest(request);
await sendRequest(request);
```

#### Permission

##### Logs

The Lambda will need IAM credentials to execute the `CreateLogGroup`, `CreateLogStream`, and `PutLogEvents` API.

```yml
Effect: Allow
Action:
    - logs:CreateLogGroup
    - logs:CreateLogStream
    - logs:PutLogEvents
Resource: '*'
```

##### Dynamodb

The Lambda will need IAM credentials to execute the `DescribeStream`, `GetRecords`, `GetRecords`, `DescribeStream`, and `GetShardIterator` API.

```yml
Effect: Allow
Action:
    - dynamodb:DescribeStream
    - dynamodb:GetRecords
    - dynamodb:DescribeStream
    - dynamodb:GetShardIterator
Resource: '*'
```

##### ElasticSearch

The Lambda will need IAM credentials to execute the `ESHttpPost` and `ESHttpDelete` API.

```yml
Effect: Allow
Action:
    - es:ESHttpPut
    - es:ESHttpDelete
Resource: '*'
```

##### EC2

The Lambda will need IAM credentials to execute the `CreateNetworkInterface`, `DeleteNetworkInterface` and `DescribeNetworkInterfaces` API.

```yml
Effect: Allow
Action:
    - ec2:CreateNetworkInterface
    - ec2:DeleteNetworkInterface
    - ec2:DescribeNetworkInterfaces
Resource: '*'
```

##### KMS

The Lambda will need IAM credentials to execute the `Decrypt` API to decrypt the environment variables.

```yml
Effect: Allow
Action:
    - kms:Decrypt
Resource: '*'
```

### Elastic Search Service

#### Cluster

There will be three master nodes and two instance nodes. The two Subnets will be used for high availability. The data will stored on gp2 EBS with 20gb volume sizes.

#### Security

The ES Service will be running in VPC, which is a prerequisites to using Kibana. The VPC will provide a layer of security.

##### SG

You will need to open port `443` to allow access to the infrastructure.

##### Access Policies

Kibana endpoint is behind a VPC and SG that you defined. As for now, the access policy is open to anyone in the vpc. Here is another layer of protection that you can configure.

```yml
Effect: Allow
Principal:
    AWS: '*'
Action: '*'
Resource: '*'
```

## Parameters

### Required

```yml
ResourcePrefix: String
    Description: Prefix that will be added to all resources
ResourceName: String
    Description: Name that will be added to all resources
S3_BUCKET: String
    Description: S3 bucket reference
S3KeyStream: String
    Description: S3 key reference
# DynamoDB Stream Arn
StreamARN: String
    Description: Stream ARN from the DynamoDB Index Table
# VPC
SecurityGroupIdsLambda: CommaDelimitedList
    Description: List of Security Group Ids for Lambda
SecurityGroupIdsES: CommaDelimitedList
    Description: List of Security Group Ids for Elastic Search
SubnetIds: CommaDelimitedList
    Description: List of SubnetIds
```

### Optional

```yml
# Stream
BatchSize: Number
    Description: Batch size of events that will trigger the Lambda
    Default: 50
# Elastic Search
Index: String
    Description: ElasticSearch Index
    Default: trusted-advisor
ElasticsearchVersion: Number
    Description: ElasticSearch version
    Default: 7.7
DedicatedMasterType: String
    Description: Dedicated Master type
    Default: r5.large.elasticsearch
DedicatedMasterCount: Number
    Description: Number of dedicated master nodes
    Default: 3
InstanceType: String
    Description: Instance type
    Default: r5.large.elasticsearch
InstanceCount: Number
    Description: Number of instances
    Default: 2
# EBS
Iops: Number
    Description: Iops
    Default: 0
VolumeType: String
    Description: Volume Type
    Default: gp2
VolumeSize: Number
    Description: Volume size of EBS
    Default: 20
```

## Outputs

```yml
PolicyArn: Policy Arn
RoleName: Role Name
RoleArn: Role Arn
RoleId: Role Id
ElasticSearchId: ElasticSearch Id
ElasticSearchArn: ElasticSearch Arn
ElasticSearchDomainArn: ElasticSearch Domain Arn
ElasticSearchDomainEndpoint: ElasticSearch Domain Endpoint
LambdaName: Lambda Name
LambdaArn: Lambda Arn
RuleArn: Rule Arn
Kibana: Kibana Endpoint
```

## CLI

```bash
# Optional - You will need a valid way of authenticating with the CLI
# aws cloudformation create-stack --profile $PROFILE --region us-east-1 ...
export PROFILE=test-profile
# Required
export PREFIX=team-name
export STREAM_NAME=aca-stream
export S3_BUCKET=test-bucket
export S3_KEY_STREAM=stream.zip

export INDEX_NAME=aca-index
export STREAM_ARN=$PREFIX-$INDEX_NAME-StreamArn
export SG_LAMBDA="sg-54321"
export SG_ES="sg-12345"
export SUBNET_IDS="subnet-1234567\,subnet-7654321"

pushd src/lambda
    zip -X $S3_KEY_STREAM stream.js
    aws s3 cp \
        $S3_KEY_STREAM s3://$S3_BUCKET
    rm -rf $S3_KEY_STREAM
popd

STREAM_STACK=$(aws cloudformation \
    create-stack \
    --region us-east-1 \
    --stack-name $PREFIX-$STREAM_NAME \
    --template-body file://src/aws/stream.yml \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameters ParameterKey=ResourcePrefix,ParameterValue=$PREFIX \
    ParameterKey=ResourceName,ParameterValue=$STREAM_NAME \
    ParameterKey=S3Bucket,ParameterValue=$S3_BUCKET \
    ParameterKey=S3KeyStream,ParameterValue=$S3_KEY_STREAM \
    ParameterKey=StreamARN,ParameterValue=$STREAM_ARN \
    ParameterKey=SecurityGroupIdsLambda,ParameterValue=$SG_LAMBDA \
    ParameterKey=SecurityGroupIdsES,ParameterValue=$SG_ES \
    ParameterKey=SubnetIds,ParameterValue=$SUBNET_IDS | jq '.StackId' | tr -d '"')

echo Building Stream Stack $PREFIX-$STREAM_NAME
echo Stream ARN - $STREAM_ARN
echo VPC - $SUBNET_IDS
echo SG - Lambda $SG_LAMBDA ES $SG_ES

aws cloudformation wait \
    stack-create-complete \
    --stack-name $STREAM_STACK

echo Stream Stack has been deployed!
```
