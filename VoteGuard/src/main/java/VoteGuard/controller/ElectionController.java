package VoteGuard.controller;

import VoteGuard.entity.Election;
import VoteGuard.repository.ElectionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elections")
@CrossOrigin("*")
public class ElectionController {

    @Autowired
    private ElectionRepository electionRepository;

    // 🔥 GET ALL
    @GetMapping("/all")
    public List<Election> getAll() {
        return electionRepository.findAll();
    }

    // 🔥 CREATE
    @PostMapping("/create")
    public Election create(@RequestBody Election election) {
        return electionRepository.save(election);
    }

    // 🔥 DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        electionRepository.deleteById(id);
        return "Election Deleted";
    }

    // 🔥 TOGGLE ACTIVE
    @PutMapping("/toggle/{id}")
    public Election toggle(@PathVariable Long id) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        election.setActive(!election.isActive());

        return electionRepository.save(election);
    }
}