package com.psysafe.dao;

import com.psysafe.database.Database;
import com.psysafe.model.*;

import java.sql.*;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

public class StatsDAO {
    
    // Método auxiliar para converter escala 1-5 para porcentagem de risco
    // 1 (bom) = 0% risco, 5 (ruim) = 100% risco
    private int convertToRiskPercentage(double avgValue) {
        // Converte de escala 1-5 para 0-100%
        // (valor - 1) / 4 * 100
        return (int) Math.round(((avgValue - 1) / 4.0) * 100);
    }
    
    // Método auxiliar para converter porcentagem de risco em nível
    private String calculateRiskLevel(int riskPercentage) {
        if (riskPercentage >= 75) return "critico";  // 4.0 - 5.0
        if (riskPercentage >= 50) return "alto";     // 3.0 - 3.99
        if (riskPercentage >= 25) return "medio";    // 2.0 - 2.99
        return "baixo";                               // 1.0 - 1.99
    }
    
    public int getTotalAvaliacoes(Date startDate) throws SQLException {
        String query = "SELECT COUNT(*) FROM resposta WHERE data_resposta >= ?";
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setDate(1, startDate);
            ResultSet rs = stmt.executeQuery();
            return rs.next() ? rs.getInt(1) : 0;
        }
    }
    
    public int getMediaRiscos(Date startDate) throws SQLException {
        String query = """
            SELECT AVG(ri.valor) as media
            FROM resposta r
            JOIN resposta_item ri ON r.id = ri.resposta_id
            WHERE r.data_resposta >= ?
        """;
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setDate(1, startDate);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                double media = rs.getDouble("media");
                return convertToRiskPercentage(media);
            }
            return 0;
        }
    }
    
    public int getAlertasAtivos(Date startDate) throws SQLException {
        String query = """
            SELECT COUNT(DISTINCT r.usuario_id) as alertas
            FROM resposta r
            JOIN resposta_item ri ON r.id = ri.resposta_id
            WHERE r.data_resposta >= ?
            GROUP BY r.usuario_id
            HAVING AVG(ri.valor) >= 3.0
        """;
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setDate(1, startDate);
            ResultSet rs = stmt.executeQuery();
            int count = 0;
            while (rs.next()) count++;
            return count;
        }
    }
    
    public Map<String, Integer> getTendenciaMensal() throws SQLException {
        String query = """
            SELECT 
                TO_CHAR(r.data_resposta, 'Month') as mes,
                AVG(ri.valor) as media
            FROM resposta r
            JOIN resposta_item ri ON r.id = ri.resposta_id
            WHERE r.data_resposta >= CURRENT_DATE - INTERVAL '6 months'
            GROUP BY TO_CHAR(r.data_resposta, 'Month'), EXTRACT(MONTH FROM r.data_resposta)
            ORDER BY EXTRACT(MONTH FROM r.data_resposta)
        """;
        
        Map<String, Integer> tendencia = new LinkedHashMap<>();
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                String mes = rs.getString("mes").trim().toLowerCase();
                double media = rs.getDouble("media");
                int riskPercentage = convertToRiskPercentage(media);
                tendencia.put(mes, riskPercentage);
            }
        }
        return tendencia;
    }
    
    public Map<String, Integer> getDistribuicaoRiscos(Date startDate) throws SQLException {
        String query = """
            WITH user_risks AS (
                SELECT 
                    r.usuario_id,
                    AVG(ri.valor) as risco_medio
                FROM resposta r
                JOIN resposta_item ri ON r.id = ri.resposta_id
                WHERE r.data_resposta >= ?
                GROUP BY r.usuario_id
            )
            SELECT 
                CASE 
                    WHEN risco_medio >= 4.0 THEN 'critico'
                    WHEN risco_medio >= 3.0 THEN 'alto'
                    WHEN risco_medio >= 2.0 THEN 'medio'
                    ELSE 'baixo'
                END as nivel,
                COUNT(*) as quantidade
            FROM user_risks
            GROUP BY nivel
        """;
        
        Map<String, Integer> distribuicao = new HashMap<>();
        distribuicao.put("baixo", 0);
        distribuicao.put("medio", 0);
        distribuicao.put("alto", 0);
        distribuicao.put("critico", 0);
        
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setDate(1, startDate);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                distribuicao.put(rs.getString("nivel"), rs.getInt("quantidade"));
            }
        }
        return distribuicao;
    }
    
    public List<DepartamentoStats> getTopDepartamentos(Date startDate) throws SQLException {
        String query = """
            SELECT 
                up.departamento as nome,
                COUNT(DISTINCT r.id) as avaliacoes,
                AVG(ri.valor) as media_risco
            FROM resposta r
            JOIN user_profile up ON r.usuario_id::text = up.user_id::text
            JOIN resposta_item ri ON r.id = ri.resposta_id
            WHERE r.data_resposta >= ?
            AND up.departamento IS NOT NULL
            GROUP BY up.departamento
            ORDER BY avaliacoes DESC
            LIMIT 5
        """;
        
        List<DepartamentoStats> departamentos = new ArrayList<>();
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setDate(1, startDate);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                double mediaRisco = rs.getDouble("media_risco");
                departamentos.add(new DepartamentoStats(
                    rs.getString("nome"),
                    rs.getInt("avaliacoes"),
                    convertToRiskPercentage(mediaRisco)
                ));
            }
        }
        return departamentos;
    }
    
    // Métodos para estatísticas pessoais
    public int getMinhasAvaliacoes(String userId, Date startDate) throws SQLException {
        String query = "SELECT COUNT(*) FROM resposta WHERE usuario_id = ? AND data_resposta >= ?";
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, userId);
            stmt.setDate(2, startDate);
            ResultSet rs = stmt.executeQuery();
            return rs.next() ? rs.getInt(1) : 0;
        }
    }
    
    public int getMeuNivelRisco(String userId, Date startDate) throws SQLException {
        String query = """
            SELECT AVG(ri.valor) as media
            FROM resposta r
            JOIN resposta_item ri ON r.id = ri.resposta_id
            WHERE r.usuario_id = ?
            AND r.data_resposta >= ?
        """;
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, userId);
            stmt.setDate(2, startDate);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                double media = rs.getDouble("media");
                return convertToRiskPercentage(media);
            }
            return 0;
        }
    }
    
    public int getRespostasPendentes(String userId) throws SQLException {
        String query = """
            SELECT COUNT(*) as pendentes
            FROM questionario q
            WHERE q.ativo = true
            AND NOT EXISTS (
                SELECT 1 FROM resposta r
                WHERE r.questionario_id = q.id
                AND r.usuario_id = ?
                AND r.data_resposta >= CURRENT_DATE - INTERVAL '30 days'
            )
        """;
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, userId);
            ResultSet rs = stmt.executeQuery();
            return rs.next() ? rs.getInt("pendentes") : 0;
        }
    }
    
    public Map<String, Integer> getTendenciaPessoal(String userId) throws SQLException {
        String query = """
            SELECT 
                TO_CHAR(r.data_resposta, 'Month') as mes,
                AVG(ri.valor) as media
            FROM resposta r
            JOIN resposta_item ri ON r.id = ri.resposta_id
            WHERE r.usuario_id = ?
            AND r.data_resposta >= CURRENT_DATE - INTERVAL '6 months'
            GROUP BY TO_CHAR(r.data_resposta, 'Month'), EXTRACT(MONTH FROM r.data_resposta)
            ORDER BY EXTRACT(MONTH FROM r.data_resposta)
        """;
        
        Map<String, Integer> tendencia = new LinkedHashMap<>();
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, userId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                String mes = rs.getString("mes").trim().toLowerCase();
                double media = rs.getDouble("media");
                // Para conformidade, invertemos: quanto menor o risco, maior a conformidade
                int riskPercentage = convertToRiskPercentage(media);
                int conformidade = 100 - riskPercentage;
                tendencia.put(mes, conformidade);
            }
        }
        return tendencia;
    }
    
    public List<RespostaHistorico> getHistoricoRespostas(String userId, Date startDate) throws SQLException {
        String query = """
            SELECT 
                r.data_resposta::date as data,
                q.titulo as questionario,
                AVG(ri.valor) as media
            FROM resposta r
            JOIN questionario q ON r.questionario_id = q.id
            JOIN resposta_item ri ON r.id = ri.resposta_id
            WHERE r.usuario_id = ?
            AND r.data_resposta >= ?
            GROUP BY r.id, r.data_resposta, q.titulo
            ORDER BY r.data_resposta DESC
            LIMIT 10
        """;
        
        List<RespostaHistorico> historico = new ArrayList<>();
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, userId);
            stmt.setDate(2, startDate);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                double media = rs.getDouble("media");
                int riskPercentage = convertToRiskPercentage(media);
                int pontuacao = 100 - riskPercentage; // Conformidade
                String nivelRisco = calculateRiskLevel(riskPercentage);
                
                historico.add(new RespostaHistorico(
                    rs.getDate("data").toLocalDate(),
                    rs.getString("questionario"),
                    pontuacao,
                    nivelRisco
                ));
            }
        }
        return historico;
    }
    
    public List<RadarData> getRadarData(String departamento, Date startDate) throws SQLException {
        StringBuilder query = new StringBuilder("""
            SELECT 
                p.categoria,
                AVG(ri.valor) as pontuacao
            FROM resposta r
            JOIN resposta_item ri ON r.id = ri.resposta_id
            JOIN pergunta p ON ri.pergunta_id = p.id
            JOIN user_profile up ON r.usuario_id::text = up.user_id::text
            WHERE r.data_resposta >= ?
        """);
        
        if (departamento != null && !departamento.equals("todos")) {
            query.append(" AND up.departamento = ?");
        }
        
        query.append("""
            GROUP BY p.categoria
            ORDER BY pontuacao DESC
        """);
        
        List<RadarData> dados = new ArrayList<>();
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query.toString())) {
            stmt.setDate(1, startDate);
            if (departamento != null && !departamento.equals("todos")) {
                stmt.setString(2, departamento);
            }
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                String categoria = rs.getString("categoria");
                if (categoria == null || categoria.isEmpty()) {
                    categoria = "Sem Categoria";
                }
                double pontuacao = rs.getDouble("pontuacao");
                dados.add(new RadarData(
                    categoria,
                    convertToRiskPercentage(pontuacao)
                ));
            }
        }
        return dados;
    }
    
    public List<Departamento> getDepartamentos() throws SQLException {
        String query = """
            SELECT DISTINCT departamento
            FROM user_profile
            WHERE departamento IS NOT NULL
            ORDER BY departamento
        """;
        
        List<Departamento> departamentos = new ArrayList<>();
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                String dept = rs.getString("departamento");
                departamentos.add(new Departamento(dept, dept));
            }
        }
        return departamentos;
    }
    
 // SUBSTITUIR os métodos getAlertsGestor e getAlertsPersonal no StatsDAO.java

    public List<Alert> getAlertsGestor() throws SQLException {
        List<Alert> alerts = new ArrayList<>();
        
        // 1. ALERTAS DE RISCO ALTO POR DEPARTAMENTO
        String queryRiscos = """
            SELECT 
                up.departamento,
                AVG(ri.valor) as risco_medio,
                COUNT(DISTINCT r.usuario_id) as usuarios_afetados,
                MAX(r.data_resposta) as data_recente
            FROM resposta r
            JOIN user_profile up ON r.usuario_id::text = up.user_id::text
            JOIN resposta_item ri ON r.id = ri.resposta_id
            WHERE r.data_resposta >= CURRENT_DATE - INTERVAL '30 days'
            AND up.departamento IS NOT NULL
            GROUP BY up.departamento
            HAVING AVG(ri.valor) >= 3.0
            ORDER BY AVG(ri.valor) DESC
            LIMIT 5
        """;
        
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(queryRiscos)) {
            int i = 0;
            while (rs.next()) {
                Alert alert = new Alert();
                alert.setId("alert-dept-" + i);
                alert.setTitulo("Risco Alto Detectado");
                double riscoMedio = rs.getDouble("risco_medio");
                int riskPercentage = convertToRiskPercentage(riscoMedio);
                int usuarios = rs.getInt("usuarios_afetados");
                alert.setDescricao(String.format(
                    "Departamento de %s apresenta risco psicossocial elevado (%.1f/5 - %d%%). %d funcionário(s) afetado(s).",
                    rs.getString("departamento"), 
                    riscoMedio,
                    riskPercentage,
                    usuarios
                ));
                alert.setDepartamento(rs.getString("departamento"));
                alert.setTipo("risco");
                alert.setData(rs.getTimestamp("data_recente").toLocalDateTime());
                alert.setNivel(riscoMedio >= 4.0 ? "critico" : "alto");
                alert.setStatus("pendente");
                alerts.add(alert);
                i++;
            }
        }
        
        // 2. ALERTAS DE AÇÕES CORRETIVAS PENDENTES
        String queryAcoes = """
            SELECT 
                id,
                titulo,
                departamento,
                nivel_risco,
                data_prazo,
                data_criacao,
                EXTRACT(DAY FROM (data_prazo - CURRENT_TIMESTAMP)) as dias_restantes
            FROM acao_corretiva
            WHERE status = 'pendente'
            AND data_prazo IS NOT NULL
            ORDER BY data_prazo ASC
            LIMIT 3
        """;
        
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(queryAcoes)) {
            while (rs.next()) {
                Alert alert = new Alert();
                alert.setId("alert-acao-" + rs.getString("id"));
                alert.setTitulo("Ação Corretiva Pendente");
                
                int diasRestantes = rs.getInt("dias_restantes");
                String urgencia = diasRestantes <= 7 ? "URGENTE" : diasRestantes <= 15 ? "ATENÇÃO" : "";
                
                alert.setDescricao(String.format(
                    "%s %s - Prazo: %d dias. Departamento: %s",
                    urgencia,
                    rs.getString("titulo"),
                    diasRestantes,
                    rs.getString("departamento")
                ));
                alert.setDepartamento(rs.getString("departamento"));
                alert.setTipo("acao");
                alert.setData(rs.getTimestamp("data_criacao").toLocalDateTime());
                alert.setNivel(rs.getString("nivel_risco"));
                alert.setStatus("pendente");
                alerts.add(alert);
            }
        }
        
        // 3. ALERTA DE TENDÊNCIA DE PIORA
        String queryTendencia = """
            WITH monthly_avg AS (
                SELECT 
                    up.departamento,
                    DATE_TRUNC('month', r.data_resposta) as mes,
                    AVG(ri.valor) as media
                FROM resposta r
                JOIN user_profile up ON r.usuario_id::text = up.user_id::text
                JOIN resposta_item ri ON r.id = ri.resposta_id
                WHERE r.data_resposta >= CURRENT_DATE - INTERVAL '2 months'
                AND up.departamento IS NOT NULL
                GROUP BY up.departamento, DATE_TRUNC('month', r.data_resposta)
                HAVING COUNT(DISTINCT r.id) >= 3
            ),
            trends AS (
                SELECT 
                    departamento,
                    mes,
                    media,
                    LAG(media) OVER (PARTITION BY departamento ORDER BY mes) as media_anterior
                FROM monthly_avg
            )
            SELECT 
                departamento,
                media,
                media_anterior,
                mes
            FROM trends
            WHERE media_anterior IS NOT NULL
            AND media > media_anterior
            AND media >= 3.0
            ORDER BY (media - media_anterior) DESC
            LIMIT 2
        """;
        
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(queryTendencia)) {
            int i = 0;
            while (rs.next()) {
                Alert alert = new Alert();
                alert.setId("alert-trend-" + i);
                alert.setTitulo("Tendência de Piora");
                double mediaAtual = rs.getDouble("media");
                double mediaAnterior = rs.getDouble("media_anterior");
                double aumento = ((mediaAtual - mediaAnterior) / mediaAnterior) * 100;
                
                alert.setDescricao(String.format(
                    "Departamento de %s apresenta piora de %.1f%% nos indicadores de risco no último mês.",
                    rs.getString("departamento"),
                    aumento
                ));
                alert.setDepartamento(rs.getString("departamento"));
                alert.setTipo("tendencia");
                alert.setData(rs.getTimestamp("mes").toLocalDateTime());
                alert.setNivel(mediaAtual >= 4.0 ? "critico" : "alto");
                alert.setStatus("pendente");
                alerts.add(alert);
                i++;
            }
        }
        
        // Se não houver alertas, criar um alerta informativo
        if (alerts.isEmpty()) {
            Alert alert = new Alert();
            alert.setId("alert-info-0");
            alert.setTitulo("Sistema Monitorado");
            alert.setDescricao("Nenhum alerta crítico detectado no momento. Continue monitorando regularmente.");
            alert.setTipo("info");
            alert.setData(LocalDateTime.now());
            alert.setNivel("baixo");
            alert.setStatus("info");
            alerts.add(alert);
        }
        
        return alerts;
    }

    public List<Alert> getAlertsPersonal(String userId) throws SQLException {
        List<Alert> alerts = new ArrayList<>();
        
        // 1. QUESTIONÁRIOS PENDENTES
        String queryPendentes = """
            SELECT q.id, q.titulo, q.data_criacao
            FROM questionario q
            WHERE q.ativo = true
            AND NOT EXISTS (
                SELECT 1 FROM resposta r
                WHERE r.questionario_id = q.id
                AND r.usuario_id = ?
                AND r.data_resposta >= CURRENT_DATE - INTERVAL '30 days'
            )
            ORDER BY q.data_criacao DESC
            LIMIT 3
        """;
        
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(queryPendentes)) {
            stmt.setString(1, userId);
            ResultSet rs = stmt.executeQuery();
            int i = 0;
            while (rs.next()) {
                Alert alert = new Alert();
                alert.setId("alert-quest-" + i);
                alert.setTitulo("Questionário Disponível");
                alert.setDescricao("Nova avaliação disponível: " + rs.getString("titulo"));
                alert.setTipo("questionario");
                alert.setData(rs.getTimestamp("data_criacao").toLocalDateTime());
                alert.setNivel("medio");
                alert.setStatus("pendente");
                alerts.add(alert);
                i++;
            }
        }
        
        // 2. MEU NÍVEL DE RISCO PESSOAL
        String queryRiscoPessoal = """
            SELECT 
                AVG(ri.valor) as risco_medio,
                MAX(r.data_resposta) as data_recente
            FROM resposta r
            JOIN resposta_item ri ON r.id = ri.resposta_id
            WHERE r.usuario_id = ?
            AND r.data_resposta >= CURRENT_DATE - INTERVAL '30 days'
            HAVING AVG(ri.valor) >= 3.0
        """;
        
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(queryRiscoPessoal)) {
            stmt.setString(1, userId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                Alert alert = new Alert();
                alert.setId("alert-personal-risk");
                alert.setTitulo("Atenção ao Seu Bem-estar");
                double riscoMedio = rs.getDouble("risco_medio");
                int riskPercentage = convertToRiskPercentage(riscoMedio);
                
                alert.setDescricao(String.format(
                    "Suas últimas avaliações indicam nível de risco elevado (%.1f/5 - %d%%). " +
                    "Considere conversar com seu gestor ou RH sobre suporte disponível.",
                    riscoMedio,
                    riskPercentage
                ));
                alert.setTipo("pessoal");
                alert.setData(rs.getTimestamp("data_recente").toLocalDateTime());
                alert.setNivel(riscoMedio >= 4.0 ? "critico" : "alto");
                alert.setStatus("pendente");
                alerts.add(alert);
            }
        }
        
        // 3. MINHA TENDÊNCIA PESSOAL
        String queryTendenciaPessoal = """
            WITH monthly_avg AS (
                SELECT 
                    DATE_TRUNC('month', r.data_resposta) as mes,
                    AVG(ri.valor) as media
                FROM resposta r
                JOIN resposta_item ri ON r.id = ri.resposta_id
                WHERE r.usuario_id = ?
                AND r.data_resposta >= CURRENT_DATE - INTERVAL '2 months'
                GROUP BY DATE_TRUNC('month', r.data_resposta)
                HAVING COUNT(DISTINCT r.id) >= 1
            ),
            trends AS (
                SELECT 
                    mes,
                    media,
                    LAG(media) OVER (ORDER BY mes) as media_anterior
                FROM monthly_avg
            )
            SELECT 
                media,
                media_anterior,
                mes
            FROM trends
            WHERE media_anterior IS NOT NULL
            AND media > media_anterior + 0.5
            ORDER BY mes DESC
            LIMIT 1
        """;
        
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(queryTendenciaPessoal)) {
            stmt.setString(1, userId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                Alert alert = new Alert();
                alert.setId("alert-personal-trend");
                alert.setTitulo("Mudança no Seu Perfil");
                double mediaAtual = rs.getDouble("media");
                double mediaAnterior = rs.getDouble("media_anterior");
                double aumento = ((mediaAtual - mediaAnterior) / mediaAnterior) * 100;
                
                alert.setDescricao(String.format(
                    "Suas avaliações recentes mostram aumento de %.1f%% nos indicadores de risco. " +
                    "Recursos de apoio estão disponíveis para você.",
                    aumento
                ));
                alert.setTipo("tendencia");
                alert.setData(rs.getTimestamp("mes").toLocalDateTime());
                alert.setNivel(mediaAtual >= 4.0 ? "alto" : "medio");
                alert.setStatus("pendente");
                alerts.add(alert);
            }
        }
        
        // Se não houver alertas, criar mensagem positiva
        if (alerts.isEmpty()) {
            Alert alert = new Alert();
            alert.setId("alert-personal-ok");
            alert.setTitulo("Tudo em Ordem");
            alert.setDescricao("Não há alertas no momento. Continue cuidando do seu bem-estar!");
            alert.setTipo("info");
            alert.setData(LocalDateTime.now());
            alert.setNivel("baixo");
            alert.setStatus("info");
            alerts.add(alert);
        }
        
        return alerts;
    }
    
    /**
     * Resolve um alerta, atualizando seu status para "resolvido"
     */
    public boolean resolverAlerta(String alertId, String acaoCorretivaId) throws Exception {
        String sql = "UPDATE alertas SET status = 'resolvido', data_resolucao = CURRENT_TIMESTAMP";
        
        if (acaoCorretivaId != null && !acaoCorretivaId.isEmpty()) {
            sql += ", acao_corretiva_id = ?";
        }
        
        sql += " WHERE id = ?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            int paramIndex = 1;
            if (acaoCorretivaId != null && !acaoCorretivaId.isEmpty()) {
                stmt.setString(paramIndex++, acaoCorretivaId);
            }
            stmt.setString(paramIndex, alertId);
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
            
        } catch (Exception e) {
            throw new Exception("Erro ao resolver alerta: " + e.getMessage(), e);
        }
    }
}