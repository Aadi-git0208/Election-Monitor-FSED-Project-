package VoteGuard.repository;

import VoteGuard.entity.Election;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ElectionRepository extends JpaRepository<Election, Long> {

    // 🔹 Already existing (active elections)
    List<Election> findByActiveTrue();  

    // 🔥 NEW (IMPORTANT - observer ke liye)
    List<Election> findByObserverId(Long observerId);
}