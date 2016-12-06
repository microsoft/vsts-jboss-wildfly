# Visual Studio Team Services Extension for JBoss and WildFly

This extension installs the following components:
* A service endpoint for connecting to JBoss EAP 7 and WildFly 8 and above.
* A build task to run commands over HTTP management endpoint.
* A build task to deploy your WAR and EAR files to JBoss EAP 7 and WildFly 8 and above.

## Create a JBoss EAP / WildFly Connection
* Make sure the application server's management http interface is exposed and can be reached over the network.

1. Open the Services page in your Visual Studio Team Services Control Panel
1. In the New Service Endpoint list, choose "JBoss and WildFly"

   ![WildFly/JBoss EAP Endpoint](Tasks/images/AddNewConnection.png)

1. Create a "JBoss and WildFly" Service Endpoint and specify your JBoss EAP 7 or WildFly 8+ management URL, username and password.  

   ![WildFly/JBoss EAP Endpoint](Tasks/images/WildFlyConnection.png)

## Manage JBoss and WildFly servers over http

1. Open your build definition and add the "JBoss EAP / WildFly Management CLI" task. The task can be found in the "Utility" section.

   ![WildFly/Mangement task](Tasks/images/managementtask.png) 
  
1. Select the "JBoss and WildFly" service endpoint defined.
1. Enter commands to be executed, one command per line.

## Deploy applications to JBoss EAP 7 and WildFly 8 and above

1. Open your build definition and add the "JBoss EAP / WildFly Deployer CLI" task. The task can be found in the "Utility" section.

   ![WildFly/Deployment task](Tasks/images/deploymenttask.png) 
  
1. Select the "JBoss and WildFly" service endpoint defined.
1. Enter the file to be deployed, wildcard is allowed.
1. Select and enter other optional fields.  Hoover over the info icon at the end of each field for additional help.

## How to build
### Prereqs
  1. maven 3.x
  1. Java Development Kit 1.7.x
  1. Node v4+ and Npm 3.x+
  
### Steps
  1. cd into repo root
  1. `npm install`
  1. `gulp jbosslibs`
  1. `gulp build`

The vsix will be created under `_package` folder.  

