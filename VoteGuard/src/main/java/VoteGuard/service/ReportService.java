package VoteGuard.service;

import VoteGuard.entity.Report;
import VoteGuard.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository repo;

    // ================= COMMON =================

    public List<Report> getAllReports() {
        return repo.findAll();
    }

    public Report saveReport(Report report) {
        return repo.save(report);
    }

    // ================= ADMIN FEATURES =================

    public Report assignObserver(Long reportId, Long observerId, String observerName) {

        Report report = repo.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setAssignedObserverId(observerId);
        report.setAssignedObserver(observerName);
        report.setStatus("Assigned");

        return repo.save(report);
    }

    public Report addAdminComment(Long id, String comment) {

        Report report = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setAdminComment(comment);
        return repo.save(report);
    }

    // ================= CITIZEN FEATURES =================

    public Report submitReport(Report report) {
        report.setStatus("Pending");
        report.setDate(LocalDateTime.now());
        return repo.save(report);
    }

    public List<Report> getReportsByEmail(String email) {
        return repo.findByEmail(email);
    }

    // ================= OBSERVER FEATURES =================

    public List<Report> getReportsForObserver(Long observerId) {
        return repo.findByAssignedObserverId(observerId);
    }

    public Report updateReportDecision(Long reportId, String decision, String note, String observerName) {

        Report report = repo.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        if (decision.equalsIgnoreCase("verified")) {
            report.setStatus("Resolved");
        } else {
            report.setStatus("Rejected");
        }

        report.setObserverNote(note);
        report.setObserverActionBy(observerName);
        report.setObserverActionAt(LocalDateTime.now());

        return repo.save(report);
    }

    // ================= ANALYST FEATURES =================

    public Report analystReview(Long id, String priority, String tag, String comment) {

        Report report = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setAnalystReviewed(true);
        report.setAnalystPriority(priority);
        report.setAnalystTag(tag);
        report.setAnalystComment(comment);
        report.setAnalystReviewedAt(LocalDateTime.now());

        return repo.save(report);
    }

    public List<Report> getReportsByStatus(String status) {
        return repo.findByStatus(status);
    }

    public List<Report> getReportsByPriority(String priority) {
        return repo.findByAnalystPriority(priority);
    }

    public List<Report> getReportsByTag(String tag) {
        return repo.findByAnalystTag(tag);
    }

    public List<Report> getReportsByDateRange(LocalDateTime start, LocalDateTime end) {
        return repo.findByDateBetween(start, end);
    }

    // ================= EXTRA =================

    public Report updateStatus(Long id, String status) {

        Report report = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(status);
        return repo.save(report);
    }
}