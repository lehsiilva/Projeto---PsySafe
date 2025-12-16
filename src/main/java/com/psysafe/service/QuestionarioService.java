package com.psysafe.service;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.psysafe.dao.PerguntaDAO;
import com.psysafe.dao.QuestionarioAgendamentoDAO;
import com.psysafe.dao.QuestionarioDAO;
import com.psysafe.dao.QuestionarioPerguntaDAO;
import com.psysafe.dao.RespostaDAO;
import com.psysafe.dao.SubescalaDAO;
import com.psysafe.dao.UsuarioDAO;
import com.psysafe.model.Pergunta;
import com.psysafe.model.Questionario;
import com.psysafe.model.QuestionarioAgendamento;
import com.psysafe.model.QuestionarioPergunta;
import com.psysafe.model.Resposta;
import com.psysafe.model.RespostaItem;
import com.psysafe.model.Subescala;
import com.psysafe.model.Usuario;

public class QuestionarioService {

    private QuestionarioDAO questionarioDAO;
    private PerguntaDAO perguntaDAO;
    private QuestionarioPerguntaDAO questionarioPerguntaDAO;
    private RespostaDAO respostaDAO;
    private QuestionarioAgendamentoDAO agendamentoDAO;
    private UsuarioDAO usuarioDAO;
    private SubescalaDAO subescalaDAO;

    public QuestionarioService() {
        this.questionarioDAO = new QuestionarioDAO();
        this.perguntaDAO = new PerguntaDAO();
        this.questionarioPerguntaDAO = new QuestionarioPerguntaDAO();
        this.respostaDAO = new RespostaDAO();
        this.agendamentoDAO = new QuestionarioAgendamentoDAO();
        this.usuarioDAO = new UsuarioDAO();
        this.subescalaDAO = new SubescalaDAO();
    }

    // ==================== QUESTIONÁRIOS ====================

    public Questionario createQuestionario(Questionario q) {
        return questionarioDAO.save(q);
    }

    public List<Questionario> getAllQuestionarios() {
        return questionarioDAO.findAll();
    }

    public Questionario getQuestionarioById(int idQuestionario) {
        return questionarioDAO.findById(idQuestionario);
    }

    // ==================== PERGUNTAS ====================

    public List<Map<String, Object>> getPerguntasByQuestionarioId(int idQuestionario) {
        List<Map<String, Object>> resultado = new ArrayList<>();
        
        System.out.println("========================================");
        System.out.println("🔍 BUSCANDO PERGUNTAS PARA QUESTIONÁRIO: " + idQuestionario);
        System.out.println("========================================");
        
        try {
            List<QuestionarioPergunta> qps = questionarioPerguntaDAO.findByQuestionarioId(idQuestionario);
            System.out.println("📊 Total de associações encontradas: " + qps.size());
            
            if (qps.isEmpty()) {
                System.out.println("⚠️ NENHUMA associação encontrada! Listando TODAS as perguntas...");
                List<Pergunta> todasPerguntas = perguntaDAO.findAll();
                System.out.println("📋 Total de perguntas na tabela: " + todasPerguntas.size());
                
                if (todasPerguntas.isEmpty()) {
                    System.err.println("❌❌❌ ERRO CRÍTICO! Não há perguntas na tabela 'pergunta'!");
                    return resultado;
                }
                
                System.out.println("✅ Primeira pergunta encontrada: " + todasPerguntas.get(0).getTexto());
                
                for (int i = 0; i < todasPerguntas.size(); i++) {
                    Pergunta p = todasPerguntas.get(i);
                    Map<String, Object> perguntaMap = montarPerguntaCompleta(p, i + 1);
                    resultado.add(perguntaMap);
                    
                    if (i < 3) {
                        System.out.println("   📝 Pergunta " + (i+1) + ": " + p.getTexto());
                    }
                }
                
                System.out.println("========================================");
                System.out.println("✅ RETORNANDO: " + resultado.size() + " perguntas (TODAS)");
                System.out.println("========================================");
                return resultado;
            }
            
            System.out.println("✅ Processando " + qps.size() + " associações encontradas...");
            
            for (int i = 0; i < qps.size(); i++) {
                QuestionarioPergunta qp = qps.get(i);
                System.out.println("   🔗 Associação " + (i+1) + ": id_pergunta=" + qp.getIdPergunta() + ", num_pergunta=" + qp.getNumPergunta());
                
                Pergunta pergunta = perguntaDAO.findById(qp.getIdPergunta());
                
                if (pergunta != null) {
                    Map<String, Object> perguntaMap = montarPerguntaCompleta(pergunta, qp.getNumPergunta());
                    resultado.add(perguntaMap);
                    
                    if (i < 3) {
                        System.out.println("      ✅ Pergunta montada: " + pergunta.getTexto());
                    }
                } else {
                    System.err.println("      ❌ ERRO: Pergunta com ID " + qp.getIdPergunta() + " não encontrada!");
                }
            }
            
            System.out.println("========================================");
            System.out.println("✅ RETORNANDO: " + resultado.size() + " perguntas (ASSOCIADAS)");
            System.out.println("========================================");
            
        } catch (Exception e) {
            System.err.println("❌❌❌ ERRO FATAL ao buscar perguntas!");
            e.printStackTrace();
        }
        
        return resultado;
    }

    private Map<String, Object> montarPerguntaCompleta(Pergunta pergunta, int numeroPergunta) {
        Map<String, Object> perguntaMap = new HashMap<>();
        
        perguntaMap.put("id", pergunta.getId());
        perguntaMap.put("conteudo", pergunta.getTexto());
        perguntaMap.put("numero", numeroPergunta);
        perguntaMap.put("subescalaId", pergunta.getSubescalaId());
        
        if (pergunta.getSubescalaId() != null) {
            try {
                Subescala subescala = subescalaDAO.findById(pergunta.getSubescalaId());
                
                if (subescala != null) {
                    Map<String, Object> subescalaMap = new HashMap<>();
                    subescalaMap.put("id", subescala.getIdSubescala());
                    subescalaMap.put("nome", subescala.getNome());
                    subescalaMap.put("tipoResposta", criarTipoRespostaPadrao());
                    perguntaMap.put("subescala", subescalaMap);
                } else {
                    perguntaMap.put("subescala", criarSubescalaPadrao(pergunta.getSubescalaId()));
                }
            } catch (Exception e) {
                System.err.println("⚠️ Erro ao buscar subescala " + pergunta.getSubescalaId() + ": " + e.getMessage());
                perguntaMap.put("subescala", criarSubescalaPadrao(pergunta.getSubescalaId()));
            }
        } else {
            perguntaMap.put("subescala", criarSubescalaPadrao(0));
        }
        
        return perguntaMap;
    }

    private Map<String, String> criarTipoRespostaPadrao() {
        Map<String, String> tipoResposta = new HashMap<>();
        tipoResposta.put("opcao1", "Nunca/Quase Nunca");
        tipoResposta.put("opcao2", "Raramente");
        tipoResposta.put("opcao3", "Às vezes");
        tipoResposta.put("opcao4", "Frequentemente");
        tipoResposta.put("opcao5", "Sempre");
        return tipoResposta;
    }

    private Map<String, Object> criarSubescalaPadrao(Integer subescalaId) {
        Map<String, Object> subescala = new HashMap<>();
        subescala.put("id", subescalaId != null ? subescalaId : 0);
        subescala.put("nome", "Subescala " + (subescalaId != null ? subescalaId : "Padrão"));
        subescala.put("tipoResposta", criarTipoRespostaPadrao());
        return subescala;
    }

    public List<Map<String, Object>> getPerguntasByVersao(int idQuestionario, String versao) {
        List<Map<String, Object>> todasPerguntas = getPerguntasByQuestionarioId(idQuestionario);
        
        switch (versao.toLowerCase()) {
            case "curta":
                return todasPerguntas.stream().limit(20).collect(Collectors.toList());
            case "media":
                return todasPerguntas.stream().limit(50).collect(Collectors.toList());
            case "longa":
            default:
                return todasPerguntas;
        }
    }

    // ==================== RESPOSTAS ====================

    public void salvarRespostas(String idUsuario, int idQuestionario, Map<String, Object> requestBody) throws Exception {
        System.out.println("🚀 Iniciando salvamento de respostas...");
        System.out.println("👤 Usuário ID (UUID): " + idUsuario);
        System.out.println("📋 Questionário ID: " + idQuestionario);
        
        List<Map<String, Object>> respostas = (List<Map<String, Object>>) requestBody.get("respostas");
        
        if (respostas == null || respostas.isEmpty()) {
            throw new Exception("Nenhuma resposta fornecida");
        }
        
        System.out.println("📊 Total de respostas recebidas: " + respostas.size());
        
        boolean jaRespondeu = respostaDAO.existeResposta(idUsuario, idQuestionario);
        
        if (jaRespondeu) {
            throw new Exception("Você já respondeu este questionário");
        }
        
        List<RespostaItem> itens = new ArrayList<>();
        
        for (Map<String, Object> respostaItem : respostas) {
            Integer idPergunta = ((Number) respostaItem.get("idPergunta")).intValue();
            Integer valor = ((Number) respostaItem.get("valor")).intValue();
            
            RespostaItem item = new RespostaItem();
            item.setPerguntaId(idPergunta);
            item.setValor(valor);
            
            itens.add(item);
            
            System.out.println("   ✅ Item adicionado - Pergunta: " + idPergunta + ", Valor: " + valor);
        }
        
        try {
            String respostaUUID = respostaDAO.salvarRespostaCompleta(idUsuario, idQuestionario, itens);
            System.out.println("✅✅✅ SUCESSO! Resposta salva com UUID: " + respostaUUID);
        } catch (SQLException ex) {
            System.err.println("❌ ERRO SQL ao salvar: " + ex.getMessage());
            throw new Exception("Erro ao salvar respostas: " + ex.getMessage());
        }
    }

    public List<Map<String, Object>> getResultadosByUserId(String idUsuario) {
        List<Map<String, Object>> resultados = new ArrayList<>();
        
        try {
            List<Resposta> todasRespostas = respostaDAO.findAll().stream()
                .filter(r -> r.getUsuarioId() != null && r.getUsuarioId().equals(idUsuario))
                .collect(Collectors.toList());
            
            Map<Integer, List<Resposta>> respostasPorQuestionario = new HashMap<>();
            
            for (Resposta resposta : todasRespostas) {
                Integer qId = resposta.getQuestionarioId();
                if (!respostasPorQuestionario.containsKey(qId)) {
                    respostasPorQuestionario.put(qId, new ArrayList<>());
                }
                respostasPorQuestionario.get(qId).add(resposta);
            }
            
            for (Map.Entry<Integer, List<Resposta>> entry : respostasPorQuestionario.entrySet()) {
                int idQuestionario = entry.getKey();
                
                Questionario questionario = questionarioDAO.findById(idQuestionario);
                if (questionario != null) {
                    List<RespostaItem> itens = respostaDAO.findItensByUsuarioAndQuestionario(idUsuario, idQuestionario);
                    
                    Map<String, Object> resultado = new HashMap<>();
                    resultado.put("idQuestionario", idQuestionario);
                    resultado.put("tituloQuestionario", questionario.getTitulo());
                    resultado.put("idUsuario", idUsuario);
                    resultado.put("totalPerguntas", getPerguntasByQuestionarioId(idQuestionario).size());
                    resultado.put("perguntasRespondidas", itens.size());
                    resultado.put("completo", itens.size() >= getPerguntasByQuestionarioId(idQuestionario).size());
                    
                    double media = itens.stream()
                        .mapToDouble(RespostaItem::getValor)
                        .average()
                        .orElse(0.0);
                    resultado.put("mediaGeral", media);
                    
                    resultados.add(resultado);
                }
            }
            
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar resultados: " + e.getMessage());
            e.printStackTrace();
        }
        
        return resultados;
    }

    // ==================== AGENDAMENTOS ====================

    /**
     * Agenda um novo questionário.
     * Inclui a correção para o parsing de datas no formato ISO 8601 que contém 'Z' ou '.000Z'.
     */
    public Map<String, Object> agendarQuestionario(String idGestor, Map<String, Object> requestBody) throws Exception {
        System.out.println("========================================");
        System.out.println("🔧 SERVICE: Processando agendamento");
        System.out.println("========================================");
        System.out.println("👤 ID Gestor (UUID): " + idGestor);
        
        try {
            Integer idQuestionario = ((Number) requestBody.get("idQuestionario")).intValue();
            String versao = (String) requestBody.get("versao");
            String dataInicioStr = (String) requestBody.get("dataInicio");
            String dataFimStr = (String) requestBody.get("dataFim");
            List<String> departamentosList = (List<String>) requestBody.get("departamentos");
            
            if (idQuestionario == null || versao == null || dataInicioStr == null || dataFimStr == null || departamentosList == null) {
                System.err.println("❌ ERRO: Dados incompletos para agendamento");
                throw new Exception("Dados incompletos para agendamento");
            }
            
            // CORREÇÃO: Remove sufixos comuns do formato ISO (como ".000Z" ou "Z") 
            // para que LocalDateTime.parse() possa funcionar.
            dataInicioStr = dataInicioStr.replace(".000Z", "").replace("Z", "");
            dataFimStr = dataFimStr.replace(".000Z", "").replace("Z", "");
            
            LocalDateTime dataInicio = LocalDateTime.parse(dataInicioStr);
            LocalDateTime dataFim = LocalDateTime.parse(dataFimStr);
            
            System.out.println("📅 Datas parseadas com sucesso: Início=" + dataInicio + ", Fim=" + dataFim);
            
            QuestionarioAgendamento agendamento = new QuestionarioAgendamento();
            agendamento.setIdQuestionario(idQuestionario);
            agendamento.setIdGestor(idGestor);
            agendamento.setVersao(versao);
            agendamento.setDataInicio(dataInicio);
            agendamento.setDataFim(dataFim);
            agendamento.setDepartamentos(departamentosList.toArray(new String[0]));
            agendamento.setAtivo(true);
            agendamento.setCreatedAt(LocalDateTime.now());
            agendamento.setUpdatedAt(LocalDateTime.now());
            
            System.out.println("🔄 Chamando DAO.save()...");
            
            QuestionarioAgendamento saved = agendamentoDAO.save(agendamento);
            
            if (saved == null) {
                throw new Exception("Erro ao salvar agendamento - DAO retornou null");
            }
            
            System.out.println("✅ Agendamento salvo com sucesso! ID: " + saved.getIdAgendamento());
            
            Map<String, Object> response = montarAgendamentoResponse(saved);
            
            System.out.println("========================================");
            
            return response;
            
        } catch (Exception e) {
            System.err.println("❌ ERRO FATAL no Service ao agendar questionário:");
            System.err.println("   Mensagem: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Retorna TODOS os agendamentos ativos, ignorando o parâmetro idGestor.
     * @param idGestor O ID do gestor (agora ignorado).
     * @return Uma lista de Mapas representando os agendamentos.
     */
    public List<Map<String, Object>> getAgendamentos(String idGestor) {
        // ✅ MUDANÇA: Retornar TODOS os agendamentos ativos, independente do gestor
        List<QuestionarioAgendamento> agendamentos = agendamentoDAO.findAtivosOrderByCreatedAtDesc();
        
        System.out.println("📋 Buscando TODOS os agendamentos ativos. Total encontrado: " + agendamentos.size());
        
        // Retorna todos os agendamentos encontrados
        System.out.println("✅ Retornando " + agendamentos.size() + " agendamentos para o usuário " + idGestor);
        return agendamentos.stream()
            .map(this::montarAgendamentoResponse)
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAgendamentosAtivos(String idGestor) {
        List<QuestionarioAgendamento> agendamentos = agendamentoDAO.findAtivosOrderByCreatedAtDesc();
        
        if (idGestor != null) {
            agendamentos = agendamentos.stream()
                .filter(a -> a.getIdGestor().equals(idGestor))
                .collect(Collectors.toList());
        }
        
        return agendamentos.stream()
            .map(this::montarAgendamentoResponse)
            .collect(Collectors.toList());
    }

    /**
     * ✅ MÉTODO CORRIGIDO: Cancela (deleta) um agendamento usando o DAO
     */
    public void cancelarAgendamento(int idAgendamento) throws Exception {
        System.out.println("========================================");
        System.out.println("🗑️ SERVICE: Cancelando agendamento ID: " + idAgendamento);
        System.out.println("========================================");
        
        // Verifica se o agendamento existe
        List<QuestionarioAgendamento> todos = agendamentoDAO.findAll();
        boolean existe = todos.stream()
            .anyMatch(a -> a.getIdAgendamento().equals(idAgendamento));
        
        if (!existe) {
            System.err.println("❌ Agendamento " + idAgendamento + " não encontrado");
            throw new Exception("Agendamento não encontrado");
        }
        
        // ✅ Chama o método de cancelamento do DAO
        boolean sucesso = agendamentoDAO.cancelarAgendamento(idAgendamento);
        
        if (!sucesso) {
            System.err.println("❌ Falha ao cancelar agendamento " + idAgendamento);
            throw new Exception("Falha ao cancelar agendamento no banco de dados");
        }
        
        System.out.println("✅ Agendamento " + idAgendamento + " cancelado com sucesso!");
        System.out.println("========================================");
    }

    public Map<String, Object> getResultadosAgendamento(int idAgendamento) throws Exception {
        List<QuestionarioAgendamento> todos = agendamentoDAO.findAll();
        QuestionarioAgendamento agendamento = todos.stream()
            .filter(a -> a.getIdAgendamento().equals(idAgendamento))
            .findFirst()
            .orElseThrow(() -> new Exception("Agendamento não encontrado"));
        
        Questionario questionario = questionarioDAO.findById(agendamento.getIdQuestionario());
        
        List<Usuario> usuarios = usuarioDAO.findAll().stream()
            .filter(u -> Arrays.asList(agendamento.getDepartamentos()).contains(u.getDepartamento()))
            .collect(Collectors.toList());
        
        List<Resposta> respostas = respostaDAO.findAll().stream()
            .filter(r -> r.getQuestionarioId().equals(agendamento.getIdQuestionario()))
            .filter(r -> usuarios.stream().anyMatch(u -> u.getId().equals(r.getUsuarioId())))
            .collect(Collectors.toList());
        
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("agendamento", montarAgendamentoResponse(agendamento));
        resultado.put("questionario", questionario);
        resultado.put("totalParticipantes", usuarios.size());
        resultado.put("totalRespostas", respostas.size());
        resultado.put("taxaResposta", usuarios.isEmpty() ? 0 : (respostas.size() * 100.0 / usuarios.size()));
        
        return resultado;
    }

    private Map<String, Object> montarAgendamentoResponse(QuestionarioAgendamento agendamento) {
        Map<String, Object> response = new HashMap<>();
        
        Questionario questionario = questionarioDAO.findById(agendamento.getIdQuestionario());
        
        // Simulação de nome do gestor, pois a busca real não está implementada
        String nomeGestor = "Gestor"; 
        
        int totalParticipantes = (int) usuarioDAO.findAll().stream()
            .filter(u -> Arrays.asList(agendamento.getDepartamentos()).contains(u.getDepartamento()))
            .count();
        
        int totalRespostas = (int) respostaDAO.findAll().stream()
            .filter(r -> r.getQuestionarioId().equals(agendamento.getIdQuestionario()))
            .count();
        
        response.put("id", agendamento.getIdAgendamento());
        response.put("idQuestionario", agendamento.getIdQuestionario());
        response.put("tituloQuestionario", questionario != null ? questionario.getTitulo() : "");
        response.put("idGestor", agendamento.getIdGestor());
        response.put("nomeGestor", nomeGestor);
        response.put("versao", agendamento.getVersao());
        response.put("dataInicio", agendamento.getDataInicio().toString());
        response.put("dataFim", agendamento.getDataFim().toString());
        response.put("departamentos", Arrays.asList(agendamento.getDepartamentos()));
        response.put("ativo", agendamento.getAtivo());
        response.put("totalParticipantes", totalParticipantes);
        response.put("totalRespostas", totalRespostas);
        response.put("createdAt", agendamento.getCreatedAt() != null ? agendamento.getCreatedAt().toString() : "");
        
        return response;
    }
}