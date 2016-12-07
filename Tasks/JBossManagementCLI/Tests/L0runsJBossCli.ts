import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fs = require('fs');

let taskPath = path.join(__dirname, '..', 'jbossmanagementcli.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

process.env["ENDPOINT_URL_mock_jbossEndpoint"] = "https://example.test/v0.1";
process.env["ENDPOINT_AUTH_PARAMETER_mock_jbossEndpoint_USERNAME"] = "test_username";
process.env["ENDPOINT_AUTH_PARAMETER_mock_jbossEndpoint_PASSWORD"] = "test_password";

tmr.setInput('jbossEndpoint', 'mock_jbossEndpoint');
tmr.setInput('commands', 'mock_command1');

fs.readdirSync = (s) => {
    return ["test_file"];
};
tmr.registerMock('fs', fs);

path.join = (s, x, y) => {
    return "test_full_path";
};
tmr.registerMock('path', path);

let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "exec": {
        // It provides the output of exec with certain parameters, the program performs mock run instead of real running
        "java -cp test_full_path com.microsoft.alm.Driver -s https://example.test/v0.1 -u test_username -p test_password -c mock_command1": {
            "code": 0,
            "stdout": "bash output here",
            "stderr": ""
        }
    },
};
tmr.setAnswers(a);

tmr.run();

