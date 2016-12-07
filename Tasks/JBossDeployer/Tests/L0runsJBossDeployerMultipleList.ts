import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fs = require('fs');

let taskPath = path.join(__dirname, '..', 'jbossdeployer.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

process.env["ENDPOINT_URL_mock_jbossEndpoint"] = "https://example.test/v0.1";
process.env["ENDPOINT_AUTH_PARAMETER_mock_jbossEndpoint_USERNAME"] = "test_username";
process.env["ENDPOINT_AUTH_PARAMETER_mock_jbossEndpoint_PASSWORD"] = "test_password";

tmr.setInput('jbossEndpoint', 'mock_jbossEndpoint');
tmr.setInput('file', 'mock_file');
tmr.setInput('force', 'true');
tmr.setInput('disabled', 'true');
tmr.setInput('name', 'mock_name');
tmr.setInput('runtimeName', 'mock_runtimeName');
tmr.setInput('serverMode', 'domain');
tmr.setInput('options', 'mock_options');
tmr.setInput('undeploy', 'false');
tmr.setInput('serverGroups', 'list_groups');
tmr.setInput('listedGroups', 'mock_list_group1,mock_list_group2,mock_list_group3');

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
        "java -cp test_full_path com.microsoft.alm.Driver -s https://example.test/v0.1 -u test_username -p test_password -c deploy mock_file --force --disabled --name=mock_name --runtime-name=mock_runtimeName --server-groups=mock_list_group1,mock_list_group2,mock_list_group3 mock_options": {
            "code": 0,
            "stdout": "bash output here",
            "stderr": ""
        }
    },
};
tmr.setAnswers(a);

tmr.run();

