package com.psysafe.model;

public class Subescala {
    
    private Integer id;
    private Integer idSubescala;
    private String nome;
    private Integer ordem;
    private Integer idTipoResposta;

    public Subescala() {}

    public Subescala(Integer id, String nome, Integer ordem, Integer idTipoResposta) {
        this.id = id;
        this.idSubescala = id;
        this.nome = nome;
        this.ordem = ordem;
        this.idTipoResposta = idTipoResposta;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
        this.idSubescala = id;
    }

    public Integer getIdSubescala() {
        return idSubescala;
    }

    public void setIdSubescala(Integer idSubescala) {
        this.idSubescala = idSubescala;
        this.id = idSubescala;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getOrdem() {
        return ordem;
    }

    public void setOrdem(Integer ordem) {
        this.ordem = ordem;
    }

    public Integer getIdTipoResposta() {
        return idTipoResposta;
    }

    public void setIdTipoResposta(Integer idTipoResposta) {
        this.idTipoResposta = idTipoResposta;
    }
}