package com.psysafe.model;

import java.time.LocalDate;

public class Denuncia {
    private int id;
    private String titulo;
    private String descricao;
    private String tipo;
    private LocalDate data;
    private boolean resolvido;
    private boolean anonima;
    private String denunciante;
    private String denunciado;
    private Integer idEmpresa;

    // GETTERS E SETTERS
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public boolean isResolvido() { return resolvido; }
    public void setResolvido(boolean resolvido) { this.resolvido = resolvido; }
    public boolean isAnonima() { return anonima; }
    public void setAnonima(boolean anonima) { this.anonima = anonima; }
    public String getDenunciante() { return denunciante; }
    public void setDenunciante(String denunciante) { this.denunciante = denunciante; }
    public String getDenunciado() { return denunciado; }
    public void setDenunciado(String denunciado) { this.denunciado = denunciado; }

public Integer getIdEmpresa() { return idEmpresa; }
public void setIdEmpresa(Integer idEmpresa) { this.idEmpresa = idEmpresa; }
}

