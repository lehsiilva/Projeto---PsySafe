package com.psysafe.service;

import com.psysafe.dao.StatsDAO;
import com.psysafe.model.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class StatsService {
    private final StatsDAO statsDAO;

    public StatsService() {
        this.statsDAO = new StatsDAO();
    }

    public Object getOverviewStats(String timeRange, String userId, String role) throws Exception {
        Date startDate = calculateStartDate(timeRange);

        if ("funcionario".equals(role) && userId != null) {
            return getPersonalStats(userId, startDate);
        } else {
            return getManagerStats(startDate);
        }
    }

    private OverviewStats getManagerStats(Date startDate) throws Exception {
        OverviewStats stats = new OverviewStats();

        stats.setTotalAvaliacoes(statsDAO.getTotalAvaliacoes(startDate));

        int mediaRiscos = statsDAO.getMediaRiscos(startDate);
        stats.setMediaRiscos(mediaRiscos);
        stats.setNivelConformidade(100 - mediaRiscos);

        stats.setAlertasAtivos(statsDAO.getAlertasAtivos(startDate));
        stats.setTendenciaMensal(statsDAO.getTendenciaMensal());
        stats.setDistribuicaoRiscos(statsDAO.getDistribuicaoRiscos(startDate));
        stats.setTopDepartamentos(statsDAO.getTopDepartamentos(startDate));

        return stats;
    }

    private PersonalStats getPersonalStats(String userId, Date startDate) throws Exception {
        PersonalStats stats = new PersonalStats();

        stats.setMinhasAvaliacoes(statsDAO.getMinhasAvaliacoes(userId, startDate));

        int meuRisco = statsDAO.getMeuNivelRisco(userId, startDate);
        stats.setMeuNivelRisco(meuRisco);
        stats.setMinhaConformidade(100 - meuRisco);

        stats.setMinhasRespostasPendentes(statsDAO.getRespostasPendentes(userId));
        stats.setTendenciaPessoal(statsDAO.getTendenciaPessoal(userId));
        stats.setMinhasRespostas(statsDAO.getHistoricoRespostas(userId, startDate));

        return stats;
    }

    public List<Alert> getAlerts(String userId, String role) throws Exception {
        if ("funcionario".equals(role) && userId != null) {
            return statsDAO.getAlertsPersonal(userId);
        } else {
            return statsDAO.getAlertsGestor();
        }
    }

    public List<RadarData> getRadarData(String departamento, String timeRange) throws Exception {
        Date startDate = calculateStartDate(timeRange);
        return statsDAO.getRadarData(departamento, startDate);
    }

    public List<Departamento> getDepartamentos() throws Exception {
        return statsDAO.getDepartamentos();
    }

    /**
     * Resolve um alerta, marcando-o como resolvido
     * @param alertId ID do alerta a ser resolvido
     * @param acaoCorretivaId ID da ação corretiva associada (opcional)
     * @return true se resolvido com sucesso
     * @throws Exception se houver erro
     */
    public boolean resolverAlerta(String alertId, String acaoCorretivaId) throws Exception {
        return statsDAO.resolverAlerta(alertId, acaoCorretivaId);
    }

    private Date calculateStartDate(String timeRange) {
        LocalDate now = LocalDate.now();
        LocalDate startDate;

        switch (timeRange) {
            case "30dias":
                startDate = now.minusDays(30);
                break;
            case "3meses":
                startDate = now.minusMonths(3);
                break;
            case "6meses":
                startDate = now.minusMonths(6);
                break;
            case "1ano":
                startDate = now.minusYears(1);
                break;
            default:
                startDate = now.minusMonths(6);
        }

        return Date.valueOf(startDate);
    }
}