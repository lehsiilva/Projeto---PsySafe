package com.psysafe.dto;

import java.time.LocalDate;

public class AgendamentoDTO {
    private Integer id;
    private Integer funcionarioId;
    private Integer questionarioId;
    private LocalDate dataRealizacao;
    private boolean finalizado;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getFuncionarioId() { return funcionarioId; }
    public void setFuncionarioId(Integer funcionarioId) { this.funcionarioId = funcionarioId; }

    public Integer getQuestionarioId() { return questionarioId; }
    public void setQuestionarioId(Integer questionarioId) { this.questionarioId = questionarioId; }

    public LocalDate getDataRealizacao() { return dataRealizacao; }
    public void setDataRealizacao(LocalDate dataRealizacao) { this.dataRealizacao = dataRealizacao; }

    public boolean isFinalizado() { return finalizado; }
    public void setFinalizado(boolean finalizado) { this.finalizado = finalizado; }
}
