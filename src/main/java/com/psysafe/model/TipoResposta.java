package com.psysafe.model;

public class TipoResposta {

    private Integer idTipoResposta;
    private String descricao;
    private String codigo;
    private Integer minValor;
    private Integer maxValor;
    private String opcao1;
    private String opcao2;
    private String opcao3;
    private String opcao4;
    private String opcao5;

    public TipoResposta() {}

    public TipoResposta(Integer idTipoResposta, String descricao, String codigo, 
                       Integer minValor, Integer maxValor,
                       String opcao1, String opcao2, String opcao3, String opcao4, String opcao5) {
        this.idTipoResposta = idTipoResposta;
        this.descricao = descricao;
        this.codigo = codigo;
        this.minValor = minValor;
        this.maxValor = maxValor;
        this.opcao1 = opcao1;
        this.opcao2 = opcao2;
        this.opcao3 = opcao3;
        this.opcao4 = opcao4;
        this.opcao5 = opcao5;
    }

    public Integer getIdTipoResposta() {
        return idTipoResposta;
    }

    public void setIdTipoResposta(Integer idTipoResposta) {
        this.idTipoResposta = idTipoResposta;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Integer getMinValor() {
        return minValor;
    }

    public void setMinValor(Integer minValor) {
        this.minValor = minValor;
    }

    public Integer getMaxValor() {
        return maxValor;
    }

    public void setMaxValor(Integer maxValor) {
        this.maxValor = maxValor;
    }

    public String getOpcao1() {
        return opcao1;
    }

    public void setOpcao1(String opcao1) {
        this.opcao1 = opcao1;
    }

    public String getOpcao2() {
        return opcao2;
    }

    public void setOpcao2(String opcao2) {
        this.opcao2 = opcao2;
    }

    public String getOpcao3() {
        return opcao3;
    }

    public void setOpcao3(String opcao3) {
        this.opcao3 = opcao3;
    }

    public String getOpcao4() {
        return opcao4;
    }

    public void setOpcao4(String opcao4) {
        this.opcao4 = opcao4;
    }

    public String getOpcao5() {
        return opcao5;
    }

    public void setOpcao5(String opcao5) {
        this.opcao5 = opcao5;
    }
}