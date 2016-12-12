# Deploy applications to JBoss EAP 6

To deploy WAR and EAR file to JBoss Enterprise Application Platform (EAP) 6 you need create the SSH script to run JBOSS Command Line Interface (CLI)

### Prereqs
  1. JBOSS 6 EAP installed and configured
  2. Linux machine with cross platform build agent for Team Foundation Server. For detailed instructions [check this guide](https://github.com/Microsoft/vsts-agent/blob/master/docs/start/envubuntu.md)
  2. SSH and SSH Pass configured

### Example SSH Script
The example bellow using SSH connection to connect in target machine and execute the JBOSS CLI commands line.

  1. Create temp directory
  2. Copy files (Artifact) to temp directory
  3. Running `jboss-cli.sh` to undeploy old version
  4. Running `jboss-cli.sh` to deploy new version of WAR file
  5. Runnig `jboss-cli.sh` for check deployment status

```
!/bin/bash
echo "Deploy jboss-cli"

PACKAGETEMP=/tmp/package

echo "Creating temp dir"
sshpass -p P@ssw0rd ssh root@10.116.83.195 'mkdir -v $PACKAGETEMP'

echo "Copy files to target server"
sshpass -p P@ssw0rd scp -r -v $AGENT_RELEASEDIRECTORY/JavaBuild/Drop root@10.116.83.195:$PACKAGETEMP/hello.war

echo "Running undeploy command"
sshpass -p P@ssw0rd ssh root@10.116.83.195 '/opt/EAP-6.0.1/jboss-eap-6.0/bin/jboss-cli.sh --connect --controller=10.116.83.195 --user=admin --password=P@ssw0rd --command="undeploy hello.war --server-groups=HelloWorld"'

echo "Running deploy command"
sshpass -p P@ssw0rd ssh root@10.116.83.195 '/opt/EAP-6.0.1/jboss-eap-6.0/bin/jboss-cli.sh --connect --controller=10.116.83.195 --user=admin --password=P@ssw0rd --command="deploy /home/jboss/package/hello.war --server-groups=HelloWorld"'

echo "Check deployment status"
sshpass -p P@ssw0rd ssh root@10.116.83.195 '/opt/EAP-6.0.1/jboss-eap-6.0/bin/jboss-cli.sh --connect --controller=10.116.83.195 --user=admin --password=P@ssw0rd --command="deployment-info --name=hello.war"'
```

For detailed JBOSS CLI commands, please [check this guide](https://access.redhat.com/documentation/en-US/JBoss_Enterprise_Application_Platform/6.1/html/Administration_and_Configuration_Guide/sect-The_Management_CLI.html#About_the_Management_Command_Line_Interface_CLI)

### Configure Team Foundation Server

