package com.psysafe.dao;

import com.psysafe.database.Database;
import com.psysafe.model.Usuario;

import java.sql.*;

public class AuthServiceDAO {

    public void saveToken(String token, int usuarioId) {
        String sql = "INSERT INTO tokens (token, usuario_id) VALUES (?, ?)";
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, token);
            stmt.setInt(2, usuarioId);
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public Usuario findUserByToken(String token) {
        String sql = "SELECT u.* FROM usuarios u JOIN tokens t ON u.id = t.usuario_id WHERE t.token = ?";
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, token);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new Usuario(
                        rs.getInt("id"),
                        rs.getString("nome"),
                        rs.getString("email"),
                        rs.getString("senha"),
                        rs.getString("role"),
                        rs.getString("telefone"),
                        rs.getString("empresa"),
                        rs.getString("departamento"),
                        rs.getDate("data_admissao") != null ? rs.getDate("data_admissao").toLocalDate() : null
                );
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public void deleteToken(String token) {
        String sql = "DELETE FROM tokens WHERE token = ?";
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, token);
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
