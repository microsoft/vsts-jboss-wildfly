// npm install mocha --save-dev
// typings install dt~mocha --save --global
// tests for jbossmanagementcli

import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'vsts-task-lib/mock-test';

describe('jbossmanagementcli L0 Suite', function () {
    before(() => {

    });

    after(() => {

    });

    it('runs jbossmanagementcli', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0runsJBossCli.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('java -cp test_full_path com.microsoft.alm.Driver -s https://example.test/v0.1 -u test_username -p test_password -c mock_command1'), 
            'it should have run jbossmanagementcli');
        assert(tr.invokedToolCount == 1, 'should have only run jbossmanagementcli');
        assert(tr.stdout.indexOf('bash output here') >= 0, "bash stdout");
        assert(tr.stderr.length == 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('check if commands parses correctly', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0checkcommands.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran(`java -cp test_full_path com.microsoft.alm.Driver -s https://example.test/v0.1 -u test_username -p test_password -c mock_command1 mock_command2 mock_command3`), 'it should have run jbossmanagementcli with correct arguments');
        assert(tr.invokedToolCount == 1, 'should have only run jbossmanagementcli');
        assert(tr.stdout.indexOf('bash output here') >= 0, "bash stdout");
        assert(tr.stderr.length == 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('check if jbossmanagementcli fails correctly', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0checkIfFailWork.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('java -cp test_full_path com.microsoft.alm.Driver -s https://example.test/v0.1 -u test_username -p test_password -c mock_command1'),
            'it should have run jbossmanagementcli but return failed result');
        assert(tr.invokedToolCount == 1, 'should have only run jbossmanagementcli');
        assert(tr.stdout.indexOf('bash output here') >= 0, "bash stdout");
        assert(tr.failed, 'task should have failed');

        done();
    });

    it('check if it fails without a username defined in service endpoint', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0checkUsername.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.failed, 'task should have failed');

        done();
    });

    it('check if it fails without a password defined in a service endpoint', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0checkPassword.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.failed, 'task should have failed');

        done();
    });

    it('check if jbossdeployer fails without a username defined', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0FailUsername.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.failed, 'task should have failed');

        done();
    });

    it('check if jbossdeployer fails without a password defined', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0FailPassword.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.failed, 'task should have failed');

        done();
    });

});
