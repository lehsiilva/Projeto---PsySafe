package com.psysafe.service;

import com.psysafe.dao.AcaoCorretivaDAO;
import com.psysafe.model.AlertContext;
import com.psysafe.model.AcaoCorretiva;

public class AcaoCorretivaService {
    private final AcaoCorretivaDAO dao;
    private final LLMService llmService;

    public AcaoCorretivaService() {
        this.dao = new AcaoCorretivaDAO();
        this.llmService = new LLMService();
    }

    public AcaoCorretiva gerarECriarAcaoCorretiva(String departamento, String responsavel) throws Exception {
        // 1. Buscar contexto do alerta
        AlertContext context = dao.getAlertContext(departamento);

        // 2. Gerar ação corretiva com LLM
        AcaoCorretiva acao = llmService.gerarAcaoCorretiva(context);

        // 3. Adicionar responsável
        acao.setResponsavel(responsavel);

        // 4. Salvar no banco
        String id = dao.saveAcaoCorretiva(acao);
        acao.setId(id);

        return acao;
    }
}