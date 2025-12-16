package com.psysafe.dao;

import com.psysafe.database.Database;
import com.psysafe.model.Denuncia;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class DenunciaDAO {

    private Connection getConnection() throws SQLException {
        return Database.getConnection();
    }

    public Denuncia insert(Denuncia denuncia) {
    	String sql = "INSERT INTO denuncias " +
    		    "(titulo, descricao, tipo, data, resolvido, anonima, denunciante, denunciado, id_empresa) " +
    		    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, denuncia.getTitulo());
            stmt.setString(2, denuncia.getDescricao());
            stmt.setString(3, denuncia.getTipo());

            if (denuncia.getData() == null) {
                denuncia.setData(LocalDate.now());
            }
            stmt.setDate(4, Date.valueOf(denuncia.getData()));
            stmt.setBoolean(5, denuncia.isResolvido());
            stmt.setBoolean(6, denuncia.isAnonima());
            stmt.setString(7, denuncia.getDenunciante());
            stmt.setString(8, denuncia.getDenunciado());
            stmt.setObject(9, denuncia.getIdEmpresa());

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                denuncia.setId(rs.getInt("id"));
                denuncia.setIdEmpresa(rs.getInt("id_empresa"));
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao inserir denúncia: " + e.getMessage(), e);
        }

        return denuncia;
    }

    public List<Denuncia> getAll() {
        List<Denuncia> list = new ArrayList<>();
        String sql = "SELECT * FROM denuncias";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Denuncia d = mapResultSet(rs);
                list.add(d);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return list;
    }

    public Denuncia getById(int id) {
        String sql = "SELECT * FROM denuncias WHERE id = ?";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return mapResultSet(rs);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return null;
    }

    public void update(Denuncia denuncia) {
        // Corrigido para incluir id_empresa no update
        String sql = "UPDATE denuncias SET titulo = ?, descricao = ?, tipo = ?, " +
                "data = ?, resolvido = ?, anonima = ?, denunciante = ?, denunciado = ?, id_empresa = ? WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, denuncia.getTitulo());
            stmt.setString(2, denuncia.getDescricao());
            stmt.setString(3, denuncia.getTipo());
            stmt.setDate(4, Date.valueOf(denuncia.getData()));
            stmt.setBoolean(5, denuncia.isResolvido());
            stmt.setBoolean(6, denuncia.isAnonima());
            stmt.setString(7, denuncia.getDenunciante());
            stmt.setString(8, denuncia.getDenunciado());
            // NOVO PARÂMETRO
            stmt.setObject(9, denuncia.getIdEmpresa()); 
            // ID agora é o 10
            stmt.setInt(10, denuncia.getId()); 

            stmt.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao atualizar denúncia: " + e.getMessage(), e);
        }
    }
    
    // ✅ NOVO MÉTODO: Filtra TODAS as denúncias de uma empresa (inclui anônimas e não anônimas)
    public List<Denuncia> getDenunciasPorEmpresa(int idEmpresa) {
        List<Denuncia> list = new ArrayList<>();
        String sql = "SELECT * FROM denuncias WHERE id_empresa = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idEmpresa);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Denuncia d = mapResultSet(rs);
                    list.add(d);
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar denúncias por empresa: " + e.getMessage(), e);
        }

        return list;
    }
    
    // ✅ NOVO MÉTODO: Atualiza apenas o status 'resolvido' (Usado pela rota PUT /status)
    public void updateStatus(int id, boolean resolvido) {
        String sql = "UPDATE denuncias SET resolvido = ? WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setBoolean(1, resolvido);
            stmt.setInt(2, id);

            stmt.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao atualizar status da denúncia: " + e.getMessage(), e);
        }
    }

    private Denuncia mapResultSet(ResultSet rs) throws SQLException {
        Denuncia d = new Denuncia();
        d.setId(rs.getInt("id"));
        d.setTitulo(rs.getString("titulo"));
        d.setDescricao(rs.getString("descricao"));
        d.setTipo(rs.getString("tipo"));
        d.setData(rs.getDate("data").toLocalDate());
        d.setResolvido(rs.getBoolean("resolvido"));
        d.setAnonima(rs.getBoolean("anonima"));
        d.setDenunciante(rs.getString("denunciante"));
        d.setDenunciado(rs.getString("denunciado"));
        d.setIdEmpresa(rs.getInt("id_empresa"));

        return d;
    }
}