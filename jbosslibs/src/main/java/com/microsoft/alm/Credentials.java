package com.microsoft.alm;

public class Credentials {

    final String username;
    final char[] password;

    public Credentials(String username, char[] password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public char[] getPassword() {
        return password;
    }
}
