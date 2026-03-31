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

    public List<Election> getAll() {
        return repo.findAll();
    }

    public Election save(Election e) {
        return repo.save(e);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}