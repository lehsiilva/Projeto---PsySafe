package com.psysafe.model;

public class RadarData {
    private String categoria;
    private Integer pontuacao;
    
    public RadarData(String categoria, Integer pontuacao) {
        this.categoria = categoria;
        this.pontuacao = pontuacao;
    }
    
    // Getters e Setters
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    
    public Integer getPontuacao() { return pontuacao; }
    public void setPontuacao(Integer pontuacao) { this.pontuacao = pontuacao; }
}