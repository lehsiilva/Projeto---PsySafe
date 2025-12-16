package com.psysafe.response;

import com.psysafe.model.Usuario;

public class LoginResponse {

    private String token;
    private String nome;
    private String role;
    private String email;
    private String telefone;
    private String empresa;
    private String departamento;
    private String dataAdmissao;

    public LoginResponse() {}

    public LoginResponse(String token, Usuario u) {
        this.token = token;
        this.nome = u.getNome();
        this.role = u.getRole();
        this.email = u.getEmail();
        this.telefone = u.getTelefone();
        this.empresa = u.getEmpresa();
        this.departamento = u.getDepartamento();
        this.dataAdmissao = u.getDataAdmissao() != null ? u.getDataAdmissao().toString() : null;
    }

    public String getToken() { return token; }
    public String getNome() { return nome; }
    public String getRole() { return role; }
    public String getEmail() { return email; }
    public String getTelefone() { return telefone; }
    public String getEmpresa() { return empresa; }
    public String getDepartamento() { return departamento; }
    public String getDataAdmissao() { return dataAdmissao; }
}
