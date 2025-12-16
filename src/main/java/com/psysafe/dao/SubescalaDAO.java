package com.psysafe.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.psysafe.database.Database;
import com.psysafe.model.Subescala;

public class SubescalaDAO {

    public Subescala findById(int id) {
        String sql = "SELECT * FROM subescala WHERE id_subescala = ?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                return mapResultSet(rs);
            }
        } catch (SQLException e) {
            System.err.println("Erro ao buscar Subescala: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    public Subescala save(Subescala s) {
        String sql = "INSERT INTO subescala(nome, ordem) VALUES (?, ?) RETURNING id_subescala";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, s.getNome());
            ps.setInt(2, s.getOrdem());
            
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                s.setIdSubescala(rs.getInt("id_subescala"));
            }
            return s;
        } catch (SQLException ex) {
            System.err.println("Erro ao salvar Subescala: " + ex.getMessage());
            ex.printStackTrace();
            return null;
        }
    }

    public List<Subescala> findAllByOrderByOrdem() {
        List<Subescala> list = new ArrayList<>();
        String sql = "SELECT * FROM subescala ORDER BY ordem";
        
        try (Connection conn = Database.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            
            while (rs.next()) {
                list.add(mapResultSet(rs));
            }
        } catch (SQLException ex) {
            System.err.println("Erro ao listar Subescala: " + ex.getMessage());
            ex.printStackTrace();
        }
        return list;
    }

    public List<Subescala> findAll() {
        List<Subescala> list = new ArrayList<>();
        String sql = "SELECT * FROM subescala ORDER BY id_subescala";
        
        try (Connection conn = Database.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            
            while (rs.next()) {
                list.add(mapResultSet(rs));
            }
        } catch (SQLException ex) {
            System.err.println("Erro ao listar Subescala: " + ex.getMessage());
            ex.printStackTrace();
        }
        return list;
    }

    private Subescala mapResultSet(ResultSet rs) throws SQLException {
        Subescala s = new Subescala();
        s.setIdSubescala(rs.getInt("id_subescala"));
        s.setNome(rs.getString("nome"));
        s.setOrdem(rs.getInt("ordem"));
        return s;
    }
}