package com.psysafe.dao;

import com.psysafe.model.Empresa;
import com.psysafe.model.MembroEquipe;
import com.psysafe.model.Equipe;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class EmpresaDAO {

    private final Connection conn;

    public EmpresaDAO(Connection conn) {
        this.conn = conn;
    }

    public Empresa findEmpresaByUserId(UUID userId) throws SQLException {
        String sql = """
            SELECT e.id_empresa, e.nome, e.cnpj, e.endereco, e.telefone, e.email,
                   e.setor, e.numero_funcionarios, e.data_fundacao, e.responsavel_rh,
                   e.plano_ativo, e.validade_plano
            FROM empresa e
            JOIN user_profile p ON e.id_empresa = p.id_empresa
            WHERE p.user_id = ?
        """;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, userId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return mapResultSetToEmpresa(rs);
            }
        }
        return null;
    }

    public List<MembroEquipe> findGestoresByUserId(UUID userId) throws SQLException {
        String sql = """
            SELECT u.id, u.name AS nome, p.cargo, u.email
            FROM auth_user u
            JOIN user_profile p ON u.id = p.user_id
            WHERE p.id_empresa = (SELECT id_empresa FROM user_profile WHERE user_id = ?)
              AND u.role = 'gestor'
        """;

        List<MembroEquipe> gestores = new ArrayList<>();
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, userId); // UUID
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                MembroEquipe m = new MembroEquipe();
                m.setId(rs.getString("id"));       // agora String
                m.setNome(rs.getString("nome"));
                m.setCargo(rs.getString("cargo"));
                m.setEmail(rs.getString("email"));
                gestores.add(m);
            }
        }
        return gestores;
    }


    public List<Equipe> findEquipesByUserId(UUID userId) throws SQLException {
        String sql = """
            SELECT id_equipe, nome
            FROM equipe
            WHERE empresa_id = (SELECT id_empresa FROM user_profile WHERE user_id = ?)
        """;

        List<Equipe> equipes = new ArrayList<>();
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, userId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Equipe e = new Equipe();
                e.setIdEquipe(rs.getInt("id_equipe"));
                e.setNome(rs.getString("nome"));

                // Pega membros
                e.setMembros(findMembrosByEquipe(e.getIdEquipe()));
                equipes.add(e);
            }
        }
        return equipes;
    }

    private List<MembroEquipe> findMembrosByEquipe(int idEquipe) throws SQLException {
        String sql = """
            SELECT id, nome, cargo, email
            FROM membro_equipe
            WHERE id_equipe = ?
        """;

        List<MembroEquipe> membros = new ArrayList<>();
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, idEquipe);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                MembroEquipe m = new MembroEquipe();
                m.setId(rs.getString("id"));
                m.setNome(rs.getString("nome"));
                m.setCargo(rs.getString("cargo"));
                m.setEmail(rs.getString("email"));
                membros.add(m);
            }
        }
        return membros;
    }

    private Empresa mapResultSetToEmpresa(ResultSet rs) throws SQLException {
        Empresa e = new Empresa();
        e.setIdEmpresa(rs.getInt("id_empresa"));
        e.setNome(rs.getString("nome"));
        e.setCnpj(rs.getString("cnpj"));
        e.setEndereco(rs.getString("endereco"));
        e.setTelefone(rs.getString("telefone"));
        e.setEmail(rs.getString("email"));
        e.setSetor(rs.getString("setor"));
        e.setNumeroFuncionarios(rs.getInt("numero_funcionarios"));
        e.setDataFundacao(rs.getTimestamp("data_fundacao").toLocalDateTime());
        e.setResponsavelRH(rs.getString("responsavel_rh"));
        e.setPlanoAtivo(rs.getString("plano_ativo"));
        e.setValidadePlano(rs.getTimestamp("validade_plano").toLocalDateTime());
        return e;
    }
}
