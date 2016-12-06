package com.microsoft.alm;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.ParseException;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.net.URI;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class DriverTest {

    @Test
    public void noServerShouldConnectToDefault() throws Exception {
        final String args[] = new String[]{
                "-u", "user", "-p", "password"
        };

        final CommandLine line = Driver.parseOptions(args);
        final URI parsedServer = Driver.getServerOptions(line);

        assertEquals("localhost", parsedServer.getHost().toLowerCase());
        assertEquals(9990, parsedServer.getPort());
    }


    @Test
    public void parseServerOptionNoPort() throws ParseException {
        final String args[] = new String[]{
                "-s", "https://example.test"
        };

        final CommandLine line = Driver.parseOptions(args);
        final URI parsedServer = Driver.getServerOptions(line);

        assertEquals("example.test", parsedServer.getHost().toLowerCase());
        assertEquals(-1, parsedServer.getPort());
    }

    @Test
    public void parseServerOptionLongName() throws ParseException {
        final String args[] = new String[]{
                "-server", "https://example.test:1234"
        };

        final CommandLine line = Driver.parseOptions(args);
        final URI parsedServer = Driver.getServerOptions(line);

        assertEquals("example.test", parsedServer.getHost().toLowerCase());
        assertEquals(1234, parsedServer.getPort());
    }

    @Test(expected = ParseException.class)
    public void parseServerOptionNoArgument() throws ParseException {
        final String args[] = new String[]{
                "-server"
        };

        final CommandLine line = Driver.parseOptions(args);
        Driver.getServerOptions(line);
    }

    @Test(expected = RuntimeException.class)
    public void noCredsWillThrowAsCredsAreRequired() throws ParseException {
        final String args[] = new String[]{
                "-server", "https://example.test:1234"
        };

        final CommandLine line = Driver.parseOptions(args);
        Driver.getCredsOptions(line);
    }

    @Test(expected = RuntimeException.class)
    public void noPasswordWillThrowAsCredsAreRequired() throws ParseException {
        final String args[] = new String[]{
                "-u", "nopassword"
        };

        final CommandLine line = Driver.parseOptions(args);
        Driver.getCredsOptions(line);
    }

    @Test(expected = RuntimeException.class)
    public void noUsernameWillThrowAsCredsAreRequired() throws ParseException {
        final String args[] = new String[]{
                "-p", "nousername"
        };

        final CommandLine line = Driver.parseOptions(args);
        Driver.getCredsOptions(line);
    }

    @Test
    public void parseCreds() throws ParseException {
        final String args[] = new String[]{
                "-password", "mypassword", "-u", "myusername"
        };

        final CommandLine line = Driver.parseOptions(args);
        final Credentials parsedCreds = Driver.getCredsOptions(line);

        assertEquals("myusername", parsedCreds.getUsername());
        for (int i=0; i < parsedCreds.getPassword().length; ++i) {
            assertEquals("mypassword".toCharArray()[i], parsedCreds.getPassword()[i]);
        }
    }

    @Test
    public void parseNoCommands() throws ParseException {
        final String args[] = new String[]{};

        final CommandLine line = Driver.parseOptions(args);
        final List<String> cmds = Driver.getCmdsOptions(line);

        assertEquals(0, cmds.size());
    }

    @Test
    public void parseSingleCommand() throws ParseException {
        final String args[] = new String[]{
                "-c", "\t\tdeploy example.war    "
        };

        final CommandLine line = Driver.parseOptions(args);
        final List<String> cmds = Driver.getCmdsOptions(line);

        assertEquals(1, cmds.size());
        assertEquals("deploy example.war", cmds.get(0));
    }

    @Test
    public void parseSingleCommandWithPipe() throws ParseException {
        final String args[] = new String[]{
                "-c", "\t\tdeploy example.war   "
        };

        final CommandLine line = Driver.parseOptions(args);
        final List<String> cmds = Driver.getCmdsOptions(line);

        assertEquals(1, cmds.size());
        assertEquals("deploy example.war", cmds.get(0));
    }

    @Test
    public void parseMultipleCommands() throws ParseException {
        final String args[] = new String[]{
                "-c", "\t\tdeploy example.war   ", " ls -l"
        };

        final CommandLine line = Driver.parseOptions(args);
        final List<String> cmds = Driver.getCmdsOptions(line);

        assertEquals(2, cmds.size());
        assertEquals("deploy example.war", cmds.get(0));
        assertEquals("ls -l", cmds.get(1));
    }
}