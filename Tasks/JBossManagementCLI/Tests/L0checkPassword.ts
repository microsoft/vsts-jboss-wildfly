import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fs = require('fs');

let taskPath = path.join(__dirname, '..', 'jbossmanagementcli.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

process.env["ENDPOINT_URL_mock_jbossEndpoint"] = "https://example.test/v0.1";
process.env["ENDPOINT_AUTH_PARAMETER_mock_jbossEndpoint_USERNAME"] = "test_username";
//process.env["ENDPOINT_AUTH_PARAMETER_mock_jbossEndpoint_PASSWORD"] = "test_password";

tmr.setInput('jbossEndpoint', 'mock_jbossEndpoint');
tmr.setInput('commands', 'mock_command1');

tmr.run();