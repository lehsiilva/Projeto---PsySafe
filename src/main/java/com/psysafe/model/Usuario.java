package com.psysafe.model;

import java.time.LocalDate;

public class Usuario {

    private Integer id;
    private String nome;
    private String email;
    private String senha;
    private String role;
    private String telefone;
    private String empresa;
    private String departamento;
    private LocalDate dataAdmissao;

    public Usuario() {}

    public Usuario(Integer id, String nome, String email, String senha, String role,
                   String telefone, String empresa, String departamento, LocalDate dataAdmissao) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.role = role;
        this.telefone = telefone;
        this.empresa = empresa;
        this.departamento = departamento;
        this.dataAdmissao = dataAdmissao;
    }

    // Getters e Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getEmpresa() { return empresa; }
    public void setEmpresa(String empresa) { this.empresa = empresa; }
    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }
    public LocalDate getDataAdmissao() { return dataAdmissao; }
    public void setDataAdmissao(LocalDate dataAdmissao) { this.dataAdmissao = dataAdmissao; }
}
