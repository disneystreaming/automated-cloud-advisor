![Node.js CI](https://github.com/disneystreaming/automated-cloud-advisor/workflows/Node.js%20CI/badge.svg)

# Automated-Cloud-Advisor

[Automated Cloud Custodial Service](https://github.com/pages/disneystreaming/automated-cloud-advisor/)

## Support

- Ayyaz Akhtar (ayyaz.akhtar@disneystreaming.com)

# Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Uninstall](#uninstall)
4. [Contribute](#contribute)
5. [Coding Standards](#coding-standards)
6. [Maintenance Plan](#maintenance-plan)

## Introduction

Automated Cloud Advisor is a extensible tool that aims at facilitating cost optimization in AWS, by collecting data for resources that are under utilized.

It is deployed as a set of cloudformation stacks that comprise the data collection and its display in a Kibana dashboard.

![alt-text](./docs/assets/01-dashboard.png)

## Prerequisites

Click [here](https://github.com/pages/disneystreaming/automated-cloud-advisor/docs/setup/) to view prerequisites, dependencies, and requirements.

## Uninstall

You can delete the stacks through the AWS CloudFormation console or CLI by referencing the stack name/id.

## Contribute

Fork this repo and submit a pull request to the dev branch.

## Coding Standards

Pull requests pass eslint and should maintain 100% unit test code coverage.

## Maintenance Plan

Merging to the master branch leads to the automatic publication of a new version of the tool.
