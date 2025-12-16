package com.psysafe.model;

public class Pergunta {
    private Integer id;
    private String texto;
    private Integer numero;
    private Integer subescalaId;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public Integer getNumero() { return numero; }
    public void setNumero(Integer numero) { this.numero = numero; }

    public Integer getSubescalaId() { return subescalaId; }
    public void setSubescalaId(Integer subescalaId) { this.subescalaId = subescalaId; }
}
