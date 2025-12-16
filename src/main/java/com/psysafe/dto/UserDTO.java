package com.psysafe.dto;

import java.time.LocalDate;

public class UserDTO {
    private int id;
    private String nome;
    private String email;
    private String telefone;
    private String empresa;
    private String departamento;
    private LocalDate dataAdmissao;
    private String role;

    public UserDTO() {}

    public UserDTO(int id, String nome, String email, String telefone,
                   String empresa, String departamento, LocalDate dataAdmissao, String role) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.empresa = empresa;
        this.departamento = departamento;
        this.dataAdmissao = dataAdmissao;
        this.role = role;
    }

    // Getters e setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getEmpresa() { return empresa; }
    public void setEmpresa(String empresa) { this.empresa = empresa; }

    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }

    public LocalDate getDataAdmissao() { return dataAdmissao; }
    public void setDataAdmissao(LocalDate dataAdmissao) { this.dataAdmissao = dataAdmissao; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
