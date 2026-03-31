package VoteGuard.controller;

import VoteGuard.entity.Election;
import VoteGuard.service.ElectionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elections")
@CrossOrigin("*")
public class ElectionController {

    @Autowired
    private ElectionService service;

    // GET ALL
    @GetMapping
    public List<Election> getAll() {
        return service.getAll();
    }

    // CREATE
    @PostMapping
    public Election create(@RequestBody Election e) {
        return service.save(e);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}