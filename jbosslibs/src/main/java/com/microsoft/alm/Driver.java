package com.microsoft.alm;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.jboss.as.cli.scriptsupport.CLI;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.LogManager;
import java.util.logging.Logger;

/**
 * Driver for this class
 */
public class Driver {
    private static final Logger logger = Logger.getLogger(Driver.class.getName());

    private static final URI LOCAL_HOST = URI.create("http://localhost:9990");
    private CLI cli;

    private final URI server;
    private final Credentials credentials;
    private final List<String> cmds;

    Driver(final URI uri, final Credentials credentials, final List<String> cmds) {
        this.server = uri;
        this.credentials = credentials;
        this.cmds = cmds;

        this.cli = CLI.newInstance();
    }

    private void connect() {
        assert(this.server != null);
        assert(this.credentials != null);

        final String hostname = this.server.getHost();
        int port = this.server.getPort();

        if (port < 0) {
            logger.info("Port not specified, default to 9990");
            port = 9990;
        }

        cli.connect(hostname, port, this.credentials.username, this.credentials.getPassword());
    }

    /**
     * Run all commands
     */
    private void run() {
        logger.info("Attempt to connect to " + this.server.getAuthority());
        this.connect();

        logger.info("Successfully connected.");
        for (String cmd : this.cmds) {
            logger.info("Running: " + cmd);
            final CLI.Result result = cli.cmd(cmd);

            final String response = (result.getResponse() != null) ? result.getResponse().toJSONString(false) : "";
            if (!result.isSuccess()) {
                throw new RuntimeException(response);
            } else {
                System.out.println(response);
            }
        }

        logger.info("Disconnecting from "+this.server.getAuthority());
        cli.disconnect();
    }

    static URI getServerOptions(final CommandLine line) {
        final URI server;
        if (line.hasOption("s")) {
            server = URI.create(line.getOptionValue("s"));
        } else {
            server = LOCAL_HOST;
        }

        return server;
    }

    static Credentials getCredsOptions(final CommandLine line) {
        if (line.hasOption("u") && line.hasOption("p")) {
            final String username = line.getOptionValue("u");
            final String pw = line.getOptionValue("p");
            final char[] password = (pw != null) ? pw.toCharArray() : null;

            return new Credentials(username, password);
        }

        throw new RuntimeException("No credentials specified.");
    }

    static List<String> getCmdsOptions(final CommandLine line) {
        if (line.hasOption("c")) {
            final String[] commands = line.getOptionValues("c");
            if (commands != null && commands.length > 0) {
                final List<String> cmds = new ArrayList<String>();
                for (final String cmd : commands) {
                    if (cmd != null && !cmd.trim().isEmpty()) {
                        cmds.add(cmd.trim());
                    }
                }

                return cmds;
            }
        }

        return Collections.<String>emptyList();
    }

    static CommandLine parseOptions(final String args[]) throws ParseException {
        final Options options = new Options();

        options.addOption("s", "server", true, "JBoss controller, default to http://localhost:9990.");
        options.addOption("u", "user", true, "Username for this connection");
        options.addOption("p", "password", true, "Password for this connection");
        options.addOption("d", "disable-logging", false, "Disable any logging to enable scripts parsing output.");

        final Option commands = new Option("c", "Commands to run");
        commands.setArgs(Option.UNLIMITED_VALUES);
        options.addOption(commands);

        final CommandLineParser parser = new DefaultParser();
        return parser.parse(options, args);
    }

    public static void main(final String[] args) throws ParseException {
        final CommandLine line = parseOptions(args);

        if (line.hasOption("d")) {
            // Disabling logging
            LogManager.getLogManager().reset();
        }

        final URI server = getServerOptions(line);
        logger.info("server: " + server.getAuthority());
        final Credentials credentials = getCredsOptions(line);
        logger.info("Connecting as user: " + credentials.getUsername());
        final List<String> cmds = getCmdsOptions(line);

        final Driver driver = new Driver(server, credentials, cmds);

        driver.run();
    }

}
