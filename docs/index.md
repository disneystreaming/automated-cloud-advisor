---
id: index
title: Index Events To DynamoDB
---

![alt-text](/automated-cloud-advisor/img/index_data.png)

This stack will automate the process for parsing the Trusted Advisor data and storing on the DynamoDB index.

## Resources

Here are the types of the various AWS resources created by this stack.

```yml
Rule: AWS::Events::Rule
Lambda: AWS::Lambda::Function
DynamoDB: AWS::DynamoDB::Table
Policy: AWS::IAM::ManagedPolicy
Role: AWS::IAM::Role
PermissionForEventsToInvokeLambda: AWS::Lambda::Permission
```

### Event Rule

CloudWatch can be used to look for specific events based on patterns, and send them to AWS lambdas. In this case, the pattern that is sought is the invocation of Trusted Advisor's `refreshTrustedAdvisorCheck` function, which triggers a lambda that stores cost-utilization data into a DynamoDB table for later analysis or processing.

```yml
EventPattern:
    source:
        - aws.trustedadvisor
    detail-type:
        - Trusted Advisor Check Item Refresh Notification
    detail:
        status:
            - WARN
        check-name:
            - Amazon RDS Idle DB Instances
            - Low Utilization Amazon EC2 Instances
            - Underutilized Amazon EBS Volumes
            - Unassociated Elastic IP Addresses
            - Idle Load Balancers
            - Underutilized Amazon Redshift Clusters
```

#### Permission

The event needs permissions to invoke the Lambda.

```yml
PermissionForEventsToInvokeLambda: AWS::Lambda::Permission
```

### Lambda

The Lambda parses the event, maps it to a workable schema, and invokes DynamoDB's `putItem` API.

```js
const params = {
    TableName: process.env.DB_NAME,
    Item
};
await dynamodb.putItem(params).promise();
```

#### Permission

##### Logs

The Lambda needs IAM credentials to execute a few actions:

```yml
Effect: Allow
Action:
    - logs:CreateLogGroup
    - logs:CreateLogStream
    - logs:PutLogEvents
Resource: '*'
```

##### Dynamodb

The Lambda needs IAM credentials to call upon DynamoDB's `PutItem` operation.

```yml
Effect: Allow
Action:
    - dynamodb:PutItem
Resource: '*'
```

##### KMS

The Lambda needs IAM credentials to execute the KMS' `Decrypt` operation, in order to decipher encrypted environment variables.

```yml
Effect: Allow
Action:
    - kms:Decrypt
Resource: '*'
```

### DynamoDB

This NoSQL database is used to index the data coming from Trusted Advisor

#### Keys

```yml
AttributeDefinitions:
    -
        AttributeName: id
        AttributeType: S
KeySchema:
    -
        AttributeName: id
        KeyType: HASH
```

#### DynamoDB Stream

Whenever a record is inserted to (or deleted from) DynamoDB, a corresponding event is sent to a lambda, which receives them in batches. This lambda removes stale data from elastic search.

##### Insert

An Insert event is triggered whenever DynamoDB's `putItem` operation is invoked.

```yml
StreamSpecification:
    StreamViewType: NEW_IMAGE
```

##### Remove

A Remove event is triggered whenever the record expires. The expiration date of a record is materialized by the presence of a `TTL` (time-to-live) field in it.

```yml
TimeToLiveSpecification:
    AttributeName: ttl
    Enabled: true
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
```

## Outputs

```yml
PolicyArn: Policy Arn
RoleName: Role Name
RoleArn: Role Arn
RoleId: Role Id
LambdaName: Lambda Name
LambdaArn: Lambda Arn
RuleArn: Rule Arn
DynamoDBName: DynamoDB Name
DynamoDBArn: DynamoDB Arn
DynamoDBStreamArn: DynamoDB Stream Arn
    Export: !Sub '${AWS::StackName}-StreamArn'
```

## CLI

```bash
# Optional - You will need a valid way of authenticating with the CLI
# aws cloudformation create-stack --profile $PROFILE --region us-east-1 ...
export PROFILE=test-profile
# Required
export PREFIX=team-name
export INDEX_NAME=aca-index
export S3_BUCKET=test-bucket
export S3_KEY_INDEX=index.zip

pushd src
    zip -X $S3_KEY_INDEX index.js
    aws s3 cp \
        $S3_KEY_INDEX s3://$S3_BUCKET
    rm -rf $S3_KEY_INDEX
popd

INDEX_STACK=$(aws cloudformation \
    create-stack \
    --region us-east-1 \
    --stack-name $PREFIX-$INDEX_NAME \
    --template-body file://aws/index.yml \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameters ParameterKey=ResourcePrefix,ParameterValue=$PREFIX \
    ParameterKey=ResourceName,ParameterValue=$INDEX_NAME \
    ParameterKey=S3Bucket,ParameterValue=$S3_BUCKET \
    ParameterKey=S3KeyIndex,ParameterValue=$S3_KEY_INDEX | jq '.StackId' | tr -d '"')

echo Building Index Stack $PREFIX-$INDEX_NAME

aws cloudformation wait \
    stack-create-complete \
    --stack-name $INDEX_STACK

echo Index Stack has been deployed!
```
