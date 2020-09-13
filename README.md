<img src="https://github.com/disneystreaming/automated-cloud-advisor/raw/master/website/static/img/logo.png" width="200px" height="231px" align="right">

![Build](https://github.com/disneystreaming/automated-cloud-advisor/workflows/Build/badge.svg)
![Docs](https://github.com/disneystreaming/automated-cloud-advisor/workflows/Docs/badge.svg)
[![Gitter](https://img.shields.io/gitter/room/disneystreaming/automated-cloud-advisor.svg)](https://gitter.im/disneystreaming/automated-cloud-advisor)
[![CLA assistant](https://cla-assistant.io/readme/badge/disneystreaming/automated-cloud-advisor)](https://cla-assistant.io/disneystreaming/automated-cloud-advisor)


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=disneystreaming_automated-cloud-advisor&metric=alert_status)](https://sonarcloud.io/dashboard?id=disneystreaming_automated-cloud-advisor)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=disneystreaming_automated-cloud-advisor&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=disneystreaming_automated-cloud-advisor)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=disneystreaming_automated-cloud-advisor&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=disneystreaming_automated-cloud-advisor)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=disneystreaming_automated-cloud-advisor&metric=security_rating)](https://sonarcloud.io/dashboard?id=disneystreaming_automated-cloud-advisor)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=disneystreaming_automated-cloud-advisor&metric=coverage)](https://sonarcloud.io/dashboard?id=disneystreaming_automated-cloud-advisor)

# Automated-Cloud-Advisor

[Automated Cloud Custodial Service](https://github.com/disneystreaming/automated-cloud-advisor/)

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

Click [here](https://github.com/disneystreaming/automated-cloud-advisor/docs/setup/) to view prerequisites, dependencies, and requirements.

## Uninstall

You can delete the stacks through the AWS CloudFormation console or CLI by referencing the stack name/id.

## Contribute

Fork this repo and submit a pull request to the dev branch.

## Coding Standards

Pull requests pass eslint and should maintain 100% unit test code coverage.

## Maintenance Plan

Merging to the master branch leads to the automatic publication of a new version of the tool.
