package VoteGuard.repository;

import VoteGuard.entity.Election;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ElectionRepository extends JpaRepository<Election, Long> {

    List<Election> findByActiveTrue();  

    List<Election> findByObserverId(Long observerId);
}