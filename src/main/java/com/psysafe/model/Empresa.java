package com.psysafe.model;

import java.time.LocalDateTime;
import java.util.List;

public class Empresa {
    private int idEmpresa;
    private String nome;
    private String cnpj;
    private String endereco;
    private String telefone;
    private String email;
    private String setor;
    private int numeroFuncionarios;
    private LocalDateTime dataFundacao;
    private String responsavelRH;
    private String planoAtivo;
    private LocalDateTime validadePlano;

    // Getters e Setters
    public int getIdEmpresa() { return idEmpresa; }
    public void setIdEmpresa(int idEmpresa) { this.idEmpresa = idEmpresa; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSetor() { return setor; }
    public void setSetor(String setor) { this.setor = setor; }

    public int getNumeroFuncionarios() { return numeroFuncionarios; }
    public void setNumeroFuncionarios(int numeroFuncionarios) { this.numeroFuncionarios = numeroFuncionarios; }

    public LocalDateTime getDataFundacao() { return dataFundacao; }
    public void setDataFundacao(LocalDateTime dataFundacao) { this.dataFundacao = dataFundacao; }

    public String getResponsavelRH() { return responsavelRH; }
    public void setResponsavelRH(String responsavelRH) { this.responsavelRH = responsavelRH; }

    public String getPlanoAtivo() { return planoAtivo; }
    public void setPlanoAtivo(String planoAtivo) { this.planoAtivo = planoAtivo; }

    public LocalDateTime getValidadePlano() { return validadePlano; }
    public void setValidadePlano(LocalDateTime validadePlano) { this.validadePlano = validadePlano; }

    // Classes internas para Gestores e Equipes
    public static class Gestor {
        private int id;
        private String nome;
        private String cargo;
        private String email;

        public Gestor(int id, String nome, String cargo, String email) {
            this.id = id;
            this.nome = nome;
            this.cargo = cargo;
            this.email = email;
        }

        // Getters e Setters
        public int getId() { return id; }
        public void setId(int id) { this.id = id; }

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }

        public String getCargo() { return cargo; }
        public void setCargo(String cargo) { this.cargo = cargo; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class Equipe {
        private int idEquipe;
        private String nome;
        private String descricao;
        private List<MembroEquipe> membros;

        public Equipe(int idEquipe, String nome, String descricao) {
            this.idEquipe = idEquipe;
            this.nome = nome;
            this.descricao = descricao;
        }

        // Getters e Setters
        public int getIdEquipe() { return idEquipe; }
        public void setIdEquipe(int idEquipe) { this.idEquipe = idEquipe; }

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }

        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }

        public List<MembroEquipe> getMembros() { return membros; }
        public void setMembros(List<MembroEquipe> membros) { this.membros = membros; }
    }

    public static class MembroEquipe {
        private int id;
        private String nome;
        private String cargo;
        private String email;

        public MembroEquipe(int id, String nome, String cargo, String email) {
            this.id = id;
            this.nome = nome;
            this.cargo = cargo;
            this.email = email;
        }

        // Getters e Setters
        public int getId() { return id; }
        public void setId(int id) { this.id = id; }

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }

        public String getCargo() { return cargo; }
        public void setCargo(String cargo) { this.cargo = cargo; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
