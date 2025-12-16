package com.psysafe.model;

public class DepartamentoStats {
    private String nome;
    private Integer avaliacoes;
    private Integer mediaRisco;
    
    public DepartamentoStats(String nome, Integer avaliacoes, Integer mediaRisco) {
        this.nome = nome;
        this.avaliacoes = avaliacoes;
        this.mediaRisco = mediaRisco;
    }
    
    // Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public Integer getAvaliacoes() { return avaliacoes; }
    public void setAvaliacoes(Integer avaliacoes) { this.avaliacoes = avaliacoes; }
    
    public Integer getMediaRisco() { return mediaRisco; }
    public void setMediaRisco(Integer mediaRisco) { this.mediaRisco = mediaRisco; }
}