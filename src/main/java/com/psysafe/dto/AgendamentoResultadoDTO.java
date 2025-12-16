package com.psysafe.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class AgendamentoResultadoDTO {
    private Integer idAgendamento;
    private String tituloQuestionario;
    private String versao;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private List<String> departamentos;
    private Boolean ativo;

    private Integer totalParticipantes;
    private Integer totalRespostas;
    private Double percentualConclusao;
    private Double mediaGeral;

    private Map<String, SubescalaAgregada> resultadosPorSubescala;
    private List<RespostaFuncionario> respostasFuncionarios;

    public AgendamentoResultadoDTO() {}

    // Getters e setters
    public Integer getIdAgendamento() { return idAgendamento; }
    public void setIdAgendamento(Integer idAgendamento) { this.idAgendamento = idAgendamento; }
    public String getTituloQuestionario() { return tituloQuestionario; }
    public void setTituloQuestionario(String tituloQuestionario) { this.tituloQuestionario = tituloQuestionario; }
    public String getVersao() { return versao; }
    public void setVersao(String versao) { this.versao = versao; }
    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }
    public LocalDateTime getDataFim() { return dataFim; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }
    public List<String> getDepartamentos() { return departamentos; }
    public void setDepartamentos(List<String> departamentos) { this.departamentos = departamentos; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public Integer getTotalParticipantes() { return totalParticipantes; }
    public void setTotalParticipantes(Integer totalParticipantes) { this.totalParticipantes = totalParticipantes; }
    public Integer getTotalRespostas() { return totalRespostas; }
    public void setTotalRespostas(Integer totalRespostas) { this.totalRespostas = totalRespostas; }
    public Double getPercentualConclusao() { return percentualConclusao; }
    public void setPercentualConclusao(Double percentualConclusao) { this.percentualConclusao = percentualConclusao; }
    public Double getMediaGeral() { return mediaGeral; }
    public void setMediaGeral(Double mediaGeral) { this.mediaGeral = mediaGeral; }
    public Map<String, SubescalaAgregada> getResultadosPorSubescala() { return resultadosPorSubescala; }
    public void setResultadosPorSubescala(Map<String, SubescalaAgregada> resultadosPorSubescala) { this.resultadosPorSubescala = resultadosPorSubescala; }
    public List<RespostaFuncionario> getRespostasFuncionarios() { return respostasFuncionarios; }
    public void setRespostasFuncionarios(List<RespostaFuncionario> respostasFuncionarios) { this.respostasFuncionarios = respostasFuncionarios; }

    public static class SubescalaAgregada {
        private String nomeSubescala;
        private Double mediaEquipe;
        private Double mediaMinima;
        private Double mediaMaxima;
        private Integer totalRespostas;

        public SubescalaAgregada() {}

        public String getNomeSubescala() { return nomeSubescala; }
        public void setNomeSubescala(String nomeSubescala) { this.nomeSubescala = nomeSubescala; }
        public Double getMediaEquipe() { return mediaEquipe; }
        public void setMediaEquipe(Double mediaEquipe) { this.mediaEquipe = mediaEquipe; }
        public Double getMediaMinima() { return mediaMinima; }
        public void setMediaMinima(Double mediaMinima) { this.mediaMinima = mediaMinima; }
        public Double getMediaMaxima() { return mediaMaxima; }
        public void setMediaMaxima(Double mediaMaxima) { this.mediaMaxima = mediaMaxima; }
        public Integer getTotalRespostas() { return totalRespostas; }
        public void setTotalRespostas(Integer totalRespostas) { this.totalRespostas = totalRespostas; }
    }

    public static class RespostaFuncionario {
        private Integer idUsuario;
        private String nomeUsuario;
        private String departamento;
        private String cargo;
        private LocalDateTime dataResposta;
        private Integer perguntasRespondidas;
        private Integer totalPerguntas;
        private Boolean completo;
        private Double mediaGeral;
        private Map<String, Double> mediasPorSubescala;

        public RespostaFuncionario() {}

        public Integer getIdUsuario() { return idUsuario; }
        public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
        public String getNomeUsuario() { return nomeUsuario; }
        public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }
        public String getDepartamento() { return departamento; }
        public void setDepartamento(String departamento) { this.departamento = departamento; }
        public String getCargo() { return cargo; }
        public void setCargo(String cargo) { this.cargo = cargo; }
        public LocalDateTime getDataResposta() { return dataResposta; }
        public void setDataResposta(LocalDateTime dataResposta) { this.dataResposta = dataResposta; }
        public Integer getPerguntasRespondidas() { return perguntasRespondidas; }
        public void setPerguntasRespondidas(Integer perguntasRespondidas) { this.perguntasRespondidas = perguntasRespondidas; }
        public Integer getTotalPerguntas() { return totalPerguntas; }
        public void setTotalPerguntas(Integer totalPerguntas) { this.totalPerguntas = totalPerguntas; }
        public Boolean getCompleto() { return completo; }
        public void setCompleto(Boolean completo) { this.completo = completo; }
        public Double getMediaGeral() { return mediaGeral; }
        public void setMediaGeral(Double mediaGeral) { this.mediaGeral = mediaGeral; }
        public Map<String, Double> getMediasPorSubescala() { return mediasPorSubescala; }
        public void setMediasPorSubescala(Map<String, Double> mediasPorSubescala) { this.mediasPorSubescala = mediasPorSubescala; }
    }
}
