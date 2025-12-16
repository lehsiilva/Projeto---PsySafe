package com.psysafe.dao;

import java.sql.Array;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.psysafe.database.Database;
import com.psysafe.model.QuestionarioAgendamento;

public class QuestionarioAgendamentoDAO {

    public QuestionarioAgendamento save(QuestionarioAgendamento qa) {
        String sql = "INSERT INTO questionario_agendamento " +
                "(idquestionario, idgestor, versao, datainicio, datafim, departamentos, ativo, createdat, updatedat) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING idagendamento";

        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, qa.getIdQuestionario());
            ps.setString(2, qa.getIdGestor());  // ✅ setString
            ps.setString(3, qa.getVersao());
            ps.setTimestamp(4, Timestamp.valueOf(qa.getDataInicio()));
            ps.setTimestamp(5, Timestamp.valueOf(qa.getDataFim()));
            ps.setArray(6, conn.createArrayOf("text", qa.getDepartamentos()));
            ps.setBoolean(7, qa.getAtivo() != null ? qa.getAtivo() : true);
            ps.setTimestamp(8, Timestamp.valueOf(LocalDateTime.now()));
            ps.setTimestamp(9, Timestamp.valueOf(LocalDateTime.now()));

            ResultSet rs = ps.executeQuery();
            if (rs.next()) qa.setIdAgendamento(rs.getInt("idagendamento"));
            return qa;

        } catch (SQLException ex) {
            ex.printStackTrace();
            return null;
        }
    }

    public List<QuestionarioAgendamento> findAll() {
        List<QuestionarioAgendamento> list = new ArrayList<>();
        String sql = "SELECT * FROM questionario_agendamento";

        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                list.add(mapResultSet(rs));
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return list;
    }

    public List<QuestionarioAgendamento> findAtivosOrderByCreatedAtDesc() {
        List<QuestionarioAgendamento> list = new ArrayList<>();
        String sql = "SELECT * FROM questionario_agendamento WHERE ativo=true ORDER BY createdat DESC";

        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                list.add(mapResultSet(rs));
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }

        return list;
    }

    public List<QuestionarioAgendamento> findByGestorAtivosOrderByCreatedAtDesc(String idGestor) {  // ✅ String
        List<QuestionarioAgendamento> list = new ArrayList<>();
        String sql = "SELECT * FROM questionario_agendamento WHERE idgestor=? AND ativo=true ORDER BY createdat DESC";

        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, idGestor);  // ✅ setString
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                list.add(mapResultSet(rs));
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return list;
    }

    /**
     * ✅ NOVO MÉTODO: Cancela (deleta) um agendamento do banco de dados
     */
    public boolean cancelarAgendamento(int idAgendamento) {
        String sql = "DELETE FROM questionario_agendamento WHERE idagendamento = ?";

        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, idAgendamento);
            int rowsAffected = ps.executeUpdate();

            if (rowsAffected > 0) {
                System.out.println("✅ Agendamento " + idAgendamento + " deletado com sucesso do banco de dados");
                return true;
            } else {
                System.out.println("⚠️ Nenhum agendamento encontrado com ID: " + idAgendamento);
                return false;
            }

        } catch (SQLException ex) {
            System.err.println("❌ Erro ao cancelar agendamento: " + ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }

    /**
     * ✅ MÉTODO ALTERNATIVO: Soft delete (marca como inativo ao invés de deletar)
     * Use este se quiser manter o histórico no banco
     */
    public boolean desativarAgendamento(int idAgendamento) {
        String sql = "UPDATE questionario_agendamento SET ativo = false, updatedat = ? WHERE idagendamento = ?";

        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setTimestamp(1, Timestamp.valueOf(LocalDateTime.now()));
            ps.setInt(2, idAgendamento);
            int rowsAffected = ps.executeUpdate();

            if (rowsAffected > 0) {
                System.out.println("✅ Agendamento " + idAgendamento + " desativado com sucesso");
                return true;
            } else {
                System.out.println("⚠️ Nenhum agendamento encontrado com ID: " + idAgendamento);
                return false;
            }

        } catch (SQLException ex) {
            System.err.println("❌ Erro ao desativar agendamento: " + ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }

    private QuestionarioAgendamento mapResultSet(ResultSet rs) throws SQLException {
        QuestionarioAgendamento qa = new QuestionarioAgendamento();
        qa.setIdAgendamento(rs.getInt("idagendamento"));
        qa.setIdQuestionario(rs.getInt("idquestionario"));
        qa.setIdGestor(rs.getString("idgestor"));  // ✅ getString
        qa.setVersao(rs.getString("versao"));
        qa.setDataInicio(rs.getTimestamp("datainicio").toLocalDateTime());
        qa.setDataFim(rs.getTimestamp("datafim").toLocalDateTime());

        Array arr = rs.getArray("departamentos");
        if (arr != null) {
            qa.setDepartamentos((String[]) arr.getArray());
        }

        qa.setAtivo(rs.getBoolean("ativo"));
        qa.setCreatedAt(rs.getTimestamp("createdat") != null ? rs.getTimestamp("createdat").toLocalDateTime() : null);
        qa.setUpdatedAt(rs.getTimestamp("updatedat") != null ? rs.getTimestamp("updatedat").toLocalDateTime() : null);

        return qa;
    }
}