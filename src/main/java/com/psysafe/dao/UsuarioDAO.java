package com.psysafe.dao;

import com.psysafe.database.Database;
import com.psysafe.model.Usuario;
import org.mindrot.jbcrypt.BCrypt;
import org.postgresql.util.PSQLException;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UsuarioDAO {

    public boolean save(Usuario usuario) {
        String sql = "INSERT INTO usuario (nome, email, senha, role) VALUES (?, ?, ?, ?)";
        String senhaHash = BCrypt.hashpw(usuario.getSenha(), BCrypt.gensalt());

        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, usuario.getNome());
            stmt.setString(2, usuario.getEmail());
            stmt.setString(3, senhaHash);
            stmt.setString(4, usuario.getRole());
            stmt.executeUpdate();
            return true;

        } catch (PSQLException e) {
            if ("23505".equals(e.getSQLState())) { // erro de e-mail duplicado
                System.err.println("⚠️ E-mail já cadastrado: " + usuario.getEmail());
                return false;
            }
            e.printStackTrace();
            return false;
        } catch (SQLException e) {
            System.err.println("❌ Erro ao salvar usuário: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public Usuario findByEmail(String email) {
        String sql = "SELECT id, nome, email, senha, role FROM usuario WHERE email = ?";
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Usuario u = new Usuario();
                    u.setId(rs.getInt("id"));
                    u.setNome(rs.getString("nome"));
                    u.setEmail(rs.getString("email"));
                    u.setSenha(rs.getString("senha"));
                    u.setRole(rs.getString("role"));
                    return u;
                }
            }
        } catch (SQLException e) {
            System.err.println("❌ Erro ao buscar usuário por e-mail: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    public Usuario findById(int id) {
        String sql = "SELECT id, nome, email, senha, role FROM usuario WHERE id = ?";
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Usuario u = new Usuario();
                    u.setId(rs.getInt("id"));
                    u.setNome(rs.getString("nome"));
                    u.setEmail(rs.getString("email"));
                    u.setSenha(rs.getString("senha"));
                    u.setRole(rs.getString("role"));
                    return u;
                }
            }
        } catch (SQLException e) {
            System.err.println("❌ Erro ao buscar usuário por ID: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    public List<Usuario> findAll() {
        String sql = "SELECT id, nome, email, senha, role FROM usuario";
        List<Usuario> usuarios = new ArrayList<>();

        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Usuario u = new Usuario();
                u.setId(rs.getInt("id"));
                u.setNome(rs.getString("nome"));
                u.setEmail(rs.getString("email"));
                u.setSenha(rs.getString("senha"));
                u.setRole(rs.getString("role"));
                usuarios.add(u);
            }
        } catch (SQLException e) {
            System.err.println("❌ Erro ao listar usuários: " + e.getMessage());
            e.printStackTrace();
        }
        return usuarios;
    }

    public boolean checkPassword(Usuario usuario, String senhaPlana) {
        return BCrypt.checkpw(senhaPlana, usuario.getSenha());
    }

    public boolean updatePassword(int id, String novaSenhaPlana) {
        String sql = "UPDATE usuario SET senha = ? WHERE id = ?";
        String senhaHash = BCrypt.hashpw(novaSenhaPlana, BCrypt.gensalt());

        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, senhaHash);
            stmt.setInt(2, id);
            return stmt.executeUpdate() > 0;

        } catch (SQLException e) {
            System.err.println("❌ Erro ao atualizar senha: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
