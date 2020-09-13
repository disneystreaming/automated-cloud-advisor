<img src="https://github.com/disneystreaming/automated-cloud-advisor/raw/master/website/static/img/logo.png" width="200px" height="231px" align="right">

![Build](https://github.com/disneystreaming/automated-cloud-advisor/workflows/Build/badge.svg)
![Docs](https://github.com/disneystreaming/automated-cloud-advisor/workflows/Docs/badge.svg)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=disneystreaming_automated-cloud-advisor&metric=alert_status)](https://sonarcloud.io/dashboard?id=disneystreaming_automated-cloud-advisor)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=disneystreaming_automated-cloud-advisor&metric=coverage)](https://sonarcloud.io/dashboard?id=disneystreaming_automated-cloud-advisor)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)


[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![CLA assistant](https://cla-assistant.io/readme/badge/disneystreaming/automated-cloud-advisor)](https://cla-assistant.io/disneystreaming/automated-cloud-advisor)


[![npm](https://img.shields.io/npm/v/automated-cloud-advisor)](https://www.npmjs.com/package/automated-cloud-advisor)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Join the chat at https://gitter.im/disneystreaming/automated-cloud-advisor](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/disneystreaming/automated-cloud-advisor)

# Automated-Cloud-Advisor

[Automated Cloud Advisor Docs](https://disneystreaming.github.io/automated-cloud-advisor/)

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

## Installation

Click [here](https://github.com/disneystreaming/automated-cloud-advisor/docs/setup/) to view prerequisites, dependencies, and requirements.

## Uninstall

You can delete the stacks through the AWS CloudFormation console or CLI by referencing the stack name/id.

## Contribute

- Sign the CLA
- Submit pull request to the master branch

## Coding Standards

- Documentaion
- Passing Lint
- Passing Unit Tests
- Code coverage is at 100%

## Maintenance Plan

Merging to the master branch leads to the automatic publication of a new version of the tool.
