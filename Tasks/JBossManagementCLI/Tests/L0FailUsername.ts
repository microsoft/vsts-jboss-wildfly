import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fs = require('fs');

let taskPath = path.join(__dirname, '..', 'jbossmanagementcli.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('credsType', 'inputs');
tmr.setInput('jbossServerUrl', 'http://jboss.test:9090/testurl');
tmr.setInput('jbossPassword', 'password');
tmr.setInput('commands', 'mock_command1');

tmr.run();
