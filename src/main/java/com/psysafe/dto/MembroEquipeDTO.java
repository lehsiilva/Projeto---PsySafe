package com.psysafe.dto;

public class MembroEquipeDTO {
    private Integer id;
    private Integer idUsuario;
    private Integer idEquipe;
    private String funcao;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public Integer getIdEquipe() { return idEquipe; }
    public void setIdEquipe(Integer idEquipe) { this.idEquipe = idEquipe; }

    public String getFuncao() { return funcao; }
    public void setFuncao(String funcao) { this.funcao = funcao; }
}
