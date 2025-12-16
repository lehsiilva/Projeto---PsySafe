package com.psysafe.dto;

public class TipoRespostaDTO {
    private Integer id;
    private String descricao;
    private Integer valorMinimo;
    private Integer valorMaximo;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Integer getValorMinimo() { return valorMinimo; }
    public void setValorMinimo(Integer valorMinimo) { this.valorMinimo = valorMinimo; }

    public Integer getValorMaximo() { return valorMaximo; }
    public void setValorMaximo(Integer valorMaximo) { this.valorMaximo = valorMaximo; }
}
