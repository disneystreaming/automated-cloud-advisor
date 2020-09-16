---
id: refresh
title: Schedule Trusted Advisor Refresh
---

![alt-text](/automated-cloud-advisor/img/trusted_advisor.png)

This stack will automate the process of refreshing Trusted Advisor data.

## Resources

Here are the types of the various AWS resources created by this stack.

```yml
Policy: AWS::IAM::ManagedPolicy
Role: AWS::IAM::Role
Lambda: AWS::Lambda::Function
Rule: AWS::Events::Rule
PermissionForEventsToInvokeLambda: AWS::Lambda::Permission
```

### Event rule

CloudWatch has the ability to be used like cron, which we leverage to periodically trigger a Lambda.

```yml
ScheduleExpression: rate(1 hour)
```

#### Permission

The event rule needs permission to invoke the Lambda.

```yml
PermissionForEventsToInvokeLambda: AWS::Lambda::Permission
```

### Lambda

The Lambda calls the `refreshTrustedAdvisorCheck` API to have Trusted Advisor recomputes cost-analysis data.

```js
const CHECK_IDS = {
    'Amazon RDS Idle DB Instances': 'Ti39halfu8',
    'Low Utilization Amazon EC2 Instances': 'Qch7DwouX1',
    'Underutilized Amazon EBS Volumes': 'DAvU99Dc4C',
    'Unassociated Elastic IP Addresses': 'Z4AUBRNSmz',
    'Idle Load Balancers': 'hjLMh88uM8'
};
const params = {
    checkId
};
await support.refreshTrustedAdvisorCheck(params).promise();
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

##### Support

The Lambda needs IAM credentials to execute the Trusted Advisor's `refreshTrustedAdvisorCheck` operation.

```yml
Effect: Allow
Action:
    - support:RefreshTrustedAdvisorCheck
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
S3KeyRefresh: String
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
```

## CLI

```bash
# Optional - You will need a valid way of authenticating with the CLI
# aws cloudformation create-stack --profile $PROFILE --region us-east-1 ...
export PROFILE=test-profile
# Required
export PREFIX=team-name
export REFRESH_NAME=aca-refresh
export S3_BUCKET=test-bucket
export S3_KEY_REFRESH=refresh.zip

pushd src/lambda
    zip -X $S3_KEY_INDEX index.js
    aws s3 cp \
        $S3_KEY_INDEX s3://$S3_BUCKET
    rm -rf $S3_KEY_INDEX
popd

INDEX_STACK=$(aws cloudformation \
    create-stack \
    --region us-east-1 \
    --stack-name $PREFIX-$INDEX_NAME \
    --template-body file://src/aws/index.yml \
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
