package VoteGuard.controller;

import VoteGuard.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/system")
@CrossOrigin("*")
public class SystemController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ReportRepository reportRepo;

    @Autowired
    private ElectionRepository electionRepo;

    @GetMapping("/data")
    public Map<String, Object> getAllData() {

        Map<String, Object> map = new HashMap<>();

        map.put("users", userRepo.findAll());
        map.put("reports", reportRepo.findAll());
        map.put("elections", electionRepo.findAll());
        map.put("notifications", new ArrayList<>());

        return map;
    }
}