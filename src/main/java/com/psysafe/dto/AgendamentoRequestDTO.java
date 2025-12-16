package com.psysafe.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AgendamentoRequestDTO {
    private Integer idQuestionario;
    private String versao; 
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private List<String> departamentos;

    public Integer getIdQuestionario() { return idQuestionario; }
    public void setIdQuestionario(Integer idQuestionario) { this.idQuestionario = idQuestionario; }

    public String getVersao() { return versao; }
    public void setVersao(String versao) { this.versao = versao; }

    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }

    public LocalDateTime getDataFim() { return dataFim; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }

    public List<String> getDepartamentos() { return departamentos; }
    public void setDepartamentos(List<String> departamentos) { this.departamentos = departamentos; }
}
