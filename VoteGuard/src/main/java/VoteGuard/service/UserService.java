package VoteGuard.service;

import VoteGuard.entity.User;
import VoteGuard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    // ================= ADMIN FEATURES =================

    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public User saveUser(User user) {
        return repo.save(user);
    }

    public void deleteUser(Long id) {
        repo.deleteById(id);
    }

    // ================= CITIZEN FEATURES =================

    public User register(User user) {
        return repo.save(user);
    }

    public User login(String email, String password) {
        User user = repo.findByEmail(email);

        if (user != null && user.getPassword().equals(password)) {

            if(user.isBlocked()){
                throw new RuntimeException("User is blocked by admin");
            }

            return user;
        }
        return null;
    }
}