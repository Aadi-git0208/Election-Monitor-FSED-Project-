package VoteGuard.service;

import VoteGuard.entity.Report;
import VoteGuard.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    // ================= CITIZEN FEATURES =================

    public Report submitReport(Report report) {
        report.setStatus("Pending"); // 🔥 default status
        return repo.save(report);
    }

    public List<Report> getReportsByEmail(String email) {
        return repo.findByEmail(email);
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