package com.psysafe.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.psysafe.database.Database;
import com.psysafe.model.Pergunta;

public class PerguntaDAO {

    public Pergunta save(Pergunta p) {
        String sql = "INSERT INTO pergunta(conteudo, subescala_id, numero) VALUES (?, ?, ?) RETURNING id";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, p.getTexto());
            ps.setInt(2, p.getSubescalaId());
            ps.setInt(3, p.getNumero());
            
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                p.setId(rs.getInt("id"));
            }
            return p;
        } catch (SQLException ex) {
            System.err.println("Erro ao salvar Pergunta: " + ex.getMessage());
            ex.printStackTrace();
            return null;
        }
    }

    public List<Pergunta> findAll() {
        List<Pergunta> list = new ArrayList<>();
        String sql = "SELECT * FROM pergunta ORDER BY id";
        
        try (Connection conn = Database.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            
            while (rs.next()) {
                list.add(mapResultSet(rs));
            }
        } catch (SQLException ex) {
            System.err.println("Erro ao buscar perguntas: " + ex.getMessage());
            ex.printStackTrace();
        }
        return list;
    }

    public Pergunta findById(int id) {
        String sql = "SELECT * FROM pergunta WHERE id = ?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                return mapResultSet(rs);
            }
        } catch (SQLException ex) {
            System.err.println("Erro ao buscar pergunta por ID: " + ex.getMessage());
            ex.printStackTrace();
        }
        return null;
    }

    public List<Pergunta> findBySubescalaIdSubescalaOrderByNumero(int idSubescala) {
        List<Pergunta> list = new ArrayList<>();
        String sql = "SELECT * FROM pergunta WHERE subescala_id = ? ORDER BY numero";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, idSubescala);
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                list.add(mapResultSet(rs));
            }
        } catch (SQLException ex) {
            System.err.println("Erro ao buscar perguntas por subescala: " + ex.getMessage());
            ex.printStackTrace();
        }
        return list;
    }

    private Pergunta mapResultSet(ResultSet rs) throws SQLException {
        Pergunta p = new Pergunta();
        p.setId(rs.getInt("id"));
        p.setTexto(rs.getString("conteudo"));
        p.setSubescalaId(rs.getInt("subescala_id"));
        
        try {
            p.setNumero(rs.getInt("numero"));
        } catch (SQLException e) {
            p.setNumero(0);
        }
        
        return p;
    }
}