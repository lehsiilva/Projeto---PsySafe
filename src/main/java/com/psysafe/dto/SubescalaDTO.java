package com.psysafe.dto;

public class SubescalaDTO {
    private Integer id;
    private String nome;
    private String descricao;
    private EscalaDTO escala;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public EscalaDTO getEscala() { return escala; }
    public void setEscala(EscalaDTO escala) { this.escala = escala; }
}
