// Equipe.java
package com.psysafe.model;

import java.util.List;

public class Equipe {
    private int idEquipe;
    private String nome;
    private String descricao;
    private List<MembroEquipe> membros;

    // Getters e Setters

    public int getIdEquipe() {
        return idEquipe;
    }

    public void setIdEquipe(int idEquipe) {
        this.idEquipe = idEquipe;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public List<MembroEquipe> getMembros() {
        return membros;
    }

    public void setMembros(List<MembroEquipe> membros) {
        this.membros = membros;
    }
}
