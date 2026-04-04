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

    @GetMapping("/all")
    public List<Election> getAll() {
        return electionRepository.findAll();
    }

    @PostMapping("/create")
    public Election create(@RequestBody Election election) {
        return electionRepository.save(election);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        electionRepository.deleteById(id);
        return "Election Deleted";
    }

    @PutMapping("/toggle/{id}")
    public Election toggle(@PathVariable Long id) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        election.setActive(!election.isActive());

        return electionRepository.save(election);
    }

    @GetMapping("/observer/{observerId}")
    public List<Election> getObserverElections(@PathVariable Long observerId) {
        return electionRepository.findByObserverId(observerId);
    }
}