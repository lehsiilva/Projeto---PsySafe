package com.psysafe.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.psysafe.database.Database;
import com.psysafe.model.QuestionarioPergunta;

public class QuestionarioPerguntaDAO {

    // Salvar uma pergunta de questionário
    public QuestionarioPergunta save(QuestionarioPergunta qp) {
        String sql = "INSERT INTO public.questionario_pergunta(id_questionario, id_pergunta, num_pergunta) " +
                     "VALUES (?, ?, ?) RETURNING id_questionario_pergunta";
        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, qp.getIdQuestionario());
            ps.setInt(2, qp.getIdPergunta());
            ps.setInt(3, qp.getNumPergunta());

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                qp.setIdQuestionarioPergunta(rs.getInt("id_questionario_pergunta"));
            }
            return qp;

        } catch (SQLException ex) {
            ex.printStackTrace();
            return null;
        }
    }

    // Listar todas as perguntas de questionários
    public List<QuestionarioPergunta> findAll() {
        List<QuestionarioPergunta> list = new ArrayList<>();
        String sql = "SELECT * FROM public.questionario_pergunta ORDER BY id_questionario, num_pergunta";

        try (Connection conn = Database.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                QuestionarioPergunta qp = new QuestionarioPergunta();
                qp.setIdQuestionarioPergunta(rs.getInt("id_questionario_pergunta"));
                qp.setIdQuestionario(rs.getInt("id_questionario"));
                qp.setIdPergunta(rs.getInt("id_pergunta"));
                qp.setNumPergunta(rs.getInt("num_pergunta"));
                list.add(qp);
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return list;
    }

    // Listar perguntas por id do questionário
    public List<QuestionarioPergunta> findByQuestionarioId(int idQuestionario) {
        List<QuestionarioPergunta> list = new ArrayList<>();
        String sql = "SELECT * FROM public.questionario_pergunta WHERE id_questionario=? ORDER BY num_pergunta";

        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, idQuestionario);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                QuestionarioPergunta qp = new QuestionarioPergunta();
                qp.setIdQuestionarioPergunta(rs.getInt("id_questionario_pergunta"));
                qp.setIdQuestionario(rs.getInt("id_questionario"));
                qp.setIdPergunta(rs.getInt("id_pergunta"));
                qp.setNumPergunta(rs.getInt("num_pergunta"));
                list.add(qp);
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return list;
    }
}
