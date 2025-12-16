package com.psysafe.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class AuthUser {
    private UUID id;
    private String name;
    private String email;
    private String passwordHash;
    private String role;
    private LocalDateTime createdAt;

    // Campos extras de user_profile
    private String departamento;
    private String equipe;
    private String cargo;
    private String telefone;
    private Integer idEmpresa;
    private LocalDateTime dataAdmissao;
    private LocalDateTime ultimoLogin;

    // Construtor completo
    public AuthUser(UUID id, String name, String email, String passwordHash, String role, LocalDateTime createdAt,
                    String departamento, String equipe, String cargo, String telefone, Integer idEmpresa,
                    LocalDateTime dataAdmissao, LocalDateTime ultimoLogin) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.createdAt = createdAt;
        this.departamento = departamento;
        this.equipe = equipe;
        this.cargo = cargo;
        this.telefone = telefone;
        this.idEmpresa = idEmpresa;
        this.dataAdmissao = dataAdmissao;
        this.ultimoLogin = ultimoLogin;
    }

    // Getters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getDepartamento() { return departamento; }
    public String getEquipe() { return equipe; }
    public String getCargo() { return cargo; }
    public String getTelefone() { return telefone; }
    public Integer getIdEmpresa() { return idEmpresa; }
    public LocalDateTime getDataAdmissao() { return dataAdmissao; }
    public LocalDateTime getUltimoLogin() { return ultimoLogin; }

    // Setters
    public void setDepartamento(String departamento) { this.departamento = departamento; }
    public void setEquipe(String equipe) { this.equipe = equipe; }
    public void setCargo(String cargo) { this.cargo = cargo; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public void setIdEmpresa(Integer idEmpresa) { this.idEmpresa = idEmpresa; }
    public void setDataAdmissao(LocalDateTime dataAdmissao) { this.dataAdmissao = dataAdmissao; }
    public void setUltimoLogin(LocalDateTime ultimoLogin) { this.ultimoLogin = ultimoLogin; }
    public void setName(String name) {	
		this.name = name;
		
	}
    // Método utilitário
    public String getCreatedAtString() {
        return createdAt != null ? createdAt.toString() : "";
    }

	
}
