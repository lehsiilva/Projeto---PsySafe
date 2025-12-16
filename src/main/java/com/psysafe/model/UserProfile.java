package com.psysafe.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class UserProfile {
    private UUID id;
    private String name;
    private String email;
    private String role;
    private String departamento;
    private String equipe;
    private String cargo;
    private String telefone;
    private Integer idEmpresa;
    private LocalDate dataAdmissao;
    private LocalDateTime ultimoLogin;
    private LocalDateTime createdAt;

    public UserProfile() {}

    public void setID(UUID id) {
    	this.id = id;
    }
    public UUID getId() {
    	return id;
    }
    
    public void setName(String name) { 
    	this.name = name; 
    }
    public String getName() { 
    	return name; 
    }
    
    public void setEmail(String email) { 
    	this.email = email; 
    }
    public String getEmail() { 
    	return email; 
    }
    
    public void setRole(String role) { 
    	this.role = role; 
    }
    public String getRole() { 
    	return role; 
    }
    
    public void setDepartamento(String departamento) { 
    	this.departamento = departamento; 
    }
    public String getDepartamento() { 
    	return departamento; 
    }
    
    public void setEquipe(String equipe) { 
    	this.equipe = equipe; 
    }
    public String getEquipe() { 
    	return equipe; 
    }
    
    public void setCargo(String cargo) { 
    	this.cargo = cargo; 
    }
    public String getCargo() { 
    	return cargo; 
    }
    
    public void setTelefone(String telefone) { 
    	this.telefone = telefone; 
    }
    public String getTelefone() { 
    	return telefone; 
    }
    
    public void setIdEmpresa(Integer idEmpresa) { 
    	this.idEmpresa = idEmpresa; 
    }
    public Integer getIdEmpresa() { 
    	return idEmpresa; 
    }
    
    public void setDataAdmissao(LocalDate dataAdmissao) { 
    	this.dataAdmissao = dataAdmissao; 
    }
    public LocalDate getDataAdmissao() { 
    	return dataAdmissao; 
    }
    
    
    public void setUltimoLogin(LocalDateTime ultimoLogin) { 
    	this.ultimoLogin = ultimoLogin; 
    }
    public LocalDateTime getUltimoLogin() { 
    	return ultimoLogin; 
    }
    
    public void setCreatedAt(LocalDateTime createdAt) { 
    	this.createdAt = createdAt;
    }
    public LocalDateTime getCreatedAt() { 
    	return createdAt; 
    }
    
    
}
