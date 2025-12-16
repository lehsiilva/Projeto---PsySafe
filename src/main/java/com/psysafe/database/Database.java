package com.psysafe.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {

    private static final String URL = "jdbc:postgresql://psysafe.postgres.database.azure.com:5432/psysafe_db";
    private static final String USER = "psysafeAdm";
    private static final String PASSWORD = "Adm12345"; 

    
    // Método que tenta estabelecer a conexão
    public static Connection getConnection() throws SQLException {
        try {
            // DriverManager tenta estabelecer a conexão usando as credenciais
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (SQLException e) {
            
            System.err.println("FALHA CRÍTICA DE CONEXÃO COM O BANCO DE DADOS");
            System.err.println("Por favor, verifique: 1. Senha; 2. URL; 3. Servidor Azure está online; 4. Firewall do Azure.");
            e.printStackTrace(); // Imprime o stack trace completo (com a causa do erro)
            throw e; // Relança a exceção para o DAO/Service (causando o erro 500)
        }
    }
}
