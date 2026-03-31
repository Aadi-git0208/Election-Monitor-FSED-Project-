package VoteGuard.controller;

import VoteGuard.entity.Report;
import VoteGuard.service.ReportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ReportController {

    @Autowired
    private ReportService service;

    // ================= ADMIN =================

    // GET ALL REPORTS
    @GetMapping
    public List<Report> getAll() {
        return service.getAll();
    }

    // ADD REPORT (admin side)
    @PostMapping
    public Report add(@RequestBody Report r) {
        return service.save(r);
    }

    // ================= CITIZEN =================

    // SUBMIT REPORT (citizen)
    @PostMapping("/submit")
    public Report submit(@RequestBody Report r) {
        return service.submitReport(r);
    }

    // GET USER REPORTS
    @GetMapping("/user/{email}")
    public List<Report> getUserReports(@PathVariable String email) {
        return service.getReportsByEmail(email);
    }

    // ================= ADMIN / OBSERVER =================

    // UPDATE STATUS
    @PutMapping("/{id}/status")
    public Report updateStatus(@PathVariable Long id,
                               @RequestParam String status) {
        return service.updateStatus(id, status);
    }
}