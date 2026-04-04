package VoteGuard.controller;

import VoteGuard.entity.Report;
import VoteGuard.entity.Election;
import VoteGuard.service.ReportService;
import VoteGuard.service.ElectionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/analyst")
@CrossOrigin(origins = "*")
public class AnalystController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private ElectionService electionService;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardData() {

        List<Report> reports = reportService.getAllReports();
        List<Election> elections = electionService.getAll();

        Map<String, Object> response = new HashMap<>();
        response.put("reports", reports);
        response.put("elections", elections);

        return response;
    }

    @GetMapping("/reports")
    public List<Report> getAllReports() {
        return reportService.getAllReports();
    }

    @GetMapping("/elections")
    public List<Election> getAllElections() {
        return electionService.getAll();
    }
}