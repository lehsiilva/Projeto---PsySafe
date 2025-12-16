package com.psysafe.dto;

import java.time.LocalDateTime;

public class DenunciaDTO {
    private Integer id;
    private Integer idDenunciante;
    private Integer idEmpresa;
    private String descricao;
    private boolean resolvido;
    private LocalDateTime dataCriacao;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getIdDenunciante() { return idDenunciante; }
    public void setIdDenunciante(Integer idDenunciante) { this.idDenunciante = idDenunciante; }

    public Integer getIdEmpresa() { return idEmpresa; }
    public void setIdEmpresa(Integer idEmpresa) { this.idEmpresa = idEmpresa; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public boolean isResolvido() { return resolvido; }
    public void setResolvido(boolean resolvido) { this.resolvido = resolvido; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}
