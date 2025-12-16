package com.psysafe.model;

import java.time.LocalDate;

public class RespostaHistorico {
    private LocalDate data;
    private String questionario;
    private Integer pontuacao;
    private String nivelRisco;
    
    public RespostaHistorico(LocalDate data, String questionario, Integer pontuacao, String nivelRisco) {
        this.data = data;
        this.questionario = questionario;
        this.pontuacao = pontuacao;
        this.nivelRisco = nivelRisco;
    }
    
    // Getters e Setters
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    
    public String getQuestionario() { return questionario; }
    public void setQuestionario(String questionario) { this.questionario = questionario; }
    
    public Integer getPontuacao() { return pontuacao; }
    public void setPontuacao(Integer pontuacao) { this.pontuacao = pontuacao; }
    
    public String getNivelRisco() { return nivelRisco; }
    public void setNivelRisco(String nivelRisco) { this.nivelRisco = nivelRisco; }
}
