package VoteGuard.service;

import VoteGuard.dto.LoginRequest;
import VoteGuard.dto.SignupRequest;
import VoteGuard.entity.User;
import VoteGuard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public String register(SignupRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists ❌";
        }

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );

        userRepository.save(user);

        return "User registered successfully ✅";
    }

    public User login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found ❌"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password ❌");
        }

        if (!user.getRole().equalsIgnoreCase(request.getRole())) {
            throw new RuntimeException("Role mismatch ❌");
        }

        if (user.isBlocked()) {
            throw new RuntimeException("User is blocked ❌");
        }

        return user;
    }
}