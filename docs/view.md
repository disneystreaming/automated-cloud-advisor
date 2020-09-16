---
id: view
title: Kibana
---

## Create The Index

You can find the `ElasticSearchDomainEndpoint` from the previous CFT output.

Navigate to the Kibana endpoint to create an index pattern.
> https://`ElasticSearchDomainEndpoint`/_plugin/kibana/app/kibana#/management/kibana/index_pattern?_g=()

Type in the index that you specified and click `Next step`.
![alt-text](/automated-cloud-advisor/img/kibana/index/01-index.png)

Click `Create index pattern`.
![alt-text](/automated-cloud-advisor/img/kibana/index/02-index.png)

View the Index pattern.
![alt-text](/automated-cloud-advisor/img/kibana/index/03-index.png)

## Upload Kibana Source Files

The Kibana dashboard can be downloaded from [github](https://github.com/disneystreaming/automated-cloud-advisor/tree/master/src/kibana/dashboard.ndjson).

Go to the Management page and click on Saved Objects.
> https://`ElasticSearchDomainEndpoint`/_plugin/kibana/app/kibana#/management/kibana/objects?_g=()

Click on Import.
![alt-text](/automated-cloud-advisor/img/kibana/import/01-import.png)

Drag file or import file.
![alt-text](/automated-cloud-advisor/img/kibana/import/02-import.png)

Click On Import.
![alt-text](/automated-cloud-advisor/img/kibana/import/03-import.png)


## View Dashboard

> https://`ElasticSearchDomainEndpoint`/_plugin/kibana/app/kibana#/dashboard/058e1e70-5a8d-11ea-aa13-c18c574b22bb?_g=()&_a=(description:'',filters:!(),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),panels:!((embeddableConfig:(),gridData:(h:15,i:'2',w:24,x:24,y:15),id:db2e2f20-5a97-11ea-aa13-c18c574b22bb,panelIndex:'2',type:visualization,version:'7.4.2'),(embeddableConfig:(),gridData:(h:15,i:'3',w:24,x:0,y:15),id:'0b591de0-5a98-11ea-aa13-c18c574b22bb',panelIndex:'3',type:visualization,version:'7.4.2'),(embeddableConfig:(),gridData:(h:15,i:'4',w:24,x:24,y:0),id:'27ffee90-5c98-11ea-aa13-c18c574b22bb',panelIndex:'4',type:visualization,version:'7.4.2'),(embeddableConfig:(),gridData:(h:15,i:c1205809-d610-4f2c-ae7f-217b2deaa77e,w:24,x:0,y:0),id:'7a8592a0-5c98-11ea-aa13-c18c574b22bb',panelIndex:c1205809-d610-4f2c-ae7f-217b2deaa77e,type:visualization,version:'7.4.2')),query:(language:kuery,query:''),timeRestore:!f,title:'Cost%20Optimization%20Summary',viewMode:view)

![alt-text](/automated-cloud-advisor/img/kibana/dashboard/01-dashboard.png)
