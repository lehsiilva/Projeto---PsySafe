package com.psysafe.controller;

import java.time.LocalDate;
import com.google.gson.Gson;
import com.psysafe.model.Denuncia;
import com.psysafe.service.DenunciaService;
import com.psysafe.util.JwtUtil;
import spark.Request;
import spark.Response;

public class DenunciaController {
    private final DenunciaService service;
    // Assumindo que GsonUtil.getGson() existe e retorna um objeto Gson configurado
    private final Gson gson = com.psysafe.util.GsonUtil.getGson(); 

    public DenunciaController(DenunciaService service) {
        this.service = service;
        routes();
    }

    private void routes() {
        spark.Spark.get("/api/denuncias", this::getAll, gson::toJson);
        // A rota /recebidas deve vir antes de /:id para evitar conflitos de rota
        spark.Spark.get("/api/denuncias/recebidas", this::getRecebidas, gson::toJson); 
        spark.Spark.get("/api/denuncias/:id", this::getById, gson::toJson);
        spark.Spark.post("/api/denuncias", this::create, gson::toJson);
        spark.Spark.put("/api/denuncias/:id/status", this::updateStatus, gson::toJson);
    }

    private Object getAll(Request req, Response res) {
        res.type("application/json");
        return service.getAll();
    }

    private Object getById(Request req, Response res) {
        res.type("application/json");
        // Tratamento de exceção para Integer.parseInt em ambiente de produção é recomendado
        try {
            return service.getById(Integer.parseInt(req.params(":id")));
        } catch (NumberFormatException e) {
            res.status(400);
            return gson.toJson(new Error("ID de denúncia inválido."));
        }
    }

    private Object create(Request req, Response res) {
        res.type("application/json");

        try {
            Denuncia denuncia = gson.fromJson(req.body(), Denuncia.class);

            // Validação mínima de campos obrigatórios
            if (denuncia.getTitulo() == null || denuncia.getDescricao() == null ||
                denuncia.getTipo() == null || denuncia.getDenunciado() == null) {
                res.status(400);
                return gson.toJson(new Error("Campos obrigatórios ausentes: titulo, descricao, tipo ou denunciado"));
            }

            // Preencher data automaticamente se não fornecida
            if (denuncia.getData() == null) {
                denuncia.setData(LocalDate.now());
            }

            String authHeader = req.headers("Authorization");
            
            // Lógica para preencher denunciante e idEmpresa:
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                // Preenche denunciante caso NÃO seja anônima
                if (!denuncia.isAnonima()) {
                    String nomeUsuario = JwtUtil.getUserName(token);
                    denuncia.setDenunciante(nomeUsuario);
                } else {
                    // Garante que o denunciante é nulo se for anônima
                    denuncia.setDenunciante(null); 
                }

                // 🔹 ESSENCIAL: Preenche idEmpresa do usuário logado (usado tanto para anônimas quanto identificadas)
                Integer idEmpresa = JwtUtil.getUserEmpresaId(token);
                denuncia.setIdEmpresa(idEmpresa);

            } else {
                // Denúncia sem token/usuário logado. Assumida como anônima e sem idEmpresa (Pode requerer autenticação ou tratamento específico)
                denuncia.setDenunciante(null);
                denuncia.setIdEmpresa(null); // Denúncias sem idEmpresa podem ser ignoradas por gestores
            }

            Denuncia created = service.create(denuncia);
            res.status(201);
            return created;

        } catch (IllegalArgumentException e) {
            res.status(400);
            return gson.toJson(new Error("Erro de validação: " + e.getMessage()));
        } catch (Exception e) {
            res.status(500);
            e.printStackTrace();
            return gson.toJson(new Error("Erro ao criar denúncia: " + e.getMessage()));
        }
    }

    /**
     * 🚧 CORREÇÃO CRÍTICA: Atualiza apenas o status 'resolvido' usando o método 
     * dedicado do Service/DAO, evitando a duplicação (insert) da denúncia.
     */
    private Object updateStatus(Request req, Response res) {
        res.type("application/json");
        int id;
        try {
            id = Integer.parseInt(req.params(":id"));
        } catch (NumberFormatException e) {
            res.status(400);
            return gson.toJson(new Error("ID de denúncia inválido."));
        }
        
        // Assume que o corpo da requisição só precisa ter o campo 'resolvido'
        Denuncia updatePayload = gson.fromJson(req.body(), Denuncia.class);

        // 1. Verifica se a denúncia existe antes de tentar atualizar
        Denuncia d = service.getById(id);
        if (d == null) {
            res.status(404);
            return gson.toJson(new Error("Denúncia não encontrada."));
        }
        
        // 2. Chama o método do Service que apenas atualiza o status no DAO
        service.updateStatus(id, updatePayload.isResolvido()); 
        
        // 3. Atualiza o objeto para retorno e confirma o sucesso
        d.setResolvido(updatePayload.isResolvido());
        return d;
    }

    /**
     * 🔹 Lista denúncias recebidas. O filtro de visibilidade (TODAS de uma empresa) 
     * é delegado ao service/DAO, usando o ID da empresa logada.
     */
    private Object getRecebidas(Request req, Response res) throws Exception {
        res.type("application/json");
        String authHeader = req.headers("Authorization");
        Integer idEmpresa = null;
        
        // 1. Extrai o idEmpresa do gestor logado
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            idEmpresa = JwtUtil.getUserEmpresaId(token);
        }
        
        if (idEmpresa == null) {
            res.status(401);
            return gson.toJson(new Error("Acesso negado. Token inválido ou idEmpresa ausente."));
        }

        // 2. Chama o service que agora busca TODAS as denúncias associadas àquele idEmpresa
        return service.getDenunciasRecebidas(idEmpresa);
    }

    // Classes de erro
    class Error {
        String message;
        public Error(String message) { this.message = message; }
    }
}