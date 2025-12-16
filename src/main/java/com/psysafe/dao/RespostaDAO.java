package com.psysafe.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.psysafe.database.Database;
import com.psysafe.model.Resposta;
import com.psysafe.model.RespostaItem;

public class RespostaDAO {

    /**
     * Salva uma resposta completa (cabeçalho + itens) em uma transação
     * @param usuarioId ID do usuário (UUID como String)
     * @param questionarioId ID do questionário
     * @param itens Lista de respostas individuais
     * @return O UUID da resposta criada
     */
    public String salvarRespostaCompleta(String usuarioId, Integer questionarioId, 
                                         List<RespostaItem> itens) throws SQLException {
        
        Connection conn = null;
        PreparedStatement psResposta = null;
        PreparedStatement psItem = null;
        
        try {
            conn = Database.getConnection();
            conn.setAutoCommit(false); // Inicia transação
            
            // 1️⃣ GERAR UUID para a resposta
            String respostaUUID = UUID.randomUUID().toString();
            
            // 2️⃣ INSERIR na tabela RESPOSTA (cabeçalho)
            String sqlResposta = "INSERT INTO resposta(id, usuario_id, questionario_id, data_resposta, tempo_gasto) " +
                                 "VALUES (?, ?, ?, NOW(), ?)";
            
            psResposta = conn.prepareStatement(sqlResposta);
            psResposta.setString(1, respostaUUID);  // UUID da resposta
            psResposta.setString(2, usuarioId);     // ✅ CORRIGIDO: setString para UUID do usuário
            psResposta.setInt(3, questionarioId);
            psResposta.setInt(4, 0); // tempo_gasto pode ser 0 por enquanto
            
            int respostaInserted = psResposta.executeUpdate();
            
            if (respostaInserted == 0) {
                throw new SQLException("Falha ao inserir resposta principal");
            }
            
            System.out.println("✅ Resposta principal criada com UUID: " + respostaUUID);
            
            // 3️⃣ INSERIR todos os ITENS na tabela RESPOSTA_ITEM
            String sqlItem = "INSERT INTO resposta_item(resposta_id, pergunta_id, valor) " +
                            "VALUES (?, ?, ?)";
            
            psItem = conn.prepareStatement(sqlItem);
            
            for (RespostaItem item : itens) {
                psItem.setString(1, respostaUUID);
                psItem.setInt(2, item.getPerguntaId());
                psItem.setInt(3, item.getValor());
                psItem.addBatch();
            }
            
            int[] itemsInserted = psItem.executeBatch();
            
            System.out.println("✅ Itens inseridos: " + itemsInserted.length);
            
            // 4️⃣ COMMIT da transação
            conn.commit();
            
            System.out.println("✅✅✅ TRANSAÇÃO COMPLETA! Resposta salva com sucesso!");
            
            return respostaUUID;
            
        } catch (SQLException ex) {
            // ❌ Se der erro, faz ROLLBACK
            if (conn != null) {
                try {
                    System.err.println("❌ ERRO! Fazendo rollback...");
                    conn.rollback();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            System.err.println("❌ Erro ao salvar resposta completa: " + ex.getMessage());
            ex.printStackTrace();
            throw ex;
            
        } finally {
            // Fecha recursos
            try {
                if (psItem != null) psItem.close();
                if (psResposta != null) psResposta.close();
                if (conn != null) {
                    conn.setAutoCommit(true);
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * Busca todas as respostas de um usuário para um questionário
     */
    public List<RespostaItem> findItensByUsuarioAndQuestionario(String usuarioId, Integer questionarioId) {
        List<RespostaItem> items = new ArrayList<>();
        
        String sql = "SELECT ri.* FROM resposta_item ri " +
                     "INNER JOIN resposta r ON ri.resposta_id = r.id " +
                     "WHERE r.usuario_id = ? AND r.questionario_id = ? " +
                     "ORDER BY ri.pergunta_id";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, usuarioId);  // ✅ CORRIGIDO: setString para UUID
            ps.setInt(2, questionarioId);
            
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                RespostaItem item = new RespostaItem();
                item.setId(rs.getInt("id"));
                item.setRespostaId(rs.getString("resposta_id"));
                item.setPerguntaId(rs.getInt("pergunta_id"));
                item.setValor(rs.getInt("valor"));
                items.add(item);
            }
            
        } catch (SQLException ex) {
            System.err.println("Erro ao buscar itens de resposta: " + ex.getMessage());
            ex.printStackTrace();
        }
        
        return items;
    }

    /**
     * Verifica se já existe resposta do usuário para o questionário
     */
    public boolean existeResposta(String usuarioId, Integer questionarioId) {
        String sql = "SELECT 1 FROM resposta WHERE usuario_id = ? AND questionario_id = ? LIMIT 1";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, usuarioId);  // ✅ CORRIGIDO: setString para UUID
            ps.setInt(2, questionarioId);
            
            ResultSet rs = ps.executeQuery();
            return rs.next();
            
        } catch (SQLException ex) {
            System.err.println("Erro ao verificar existência: " + ex.getMessage());
            return false;
        }
    }

    /**
     * Busca todas as respostas (para relatórios)
     */
    public List<Resposta> findAll() {
        List<Resposta> list = new ArrayList<>();
        String sql = "SELECT * FROM resposta ORDER BY data_resposta DESC";
        
        try (Connection conn = Database.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            
            while (rs.next()) {
                Resposta r = new Resposta();
                r.setId(rs.getString("id"));
                r.setUsuarioId(rs.getString("usuario_id"));  // ✅ CORRIGIDO: getString para UUID
                r.setQuestionarioId(rs.getInt("questionario_id"));
                r.setDataResposta(rs.getTimestamp("data_resposta"));
                r.setTempoGasto(rs.getInt("tempo_gasto"));
                list.add(r);
            }
            
        } catch (SQLException ex) {
            System.err.println("Erro ao buscar todas as respostas: " + ex.getMessage());
            ex.printStackTrace();
        }
        
        return list;
    }
    
    /**
     * Busca uma resposta por ID
     */
    public Resposta findById(String id) {
        String sql = "SELECT * FROM resposta WHERE id = ?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, id);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                Resposta r = new Resposta();
                r.setId(rs.getString("id"));
                r.setUsuarioId(rs.getString("usuario_id"));  // ✅ CORRIGIDO: getString para UUID
                r.setQuestionarioId(rs.getInt("questionario_id"));
                r.setDataResposta(rs.getTimestamp("data_resposta"));
                r.setTempoGasto(rs.getInt("tempo_gasto"));
                return r;
            }
            
        } catch (SQLException ex) {
            System.err.println("Erro ao buscar resposta por ID: " + ex.getMessage());
            ex.printStackTrace();
        }
        
        return null;
    }
}