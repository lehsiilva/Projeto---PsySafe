package com.psysafe.dto;

public class CreateDenunciaRequest {
    private Integer idDenunciante;
    private Integer idEmpresa;
    private String descricao;

    public Integer getIdDenunciante() { return idDenunciante; }
    public void setIdDenunciante(Integer idDenunciante) { this.idDenunciante = idDenunciante; }

    public Integer getIdEmpresa() { return idEmpresa; }
    public void setIdEmpresa(Integer idEmpresa) { this.idEmpresa = idEmpresa; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}
