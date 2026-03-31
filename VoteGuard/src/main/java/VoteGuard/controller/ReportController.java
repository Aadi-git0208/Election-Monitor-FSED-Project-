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

    // GET ALL REPORTS
    @GetMapping
    public List<Report> getAll() {
        return service.getAll();
    }

    // ADD REPORT
    @PostMapping
    public Report add(@RequestBody Report r) {
        return service.save(r);
    }
}