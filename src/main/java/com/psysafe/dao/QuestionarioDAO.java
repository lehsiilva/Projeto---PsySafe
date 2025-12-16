package com.psysafe.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.psysafe.database.Database;
import com.psysafe.model.Questionario;

public class QuestionarioDAO {

    public Questionario save(Questionario q) {
        String sql = "INSERT INTO public.questionario(titulo, descricao, ativo, versao, tempo_estimado) " +
                     "VALUES (?, ?, ?, ?, ?) RETURNING id";

        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, q.getTitulo());
            ps.setString(2, q.getDescricao());
            ps.setBoolean(3, q.getAtivo());
            ps.setString(4, q.getVersao() != null ? q.getVersao() : "completa");
            ps.setString(5, q.getTempoEstimado() != null ? q.getTempoEstimado() : "30 minutos");

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                q.setIdQuestionario(rs.getInt("id"));
            }
            return q;

        } catch (SQLException ex) {
            ex.printStackTrace();
            return null;
        }
    }

    public List<Questionario> findAll() {
        List<Questionario> list = new ArrayList<>();
        String sql = "SELECT * FROM public.questionario ORDER BY id DESC";

        try (Connection conn = Database.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                Questionario q = mapResultSetToQuestionario(rs);
                list.add(q);
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }

        return list;
    }

    public Questionario findById(int idQuestionario) {
        String sql = "SELECT * FROM public.questionario WHERE id = ?";

        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, idQuestionario);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return mapResultSetToQuestionario(rs);
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }

        return null;
    }

    private Questionario mapResultSetToQuestionario(ResultSet rs) throws SQLException {
        Questionario q = new Questionario();
        q.setIdQuestionario(rs.getInt("id"));
        q.setTitulo(rs.getString("titulo"));
        q.setDescricao(rs.getString("descricao"));
        q.setAtivo(rs.getBoolean("ativo"));
        
        // Campos opcionais - verificar se existem
        try {
            q.setVersao(rs.getString("versao"));
        } catch (SQLException e) {
            q.setVersao("completa");
        }
        
        try {
            q.setTempoEstimado(rs.getString("tempo_estimado"));
        } catch (SQLException e) {
            q.setTempoEstimado("30 minutos");
        }
        
        try {
            q.setDataCriacao(rs.getTimestamp("data_criacao"));
        } catch (SQLException e) {
            // Se data_criacao não existe, usa timestamp atual
            q.setDataCriacao(new Timestamp(System.currentTimeMillis()));
        }
        
        return q;
    }
}