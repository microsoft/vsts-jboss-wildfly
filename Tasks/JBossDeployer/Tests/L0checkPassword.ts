import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fs = require('fs');

let taskPath = path.join(__dirname, '..', 'jbossdeployer.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

process.env["ENDPOINT_URL_mock_jbossEndpoint"] = "https://example.test/v0.1";
process.env["ENDPOINT_AUTH_PARAMETER_mock_jbossEndpoint_USERNAME"] = "test_username";
// process.env["ENDPOINT_AUTH_PARAMETER_mock_jbossEndpoint_PASSWORD"] = "test_password";

tmr.setInput('jbossEndpoint', 'mock_jbossEndpoint');
tmr.setInput('file', 'mock_file');
tmr.setInput('force', 'true');
tmr.setInput('disabled', 'true');
tmr.setInput('name', 'mock_name');
tmr.setInput('runtimeName', 'mock_runtimeName');
tmr.setInput('serverMode', 'domain');
tmr.setInput('options', 'mock_options');
tmr.setInput('undeploy', 'false');
tmr.setInput('serverGroups', 'all_server_groups');

tmr.run();