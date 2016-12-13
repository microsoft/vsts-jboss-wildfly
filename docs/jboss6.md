# Deploy applications to JBoss EAP 6
To deploy WAR and EAR file to JBoss Enterprise Application Platform (EAP) 6 you need create the SSH script to run JBOSS Command Line Interface (CLI)

### Prereqs
  1. JBOSS 6 EAP installed and configured
  2. Linux machine with cross platform build agent for Team Foundation Server. For detailed instructions [check this guide](https://github.com/Microsoft/vsts-agent/blob/master/docs/start/envubuntu.md)
  2. SSH and SSH Pass configured

### Example SSH Script
The example bellow use SSH connection to connect in target machine and execute the JBOSS CLI commands line.
The steps required are:

  1. Create temp directory
  2. Copy files (Artifact) to temp directory
  3. Running `jboss-cli.sh` to undeploy old version
  4. Running `jboss-cli.sh` to deploy new version of WAR file
  5. Runnig `jboss-cli.sh` for check deployment status

```
!/bin/bash
echo "Deployment JBOSS..."

PACKAGETEMP=/tmp/package

echo "Creating temp dir"
sshpass -p P@ssw0rd ssh root@127.0.0.1 'mkdir -v $PACKAGETEMP'

echo "Copy files to target server"
sshpass -p P@ssw0rd scp -r -v $AGENT_RELEASEDIRECTORY/JavaBuild/Drop root@127.0.0.1:$PACKAGETEMP/hello.war

echo "Running undeploy command"
sshpass -p P@ssw0rd ssh root@127.0.0.1 '/opt/EAP-6.0.1/jboss-eap-6.0/bin/jboss-cli.sh --connect --controller=127.0.0.1 --user=admin --password=P@ssw0rd --command="undeploy hello.war --server-groups=HelloWorld"'

echo "Running deploy command"
sshpass -p P@ssw0rd ssh root@127.0.0.1 '/opt/EAP-6.0.1/jboss-eap-6.0/bin/jboss-cli.sh --connect --controller=127.0.0.1 --user=admin --password=P@ssw0rd --command="deploy $PACKAGETEMP/hello.war --server-groups=HelloWorld"'

echo "Check deployment status"
sshpass -p P@ssw0rd ssh root@127.0.0.1 '/opt/EAP-6.0.1/jboss-eap-6.0/bin/jboss-cli.sh --connect --controller=127.0.0.1 --user=admin --password=P@ssw0rd --command="deployment-info --name=hello.war"'
```

Add the shell script in source control, or share folder

For detailed JBOSS CLI commands, please [check this guide](https://access.redhat.com/documentation/en-US/JBoss_Enterprise_Application_Platform/6.1/html/Administration_and_Configuration_Guide/sect-The_Management_CLI.html#About_the_Management_Command_Line_Interface_CLI)

### Configure Team Foundation Server

Create new release definition add add the task [Shell script](https://www.visualstudio.com/en-us/docs/build/steps/utility/shell-script) and enter the path for shell script

Check the configuration bellow:

![Shell Script Configuration](images/jboss6/Configuration.png)

Running new release and check the log events

![Log Events](images/jboss6/ExecutionLog.png)


## Learn more
For detailed instructions on setting up a release definition, check out [this guide](https://www.visualstudio.com/en-us/docs/release/author-release-definition/more-release-definition).

Check out [this guide](https://www.visualstudio.com/en-us/docs/integrate/extensions/overview) for an overview of extensions of Visual Studio Team Services.

For detailed instructions on how to get and install extensions, check out [this guide](https://www.visualstudio.com/en-us/docs/marketplace/overview)
