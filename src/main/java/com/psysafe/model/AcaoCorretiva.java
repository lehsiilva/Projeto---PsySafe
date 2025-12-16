package com.psysafe.model;

import java.time.LocalDateTime;
import java.util.List;

public class AcaoCorretiva {
    private String id;
    private String titulo;
    private String descricao;
    private String departamento;
    private String nivelRisco;
    private String prioridade;
    private String responsavel;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataPrazo;
    private String status;
    private List<String> medidasSugeridas;
    private String analiseDetalhada;
    private String impactoEsperado;
    private String recursosNecessarios;
    
    // Getters e Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }
    
    public String getNivelRisco() { return nivelRisco; }
    public void setNivelRisco(String nivelRisco) { this.nivelRisco = nivelRisco; }
    
    public String getPrioridade() { return prioridade; }
    public void setPrioridade(String prioridade) { this.prioridade = prioridade; }
    
    public String getResponsavel() { return responsavel; }
    public void setResponsavel(String responsavel) { this.responsavel = responsavel; }
    
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
    
    public LocalDateTime getDataPrazo() { return dataPrazo; }
    public void setDataPrazo(LocalDateTime dataPrazo) { this.dataPrazo = dataPrazo; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public List<String> getMedidasSugeridas() { return medidasSugeridas; }
    public void setMedidasSugeridas(List<String> medidasSugeridas) { this.medidasSugeridas = medidasSugeridas; }
    
    public String getAnaliseDetalhada() { return analiseDetalhada; }
    public void setAnaliseDetalhada(String analiseDetalhada) { this.analiseDetalhada = analiseDetalhada; }
    
    public String getImpactoEsperado() { return impactoEsperado; }
    public void setImpactoEsperado(String impactoEsperado) { this.impactoEsperado = impactoEsperado; }
    
    public String getRecursosNecessarios() { return recursosNecessarios; }
    public void setRecursosNecessarios(String recursosNecessarios) { this.recursosNecessarios = recursosNecessarios; }
}
