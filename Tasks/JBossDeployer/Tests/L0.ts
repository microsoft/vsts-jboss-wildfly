// npm install mocha --save-dev
// typings install dt~mocha --save --global
// tests for jbossdeployer

import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'vsts-task-lib/mock-test';

describe('jbossdeployer L0 Suite', function () {
    before(() => {

    });

    after(() => {

    });

    it('runs jbossdeployer with all server groups', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0runsJBossDeployerServer.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran("java -cp test_full_path com.microsoft.alm.Driver -s https://example.test/v0.1 -u test_username -p test_password -c deploy mock_file --force --disabled --name=mock_name --runtime-name=mock_runtimeName --all-server-groups mock_options"), 
            'it should have run jbossdeployer with all server groups');
        assert(tr.invokedToolCount == 1, 'should have only run jbossdeployer');
        assert(tr.stdout.indexOf('bash output here') >= 0, "bash stdout");
        assert(tr.stderr.length == 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('runs jbossdeployer with list groups', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0runsJBossDeployerList.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('java -cp test_full_path com.microsoft.alm.Driver -s https://example.test/v0.1 -u test_username -p test_password -c deploy mock_file --force --disabled --name=mock_name --runtime-name=mock_runtimeName --server-groups=mock_list_groups mock_options'), 
            'it should have run jbossdeployer with list groups');
        assert(tr.invokedToolCount == 1, 'should have only run jbossdeployer');
        assert(tr.stdout.indexOf('bash output here') >= 0, "bash stdout");
        assert(tr.stderr.length == 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('check if jbossdeployer fails correctly', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0checkIfFailWork.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('java -cp test_full_path com.microsoft.alm.Driver -s https://example.test/v0.1 -u test_username -p test_password -c deploy mock_file --force --disabled --name=mock_name --runtime-name=mock_runtimeName --all-server-groups mock_options'), 
            'it should have run jbossdeployer but return failed result');
        assert(tr.invokedToolCount == 1, 'should have only run jbossdeployer');
        assert(tr.stdout.indexOf('bash output here') >= 0, "bash stdout");
        assert(tr.failed, 'task should have failed');

        done();
    });

    it('check if jbossdeployer fails without an username', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0checkUsername.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.failed, 'task should have failed');

        done();
    });

    it('check if jbossdeployer fails without a password', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0checkPassword.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.failed, 'task should have failed');

        done();
    });

});
