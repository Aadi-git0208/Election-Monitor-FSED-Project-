package VoteGuard.controller;

import VoteGuard.entity.User;
import VoteGuard.entity.Report;
import VoteGuard.entity.Election;
import VoteGuard.repository.UserRepository;
import VoteGuard.repository.ReportRepository;
import VoteGuard.repository.ElectionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ReportRepository reportRepo;

    @Autowired
    private ElectionRepository electionRepo;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {

        List<User> users = userRepo.findAll();
        List<Report> reports = reportRepo.findAll();
        List<Election> elections = electionRepo.findAll();

        long citizens = users.stream()
                .filter(u -> "citizen".equalsIgnoreCase(
                        u.getRole() == null ? "" : u.getRole().trim()))
                .count();

        long observers = users.stream()
                .filter(u -> "observer".equalsIgnoreCase(
                        u.getRole() == null ? "" : u.getRole().trim()))
                .count();

        long admins = users.stream()
                .filter(u -> "admin".equalsIgnoreCase(
                        u.getRole() == null ? "" : u.getRole().trim()))
                .count();

        long analysts = users.stream()
                .filter(u -> "analyst".equalsIgnoreCase(
                        u.getRole() == null ? "" : u.getRole().trim()))
                .count();

        Map<String, Object> response = new HashMap<>();

        response.put("totalCitizens", citizens);
        response.put("totalObservers", observers);
        response.put("totalAdmin", admins);
        response.put("totalAnalysts", analysts);
        response.put("totalReports", reports.size());
        response.put("totalElections", elections.size());

        return response;
    }
}