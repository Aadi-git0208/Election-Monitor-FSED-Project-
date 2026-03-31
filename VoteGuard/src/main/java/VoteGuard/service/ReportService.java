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

    public List<Report> getAll() {
        return repo.findAll();
    }

    public Report save(Report r) {
        return repo.save(r);
    }
}