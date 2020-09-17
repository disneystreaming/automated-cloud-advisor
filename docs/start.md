---
id: start
title: Getting Started
---

## Automated Cloud Advisor

**Automated Cloud Advisor** is [cloud custodian-like](https://cloudcustodian.io/) that uses [Trusted Advisor](https://aws.amazon.com/premiumsupport/technology/trusted-advisor/) to periodically gather cost-related data associated to your AWS accounts.

## Scope

Automated Cloud Advisor helps with cost optimization by automating the collection of data on AWS resources that are under-utilized, and providing a useful display for this data.

![alt-text](/automated-cloud-advisor/img/kibana/dashboard/01-dashboard.png)

## Trusted Advisor

[Trusted Advisor](https://aws.amazon.com/premiumsupport/technology/trusted-advisor/) scans all of your AWS resources and identifies resources based on the following categories.

- Cost Optimization - Identify low utilized resources.
  - Example: Email resource owners, flag or decommission resources.
- Performance - Identify resources that can be optimized.
  - Example: Cloudfront is misconfigured and too many redirects.
- Security - Identify security vulnerabilities.
  - Example: SGs are wide open, Some S3 buckets have public access.
- Fault Tolerance - Identify data storage that has not been backed up
  - Example: Be compliant with disaster recovery strategies.
- Service Limit - Identify when near maxing service limits.
  - Example: When S3 buckets reach the max limit of 1000.

Automated Cloud Advisor uses the Cost Optimization data and provides insight via relevant widgets in a Kibana dashboard.
