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

    // ================= ADMIN FEATURES =================

    public List<Report> getAll() {
        return repo.findAll();
    }

    public Report save(Report r) {
        return repo.save(r);
    }

    // 🔥 Assign report to observer
    public Report assignReport(Long reportId, Long observerId, String observerName) {
        Report report = repo.findById(reportId).orElse(null);

        if (report != null) {
            report.setAssignedObserverId(observerId);   // 🔥 important
            report.setAssignedObserver(observerName);   // optional (for display)
            report.setStatus("Assigned");

            return repo.save(report);
        }

        return null;
    }

    // ================= CITIZEN FEATURES =================

    public Report submitReport(Report report) {
        report.setStatus("Pending");
        return repo.save(report);
    }

    public List<Report> getReportsByEmail(String email) {
        return repo.findByEmail(email);
    }

    // ================= OBSERVER FEATURES =================

    // 🔥 Get reports assigned to observer
    public List<Report> getReportsForObserver(Long observerId) {
        return repo.findByAssignedObserverId(observerId);
    }

    // 🔥 Verify / Reject / Note
    public Report updateReportDecision(Long reportId, String decision, String note, String observerName) {

        Report report = repo.findById(reportId).orElse(null);

        if (report != null) {

            // ✅ decision logic
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

        return null;
    }

    // ================= EXTRA (WORKFLOW) =================

    public Report updateStatus(Long id, String status) {
        Report report = repo.findById(id).orElse(null);

        if (report != null) {
            report.setStatus(status);
            return repo.save(report);
        }

        return null;
    }
}