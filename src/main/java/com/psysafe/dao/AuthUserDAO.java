package com.psysafe.dao;

import com.psysafe.model.AuthUser;
import java.sql.*;
import java.util.UUID;

public class AuthUserDAO {
    private final Connection conn;

    public AuthUserDAO(Connection conn) {
        this.conn = conn;
    }

    public AuthUser findByEmail(String email) throws SQLException {
        String sql = """
            SELECT u.id, u.name, u.email, u.password_hash, u.role, u.created_at,
                   p.name AS profile_name, p.departamento, p.equipe, p.cargo, p.telefone, p.id_empresa,
                   p.data_admissao, p.ultimo_login
            FROM auth_user u
            LEFT JOIN user_profile p ON u.id = p.user_id
            WHERE u.email = ?
        """;
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();
            return rs.next() ? mapResultSetToAuthUser(rs) : null;
        }
    }

    public AuthUser findById(UUID id) throws SQLException {
        String sql = """
            SELECT u.id, u.name, u.email, u.password_hash, u.role, u.created_at,
                   p.name AS profile_name, p.departamento, p.equipe, p.cargo, p.telefone, p.id_empresa,
                   p.data_admissao, p.ultimo_login
            FROM auth_user u
            LEFT JOIN user_profile p ON u.id = p.user_id
            WHERE u.id = ?
        """;
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, id);
            ResultSet rs = stmt.executeQuery();
            return rs.next() ? mapResultSetToAuthUser(rs) : null;
        }
    }

    public void save(AuthUser user) throws SQLException {
        String sql = """
            INSERT INTO auth_user (id, name, email, password_hash, role, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """;
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, user.getId());
            stmt.setString(2, user.getName());
            stmt.setString(3, user.getEmail());
            stmt.setString(4, user.getPasswordHash());
            stmt.setString(5, user.getRole());
            stmt.setTimestamp(6, Timestamp.valueOf(user.getCreatedAt()));
            stmt.executeUpdate();
        }
    }

    public void createUserProfile(UUID userId, String email, String name) throws SQLException {
        String sql = """
            INSERT INTO user_profile (user_id, email, name, ultimo_login)
            VALUES (?, ?, ?, NOW())
            ON CONFLICT (user_id) DO NOTHING
        """;
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, userId);
            stmt.setString(2, email);
            stmt.setString(3, name);
            stmt.executeUpdate();
        }
    }

    public AuthUser updateUserProfile(UUID userId, AuthUser updates) throws SQLException {
        // Cria registro se não existir
        String insertIfNotExists = """
            INSERT INTO user_profile (user_id, email, name, ultimo_login)
            VALUES (?, ?, ?, NOW())
            ON CONFLICT (user_id) DO NOTHING
        """;
        try (PreparedStatement stmt = conn.prepareStatement(insertIfNotExists)) {
            stmt.setObject(1, userId);
            stmt.setString(2, updates.getEmail());
            stmt.setString(3, updates.getName());
            stmt.executeUpdate();
        }

        String sql = """
            UPDATE user_profile
            SET name = ?, departamento = ?, equipe = ?, cargo = ?, telefone = ?, id_empresa = ?, data_admissao = ?
            WHERE user_id = ?
        """;
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, updates.getName());
            stmt.setString(2, updates.getDepartamento());
            stmt.setString(3, updates.getEquipe());
            stmt.setString(4, updates.getCargo());
            stmt.setString(5, updates.getTelefone());
            if (updates.getIdEmpresa() != null)
                stmt.setInt(6, updates.getIdEmpresa());
            else
                stmt.setNull(6, Types.INTEGER);

            if (updates.getDataAdmissao() != null)
                stmt.setTimestamp(7, Timestamp.valueOf(updates.getDataAdmissao()));
            else
                stmt.setNull(7, Types.TIMESTAMP);

            stmt.setObject(8, userId);
            stmt.executeUpdate();
        }

        return findById(userId);
    }

    public void updateUltimoLogin(UUID userId) throws SQLException {
        String sql = """
            INSERT INTO user_profile (user_id, ultimo_login)
            VALUES (?, NOW())
            ON CONFLICT (user_id) DO UPDATE SET ultimo_login = NOW()
        """;
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, userId);
            stmt.executeUpdate();
        }
    }

    private AuthUser mapResultSetToAuthUser(ResultSet rs) throws SQLException {
        return new AuthUser(
                (UUID) rs.getObject("id"),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("password_hash"),
                rs.getString("role"),
                rs.getTimestamp("created_at").toLocalDateTime(),
                rs.getString("departamento"),
                rs.getString("equipe"),
                rs.getString("cargo"),
                rs.getString("telefone"),
                rs.getObject("id_empresa") != null ? rs.getInt("id_empresa") : null,
                rs.getTimestamp("data_admissao") != null ? rs.getTimestamp("data_admissao").toLocalDateTime() : null,
                rs.getTimestamp("ultimo_login") != null ? rs.getTimestamp("ultimo_login").toLocalDateTime() : null
        );
        
    }
}//estavel
