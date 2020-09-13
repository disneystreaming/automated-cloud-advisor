---
id: setup
title: Prerequisites
---

## AWS

The installation assumes that the following AWS resources have been created/set-up and can be referenced in the us-east-1 region:

- AWS account
- [AWS CLI](https://aws.amazon.com/cli/)
- IAM credentials
- S3 bucket
- VPC
  - Subnets
  - SG
- Trusted Advisor

Review [Trusted Advisor](https://aws.amazon.com/premiumsupport/ta-iam/) for more customization.

## Permission

### Credentials

You should have valid credentials to interact with the AWS CLI. This tool will allow you to use the `--profile` argument.

### Cloudformation

Automated Cloud Advisor is provided as a set of [Cloudformation](https://aws.amazon.com/cloudformation/) templates, the deployment of which leading to the provisioning of the various required resources.

The deployment of the templates requires the caller to have enough [IAM](https://aws.amazon.com/iam/) access rights for the creation of the following resources:

```yml
3: 'AWS::IAM::ManagedPolicy'
3: 'AWS::IAM::Role'
3: 'AWS::Lambda::Function'
2: 'AWS::Events::Rule'
2: 'AWS::Lambda::Permission'
1: 'AWS::Lambda::EventSourceMapping'
1: 'AWS::DynamoDB::Table'
1: 'AWS::Elasticsearch::Domain'
```

## Security

### S3

Your S3 bucket will be used as a reference for the lambda source code and should have the proper version enabled/ACL/Bucket Policy attached.

### VPC

As a prerequisite, the deployment of the Kibana dashboard requires the existence [VPC](https://aws.amazon.com/vpc/) with subnets and security groups.

## Cost

Infrastructure configurations can be overwritten to tweak costs. Average estimation provided below will vary on your resources.

[Lambda](https://aws.amazon.com/lambda/pricing/) - Less than $1 per month

- Refresh
  - 128mb
  - Avg Execution 1000ms
  - Avg Concurrency 1
- Index
  - 128mb
  - Avg Execution 500ms
  - Avg Concurrency 100
- Stream
  - 128mb
  - Avg Execution 50ms
  - Avg Concurrency 4

[DynamoDB](https://aws.amazon.com/dynamodb/pricing/) - Less than $1 per month.

- Read/Write - BillingMode is set to PAY_PER_REQUEST
  - Read
    - 0 Consume
  - Write
    - Avg Consume 4
- DB Stream
  - Avg Batch 1,100 bytes

[ElasticSearch](https://aws.amazon.com/elasticsearch-service/pricing/?nc=sn&loc=3) - Less than $1,000 per month.

- Custer
  - EC2
    - Master - 3
      - r5.large.elasticsearch
    - Instance - 2
      - r5.large.elasticsearch
  - EBS - gp2
    - 0 IOPS
    - 20 GB

## Quick Setup

You can either run this script or manually set up the infrastructure in the next few steps. The script assumes that [jq](https://stedolan.github.io/jq/) (a json parsing library) is installed on your system and that you have valid credentials that can be used to create AWS resources through CloudFormation.

```bash
# Clone Repo
git clone git@github.com:disneystreaming/automated-cloud-advisor.git
# Move to directory
cd automated-cloud-advisor
# Install dev dependencies
npm i
# Run Install
node install.js
```
