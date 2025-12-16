package com.psysafe.service;

import com.psysafe.dao.AuthUserDAO;
import com.psysafe.database.Database;
import com.psysafe.model.AuthUser;
import org.mindrot.jbcrypt.BCrypt;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.UUID;

public class AuthService {

    public AuthUser login(String email, String password) throws Exception {
        try (Connection conn = Database.getConnection()) {
            AuthUserDAO userDAO = new AuthUserDAO(conn);
            AuthUser user = userDAO.findByEmail(email);
            if (user == null) throw new Exception("Usuário não encontrado");
            if (!BCrypt.checkpw(password, user.getPasswordHash()))
                throw new Exception("Senha incorreta");

            userDAO.updateUltimoLogin(user.getId());
            return user;
        }
    }

    public AuthUser register(String name, String email, String password, String role) throws Exception {
        try (Connection conn = Database.getConnection()) {
            AuthUserDAO userDAO = new AuthUserDAO(conn);
            if (userDAO.findByEmail(email) != null)
                throw new Exception("Email já cadastrado");

            String hashed = BCrypt.hashpw(password, BCrypt.gensalt());
            AuthUser user = new AuthUser(
                    UUID.randomUUID(),
                    name,
                    email,
                    hashed,
                    role,
                    java.time.LocalDateTime.now(),
                    null, null, null, null, null, null, null
            );

            userDAO.save(user);
            return user;
        }
    }

    public void createUserProfile(UUID userId, String email, String name) throws SQLException {
        try (Connection conn = Database.getConnection()) {
            AuthUserDAO userDAO = new AuthUserDAO(conn);
            userDAO.createUserProfile(userId, email, name);
        }
    }

    public AuthUser findById(String id) throws Exception {
        try (Connection conn = Database.getConnection()) {
            AuthUserDAO userDAO = new AuthUserDAO(conn);
            AuthUser user = userDAO.findById(UUID.fromString(id));
            if (user == null) throw new Exception("Usuário não encontrado");
            return user;
        }
    }

    public AuthUser updateUserProfile(String userId, AuthUser updates) throws SQLException {
        try (Connection conn = Database.getConnection()) {
            AuthUserDAO userDAO = new AuthUserDAO(conn);
            return userDAO.updateUserProfile(UUID.fromString(userId), updates);
        }
    }
}
