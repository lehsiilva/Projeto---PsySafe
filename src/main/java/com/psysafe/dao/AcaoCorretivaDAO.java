package com.psysafe.dao;

import com.psysafe.database.Database;
import com.psysafe.model.AlertContext;
import java.sql.*;
import java.util.*;

public class AcaoCorretivaDAO {
    
    // Busca contexto detalhado do alerta para análise da LLM
    public AlertContext getAlertContext(String departamento) throws SQLException {
        AlertContext context = new AlertContext();
        context.setDepartamento(departamento);
        
        // Buscar média de risco do departamento
        String queryMedia = """
            SELECT 
                AVG(ri.valor) as media_risco,
                COUNT(DISTINCT r.id) as total_avaliacoes
            FROM resposta r
            JOIN user_profile up ON r.usuario_id::text = up.user_id::text
            JOIN resposta_item ri ON r.id = ri.resposta_id
            WHERE up.departamento = ?
            AND r.data_resposta >= CURRENT_DATE - INTERVAL '30 days'
        """;
        
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(queryMedia)) {
            stmt.setString(1, departamento);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                double media = rs.getDouble("media_risco");
                int mediaRiscoPercentual = (int) Math.round(((media - 1) / 4.0) * 100);
                context.setMediaRisco(mediaRiscoPercentual);
                context.setTotalAvaliacoes(rs.getInt("total_avaliacoes"));
                
                // Calcular e definir o nível de risco baseado na média
                String nivelRisco;
                if (mediaRiscoPercentual >= 75) {
                    nivelRisco = "critico";
                } else if (mediaRiscoPercentual >= 50) {
                    nivelRisco = "alto";
                } else if (mediaRiscoPercentual >= 25) {
                    nivelRisco = "medio";
                } else {
                    nivelRisco = "baixo";
                }
                context.setNivel(nivelRisco);
            }
        }
        
        // Buscar distribuição por categoria
        // CORREÇÃO: Buscar o nome da subescala (categoria)
        String queryCategoria = """
            SELECT 
                s.nome as categoria,
                AVG(ri.valor) as pontuacao
            FROM resposta r
            JOIN user_profile up ON r.usuario_id::text = up.user_id::text
            JOIN resposta_item ri ON r.id = ri.resposta_id
            JOIN pergunta p ON ri.pergunta_id = p.id
            JOIN subescala s ON p.subescala_id = s.id
            WHERE up.departamento = ?
            AND r.data_resposta >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY s.nome
            ORDER BY pontuacao DESC
        """;
        
        Map<String, Integer> categorias = new LinkedHashMap<>();
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(queryCategoria)) {
            stmt.setString(1, departamento);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                String cat = rs.getString("categoria");
                if (cat != null && !cat.isEmpty()) {
                    double pontuacao = rs.getDouble("pontuacao");
                    int riskPercentage = (int) Math.round(((pontuacao - 1) / 4.0) * 100);
                    categorias.put(cat, riskPercentage);
                }
            }
        }
        context.setDistribuicaoCategorias(categorias);
        
        // Analisar tendência
        String queryTendencia = """
            WITH monthly_avg AS (
                SELECT 
                    EXTRACT(MONTH FROM r.data_resposta) as mes,
                    AVG(ri.valor) as media
                FROM resposta r
                JOIN user_profile up ON r.usuario_id::text = up.user_id::text
                JOIN resposta_item ri ON r.id = ri.resposta_id
                WHERE up.departamento = ?
                AND r.data_resposta >= CURRENT_DATE - INTERVAL '3 months'
                GROUP BY EXTRACT(MONTH FROM r.data_resposta)
                ORDER BY mes
            )
            SELECT 
                CASE 
                    WHEN LAG(media) OVER (ORDER BY mes) < media THEN 'piorando'
                    WHEN LAG(media) OVER (ORDER BY mes) > media THEN 'melhorando'
                    ELSE 'estavel'
                END as tendencia
            FROM monthly_avg
            ORDER BY mes DESC
            LIMIT 1
        """;
        
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(queryTendencia)) {
            stmt.setString(1, departamento);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                context.setTendenciaRecente(rs.getString("tendencia"));
            }
        }
        
        return context;
    }
    
    // Salvar ação corretiva no banco
    public String saveAcaoCorretiva(com.psysafe.model.AcaoCorretiva acao) throws SQLException {
        String query = """
            INSERT INTO acao_corretiva (
                titulo, descricao, departamento, nivel_risco, prioridade,
                responsavel, data_criacao, data_prazo, status,
                medidas_sugeridas, analise_detalhada, impacto_esperado, recursos_necessarios
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING id
        """;
        
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, acao.getTitulo());
            stmt.setString(2, acao.getDescricao());
            stmt.setString(3, acao.getDepartamento());
            stmt.setString(4, acao.getNivelRisco());
            stmt.setString(5, acao.getPrioridade());
            stmt.setString(6, acao.getResponsavel());
            stmt.setTimestamp(7, Timestamp.valueOf(acao.getDataCriacao()));
            stmt.setTimestamp(8, acao.getDataPrazo() != null ? 
                Timestamp.valueOf(acao.getDataPrazo()) : null);
            stmt.setString(9, acao.getStatus());
            
            // Converter lista para JSON string
            String medidasJson = String.join("|", acao.getMedidasSugeridas());
            stmt.setString(10, medidasJson);
            stmt.setString(11, acao.getAnaliseDetalhada());
            stmt.setString(12, acao.getImpactoEsperado());
            stmt.setString(13, acao.getRecursosNecessarios());
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getString("id");
            }
        }
        return null;
    }
}