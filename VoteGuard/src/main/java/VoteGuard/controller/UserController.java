package VoteGuard.controller;

import VoteGuard.entity.User;
import VoteGuard.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService service;

    // ================= ADMIN =================

    // GET ALL USERS
    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    // ADD USER
    @PostMapping
    public User addUser(@RequestBody User user) {
        return service.saveUser(user);
    }

    // DELETE USER
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
    }

    // ================= CITIZEN =================

    // REGISTER
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    // LOGIN
    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return service.login(user.getEmail(), user.getPassword());
    }
}