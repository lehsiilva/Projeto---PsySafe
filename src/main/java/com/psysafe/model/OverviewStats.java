package com.psysafe.model;

import java.util.Map;
import java.util.List;

public class OverviewStats {
    private Integer totalAvaliacoes;
    private Integer mediaRiscos;
    private Integer nivelConformidade;
    private Integer alertasAtivos;
    private Map<String, Integer> tendenciaMensal;
    private Map<String, Integer> distribuicaoRiscos;
    private List<DepartamentoStats> topDepartamentos;
    
    // Getters e Setters
    public Integer getTotalAvaliacoes() { return totalAvaliacoes; }
    public void setTotalAvaliacoes(Integer totalAvaliacoes) { this.totalAvaliacoes = totalAvaliacoes; }
    
    public Integer getMediaRiscos() { return mediaRiscos; }
    public void setMediaRiscos(Integer mediaRiscos) { this.mediaRiscos = mediaRiscos; }
    
    public Integer getNivelConformidade() { return nivelConformidade; }
    public void setNivelConformidade(Integer nivelConformidade) { this.nivelConformidade = nivelConformidade; }
    
    public Integer getAlertasAtivos() { return alertasAtivos; }
    public void setAlertasAtivos(Integer alertasAtivos) { this.alertasAtivos = alertasAtivos; }
    
    public Map<String, Integer> getTendenciaMensal() { return tendenciaMensal; }
    public void setTendenciaMensal(Map<String, Integer> tendenciaMensal) { this.tendenciaMensal = tendenciaMensal; }
    
    public Map<String, Integer> getDistribuicaoRiscos() { return distribuicaoRiscos; }
    public void setDistribuicaoRiscos(Map<String, Integer> distribuicaoRiscos) { this.distribuicaoRiscos = distribuicaoRiscos; }
    
    public List<DepartamentoStats> getTopDepartamentos() { return topDepartamentos; }
    public void setTopDepartamentos(List<DepartamentoStats> topDepartamentos) { this.topDepartamentos = topDepartamentos; }
}