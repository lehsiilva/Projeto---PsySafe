package com.psysafe.model;

import java.util.Map;
import java.util.List;

public class PersonalStats {
    private Integer minhasAvaliacoes;
    private Integer meuNivelRisco;
    private Integer minhaConformidade;
    private Integer minhasRespostasPendentes;
    private Map<String, Integer> tendenciaPessoal;
    private List<RespostaHistorico> minhasRespostas;
    
    // Getters e Setters
    public Integer getMinhasAvaliacoes() { return minhasAvaliacoes; }
    public void setMinhasAvaliacoes(Integer minhasAvaliacoes) { this.minhasAvaliacoes = minhasAvaliacoes; }
    
    public Integer getMeuNivelRisco() { return meuNivelRisco; }
    public void setMeuNivelRisco(Integer meuNivelRisco) { this.meuNivelRisco = meuNivelRisco; }
    
    public Integer getMinhaConformidade() { return minhaConformidade; }
    public void setMinhaConformidade(Integer minhaConformidade) { this.minhaConformidade = minhaConformidade; }
    
    public Integer getMinhasRespostasPendentes() { return minhasRespostasPendentes; }
    public void setMinhasRespostasPendentes(Integer minhasRespostasPendentes) { this.minhasRespostasPendentes = minhasRespostasPendentes; }
    
    public Map<String, Integer> getTendenciaPessoal() { return tendenciaPessoal; }
    public void setTendenciaPessoal(Map<String, Integer> tendenciaPessoal) { this.tendenciaPessoal = tendenciaPessoal; }
    
    public List<RespostaHistorico> getMinhasRespostas() { return minhasRespostas; }
    public void setMinhasRespostas(List<RespostaHistorico> minhasRespostas) { this.minhasRespostas = minhasRespostas; }
}