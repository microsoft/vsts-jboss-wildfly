import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');
import fs = require('fs');
import path = require('path');
import os = require('os');

interface Credential {
    serverUrl: string,
    username: string,
    password: string
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

function getClassPath(): string {
    var libPath = path.join(__dirname, "lib");

    var files = fs.readdirSync(libPath);

    return files.map(f => path.join(__dirname, 'lib', f))
                .join(path.delimiter); 
}

async function run() {
    try {
        tl.setResourcePath(path.join( __dirname, 'task.json'));

        let creds = getCredentials();

        let commands: string[] = tl.getDelimitedInput('commands', '\n', true);

        let javaToolRunner: trm.ToolRunner = tl.tool('java');

        let classPath = getClassPath();
        javaToolRunner.arg(['-cp', classPath, 'com.microsoft.alm.Driver']);

        // Add server information
        javaToolRunner.arg(['-s', creds.serverUrl]);

        // Credential
        javaToolRunner.arg(['-u', creds.username, '-p', creds.password]);

        // Commands
        tl.debug('Running:');
        for (let cmd in commands) {
            tl.debug(commands[cmd]);
        }
        javaToolRunner.arg('-c');

        // Run all input line by line
        javaToolRunner.arg(commands);

        var code = await javaToolRunner.exec();
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
