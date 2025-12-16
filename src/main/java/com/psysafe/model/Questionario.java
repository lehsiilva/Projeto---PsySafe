package com.psysafe.model;

import java.sql.Timestamp;

public class Questionario {
    private Integer idQuestionario;
    private String titulo;
    private String descricao;
    private Boolean ativo;
    private String versao;
    private String tempoEstimado;
    private Timestamp dataCriacao;

    // Construtor vazio
    public Questionario() {
    }

    // Construtor completo
    public Questionario(Integer idQuestionario, String titulo, String descricao, Boolean ativo, 
                       String versao, String tempoEstimado, Timestamp dataCriacao) {
        this.idQuestionario = idQuestionario;
        this.titulo = titulo;
        this.descricao = descricao;
        this.ativo = ativo;
        this.versao = versao;
        this.tempoEstimado = tempoEstimado;
        this.dataCriacao = dataCriacao;
    }

    // Construtor sem ID (para criação)
    public Questionario(String titulo, String descricao, Boolean ativo, String versao, String tempoEstimado) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.ativo = ativo;
        this.versao = versao;
        this.tempoEstimado = tempoEstimado;
    }

    // Getters e Setters
    public Integer getIdQuestionario() {
        return idQuestionario;
    }

    public void setIdQuestionario(Integer idQuestionario) {
        this.idQuestionario = idQuestionario;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public String getVersao() {
        return versao;
    }

    public void setVersao(String versao) {
        this.versao = versao;
    }

    public String getTempoEstimado() {
        return tempoEstimado;
    }

    public void setTempoEstimado(String tempoEstimado) {
        this.tempoEstimado = tempoEstimado;
    }

    public Timestamp getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(Timestamp dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    // toString para debug
    @Override
    public String toString() {
        return "Questionario{" +
                "idQuestionario=" + idQuestionario +
                ", titulo='" + titulo + '\'' +
                ", descricao='" + descricao + '\'' +
                ", ativo=" + ativo +
                ", versao='" + versao + '\'' +
                ", tempoEstimado='" + tempoEstimado + '\'' +
                ", dataCriacao=" + dataCriacao +
                '}';
    }

    // equals e hashCode (importante para comparações)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Questionario that = (Questionario) o;

        return idQuestionario != null ? idQuestionario.equals(that.idQuestionario) : that.idQuestionario == null;
    }

    @Override
    public int hashCode() {
        return idQuestionario != null ? idQuestionario.hashCode() : 0;
    }
}