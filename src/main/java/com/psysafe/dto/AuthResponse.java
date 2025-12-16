package com.psysafe.dto;

public class AuthResponse {
    private String token;   // token gerado no login
    private UserDTO user;   // dados do usuário
    private String message; // mensagem de erro ou info

    // Construtor sucesso
    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
        this.message = null;
    }

    // Construtor mensagem
    public AuthResponse(String message) {
        this.message = message;
        this.token = null;
        this.user = null;
    }

    // Getters e setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
