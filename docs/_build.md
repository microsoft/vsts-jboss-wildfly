#How to build

### Prereqs
  1. maven 3.x
  1. Java Development Kit 1.7.x
  1. Node v4+ and Npm 3.x+
  
### Steps
  1. cd into repo root
  1. Update `publisher` field in [extension manifest](../Tasks/extension-manifest.json)
  1. Update `id` fields in [here](../Tasks/JBossDeployer/task.json) and [here](../Tasks/JBossManagementCLI/task.json)
  1. `npm install`
  1. `gulp jbosslibs`
  1. `gulp build`
  1. `gulp test`

The vsix will be created under `_package` folder. 
