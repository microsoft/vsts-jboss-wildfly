import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');
import fs = require('fs');
import path = require('path');
import os = require('os');

let isWindows = os.type().match(/^Win/);

interface Credential {
    serverUrl: string,
    username: string,
    password: string
}

function getClassPath(): string {
    var libPath = path.join(__dirname, "lib");

    var files = fs.readdirSync(libPath);

    return files.map(f => path.join(__dirname, 'lib', f))
                .join(path.delimiter); 
}

function getDeployFile(pattern: string): string {
    if (pattern.indexOf("*") === -1 && pattern.indexOf("?") === -1) {
        // Use the specified single file
        return pattern;
    }

    let firstWildcardIndex = function (str) {
        let idx = str.indexOf("*");

        let idxOfWildcard = str.indexOf("?");
        if (idxOfWildcard > -1) {
            return (idx > -1) ?
                Math.min(idx, idxOfWildcard) : idxOfWildcard;
        }

        return idx;
    };

    // Find files matching the specified pattern
    tl.debug("Matching glob pattern: " + pattern);

    // First find the most complete path without any matching patterns
    let idx = firstWildcardIndex(pattern);
    tl.debug("Index of first wildcard: " + idx);

    let findPathRoot = path.dirname(pattern.slice(0, idx));

    tl.debug("find root dir: " + findPathRoot);

    // Now we get a list of all files under this root
    let allFiles = tl.find(findPathRoot);

    // Now matching the pattern against all files
    let filesList: string[] = tl.match(allFiles, pattern, { matchBase: true });

    if (filesList) {
        if (filesList.length > 1) {
            throw new Error(tl.loc("FilePatternMatchedMoreThanOneFile"));
        } else if (filesList.length < 1) {
            throw new Error(tl.loc("DidNotFindAnyFileFromPatther"));
        }

        return filesList[0];
    }

    throw new Error(tl.loc("DidNotFindAnyFileFromPatther"));
}

function getCLIRunner(serverUrl, username, password) {
    let cliRunner: trm.ToolRunner = tl.tool('java');
    let classPath = getClassPath();
    cliRunner.arg(['-cp', classPath, 'com.microsoft.alm.Driver']);

    // Add server information
    cliRunner.arg(['-s', serverUrl]);

    // Credential
    cliRunner.arg(['-u', username, '-p', password]);

    return cliRunner;
}

/**
 * Check the existence of this application against the server.  
 */
function checkExists(server: string, username: string, password:string, name:string): boolean{
    tl.debug(tl.loc("CheckForAppExistence", name));
    let cliRunner = getCLIRunner(server, username, password);

    // Disable java logging so we can parse the output.
    // (no need to parse the output anymore after we supplied the name parameter.  If it exists we get rc 0, otherwise the CLI throws an exception)
    cliRunner.arg('-d')

    cliRunner.arg(['-c', `deployment-info --name=${name}`]);

    let result = cliRunner.execSync();

    return result && result.code === 0;
}

function argumentCmdWithDomainGroups(serverMode: string, deploy: boolean, currCmd: string): string {
    if (serverMode === "domain") {
        let groupNames = tl.getInput("serverGroups", false);
        if (groupNames === "all_server_groups") {
            if (deploy) {
                currCmd += ' --all-server-groups';
            } else {
                currCmd += ' --all-relevant-server-groups';
            }
        } else if (groupNames === "list_groups") {
            let listedGroups = tl.getInput("listedGroups", false);
            listedGroups = listedGroups.split(',').map(s => s.trim()).join(',');
            currCmd += ` --server-groups=${listedGroups}`
        }
    }

    return currCmd;
}

function getCredentials() : Credential {
    let credsType = tl.getInput('credsType', true);
    let endpointUrl;
    let username;
    let password;

    if (credsType === 'serviceEndpoint') {
        let endpoint = tl.getInput('jbossEndpoint', true);
        if (!endpoint) {
            throw new Error(tl.loc("EndpointNotFound"));
        }

        endpointUrl = tl.getEndpointUrl(endpoint, false);
        if (!endpointUrl) {
            throw new Error(tl.loc('EndpointDoesNotDefineURL'));
        }

        let endpointAuth = tl.getEndpointAuthorization(endpoint, true);
        username = tl.getEndpointAuthorizationParameter(endpoint, 'username', true);
        password = tl.getEndpointAuthorizationParameter(endpoint, 'password', true);
    } else if ( credsType === 'inputs') {
        endpointUrl = tl.getInput('jbossServerUrl', true);
        username = tl.getInput('jbossManagementUser', true);
        password = tl.getInput('jbossPassword', true);
    }

    return { 
        serverUrl: endpointUrl, 
        username: username,
        password: password
    };
}

async function run() {
    try {
        tl.setResourcePath(path.join(__dirname, 'task.json'));
        
        let creds = getCredentials();

        let cliRunner = getCLIRunner(creds.serverUrl, creds.username, creds.password);

        cliRunner.arg('-c');

        // Build up deploy command
        let filePattern = tl.getPathInput("file", true, false);
        let file = getDeployFile(filePattern);
        let deployCmd = `deploy ${file}`;

        let force = tl.getBoolInput("force", false);
        if (force) {
            deployCmd += " --force";
        }

        let disabled = tl.getBoolInput("disabled", false);
        if (disabled) {
            deployCmd += " --disabled";
        }

        let name = tl.getInput("name", false);
        if (name) {
            deployCmd += ` --name=${name}`;
        }

        let runtimeName = tl.getInput("runtimeName", false);
        if (runtimeName) {
            deployCmd += ` --runtime-name=${runtimeName}`;
        }

        let serverMode = tl.getInput("serverMode", true);
        deployCmd = argumentCmdWithDomainGroups(serverMode, true, deployCmd);

        let options = tl.getInput("options", false);
        if (options) {
            deployCmd += ` ${options}` 
        } 

        // Undeploy first if necessary
        let undeployApp: boolean = tl.getBoolInput('undeploy', false);
        if (undeployApp) {
            let appName = name ? name : path.basename(file); // if name is not specified, the file basename is used
            let exists = checkExists(creds.serverUrl, creds.username, creds.password, appName);    
            
            if (exists) {
                let undeployCmd = `undeploy --name=${appName}`;
                undeployCmd = argumentCmdWithDomainGroups(serverMode, false, undeployCmd);

                // Run the undeploy command first
                cliRunner.arg(undeployCmd);
            }
        }

        // Run the deploy command
        cliRunner.arg(deployCmd);

        var code = await cliRunner.exec();
        if (code === 0) {
            tl.setResult(tl.TaskResult.Succeeded, tl.loc("Success"));
        } else {
            tl.setResult(tl.TaskResult.Failed, tl.loc("Failure"));
        }
    }
    catch(err) {
        tl.error(err.message);
        tl.setResult(tl.TaskResult.Failed, err.message);
    }    
}

run();
