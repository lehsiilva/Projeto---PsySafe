package com.psysafe.dto;

import java.time.LocalDate;
import java.util.List;

public class QuestionarioDTO {
    private Integer id;
    private String nome;
    private boolean ativo;
    private LocalDate dataCriacao;
    private List<QuestionarioPerguntaDTO> perguntas; // lista de perguntas vinculadas

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }

    public LocalDate getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDate dataCriacao) { this.dataCriacao = dataCriacao; }

    public List<QuestionarioPerguntaDTO> getPerguntas() { return perguntas; }
    public void setPerguntas(List<QuestionarioPerguntaDTO> perguntas) { this.perguntas = perguntas; }
}
