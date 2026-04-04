package VoteGuard.service;

import VoteGuard.entity.Election;
import VoteGuard.repository.ElectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ElectionService {

    @Autowired
    private ElectionRepository repo;

    // ================= ADMIN FEATURES =================

    public List<Election> getAll() {
        return repo.findAll();
    }

    public Election save(Election e) {
        return repo.save(e);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public Election assignElection(Long electionId, Long observerId) {
        Election election = repo.findById(electionId).orElse(null);

        if (election != null) {
            election.setObserverId(observerId);
            return repo.save(election);
        }

        return null;
    }

    // ================= CITIZEN FEATURES =================

    public List<Election> getActiveElections() {
        return repo.findByActiveTrue();
    }

    // ================= OBSERVER FEATURES =================

    // 🔥 NEW: Get elections for observer
    public List<Election> getObserverElections(Long observerId) {
        return repo.findByObserverId(observerId);
    }
}