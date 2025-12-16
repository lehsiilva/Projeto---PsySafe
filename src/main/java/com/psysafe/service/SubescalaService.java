package com.psysafe.service;

import java.sql.SQLException;
import java.util.List;

import com.psysafe.dao.SubescalaDAO;
import com.psysafe.model.Subescala;

public class SubescalaService {

    private SubescalaDAO subescalaDAO = new SubescalaDAO();

    public List<Subescala> getAllSubescalas() throws SQLException {
        return subescalaDAO.findAllByOrderByOrdem();
    }

    public Subescala createSubescala(Subescala s) throws SQLException {
        return subescalaDAO.save(s);
    }
}
