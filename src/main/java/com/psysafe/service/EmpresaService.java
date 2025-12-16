package com.psysafe.service;

import com.psysafe.dao.EmpresaDAO;
import com.psysafe.database.Database;
import com.psysafe.model.Empresa;
import com.psysafe.model.MembroEquipe;
import com.psysafe.model.Equipe;

import java.sql.Connection;
import java.util.List;
import java.util.UUID;

public class EmpresaService {

    public Empresa getMyEmpresa(String userId) throws Exception {
        try (Connection conn = Database.getConnection()) {
            EmpresaDAO dao = new EmpresaDAO(conn);
            return dao.findEmpresaByUserId(UUID.fromString(userId));
        }
    }

    public List<MembroEquipe> getGestores(String userId) throws Exception {
        try (Connection conn = Database.getConnection()) {
            EmpresaDAO dao = new EmpresaDAO(conn);
            // retorna lista vazia se não houver gestores
            List<MembroEquipe> gestores = dao.findGestoresByUserId(UUID.fromString(userId));
            return gestores != null ? gestores : java.util.Collections.emptyList();
        }
    }

    public List<Equipe> getEquipes(String userId) throws Exception {
        try (Connection conn = Database.getConnection()) {
            EmpresaDAO dao = new EmpresaDAO(conn);
            return dao.findEquipesByUserId(UUID.fromString(userId));
        }
    }
}
