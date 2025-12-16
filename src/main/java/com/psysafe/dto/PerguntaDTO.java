package com.psysafe.dto;

public class PerguntaDTO {
    private Integer id;
    private String texto;
    private SubescalaDTO subescala;
    private String tipo; // ex.: "Likert", "Sim/Não", etc.

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public SubescalaDTO getSubescala() { return subescala; }
    public void setSubescala(SubescalaDTO subescala) { this.subescala = subescala; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
}
