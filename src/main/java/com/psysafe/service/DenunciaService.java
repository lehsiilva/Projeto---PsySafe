package com.psysafe.service;

import com.psysafe.dao.DenunciaDAO;
import com.psysafe.model.Denuncia;

import java.util.List;
import java.util.stream.Collectors; // Necessário se for manter o getAll() que filtra

public class DenunciaService {
    private final DenunciaDAO dao;

    public DenunciaService() {
        this.dao = new DenunciaDAO();
    }

    public List<Denuncia> getAll() {
        return dao.getAll();
    }

    public Denuncia getById(int id) {
        return dao.getById(id);
    }

    public Denuncia create(Denuncia denuncia) {
        return dao.insert(denuncia);
    }
    
    // Método antigo de getDenunciasRecebidas (sem parâmetro) pode ser mantido, mas é redundante.
    public List<Denuncia> getDenunciasRecebidas() {
        return dao.getAll().stream()
                .filter(d -> d.getDenunciante() != null)
                .collect(Collectors.toList());
    }
    
    
    public List<Denuncia> getDenunciasRecebidas(Integer idEmpresa) {
        if (idEmpresa == null) {
            // Retorna lista vazia se o usuário não tiver empresa atribuída.
            return List.of(); 
        }
        return dao.getDenunciasPorEmpresa(idEmpresa);
    }
    
    
    public void updateStatus(int id, boolean resolvido) {
        dao.updateStatus(id, resolvido);
    }
}
