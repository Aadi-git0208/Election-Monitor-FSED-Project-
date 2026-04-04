package VoteGuard.controller;

import VoteGuard.entity.Report;
import VoteGuard.repository.ReportRepository;
import VoteGuard.service.ReportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ReportService reportService;

    // ================= CREATE REPORT =================

    @PostMapping("/create")
    public Report createReport(@RequestBody Report report) {

        report.setDate(java.time.LocalDateTime.now());

        if (report.getStatus() == null) {
            report.setStatus("Pending");
        }

        return reportRepository.save(report);
    }

    // ================= GET ALL =================

    @GetMapping("/all")
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    // ================= ADMIN =================

    @PutMapping("/assign/{id}")
    public Report assignObserver(
            @PathVariable Long id,
            @RequestParam Long observerId,
            @RequestParam String observerName
    ) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setAssignedObserverId(observerId);   
        report.setAssignedObserver(observerName);   
        report.setStatus("Assigned");

        return reportRepository.save(report);
    }

    @PutMapping("/comment/{id}")
    public Report addComment(
            @PathVariable Long id,
            @RequestParam String comment
    ) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setAdminComment(comment);

        return reportRepository.save(report);
    }

    // ================= OBSERVER =================

    @GetMapping("/observer/{observerId}")
    public List<Report> getObserverReports(@PathVariable Long observerId) {
        return reportService.getReportsForObserver(observerId);
    }

    @PutMapping("/{id}/decision")
    public Report updateDecision(
            @PathVariable Long id,
            @RequestParam String decision,
            @RequestParam(required = false) String note,
            @RequestParam String observerName
    ) {
        return reportService.updateReportDecision(id, decision, note, observerName);
    }
}