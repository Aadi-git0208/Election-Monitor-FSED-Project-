package VoteGuard.controller;

import VoteGuard.entity.Report;
import VoteGuard.repository.ReportRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    // 🔥 GET ALL REPORTS
    @GetMapping("/all")
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    // 🔥 ASSIGN OBSERVER
    @PutMapping("/assign/{id}")
    public Report assignObserver(@PathVariable Long id, @RequestParam String observer) {

        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setAssignedObserver(observer);
        report.setStatus("Assigned");

        return reportRepository.save(report);
    }

    // 🔥 ADD COMMENT
    @PutMapping("/comment/{id}")
    public Report addComment(@PathVariable Long id, @RequestParam String comment) {

        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setAdminComment(comment);

        return reportRepository.save(report);
    }
}