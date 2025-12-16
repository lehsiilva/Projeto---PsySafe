package com.psysafe.model;

import java.util.Map;

public class AlertContext {
    private String alertId;
    private String titulo;
    private String descricao;
    private String departamento;
    private String nivel;
    private int mediaRisco;
    private int totalAvaliacoes;
    private Map<String, Integer> distribuicaoCategorias;
    private String tendenciaRecente;
    
    // Getters e Setters
    public String getAlertId() { return alertId; }
    public void setAlertId(String alertId) { this.alertId = alertId; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }
    
    public String getNivel() { return nivel; }
    public void setNivel(String nivel) { this.nivel = nivel; }
    
    public int getMediaRisco() { return mediaRisco; }
    public void setMediaRisco(int mediaRisco) { this.mediaRisco = mediaRisco; }
    
    public int getTotalAvaliacoes() { return totalAvaliacoes; }
    public void setTotalAvaliacoes(int totalAvaliacoes) { this.totalAvaliacoes = totalAvaliacoes; }
    
    public Map<String, Integer> getDistribuicaoCategorias() { return distribuicaoCategorias; }
    public void setDistribuicaoCategorias(Map<String, Integer> distribuicaoCategorias) { 
        this.distribuicaoCategorias = distribuicaoCategorias; 
    }
    
    public String getTendenciaRecente() { return tendenciaRecente; }
    public void setTendenciaRecente(String tendenciaRecente) { this.tendenciaRecente = tendenciaRecente; }
}