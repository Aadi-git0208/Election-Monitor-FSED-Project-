package VoteGuard.repository;

import VoteGuard.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    // 🔹 Citizen ke liye (already tha)
    List<Report> findByEmail(String email);

    // 🔥 Observer ke liye (NEW - IMPORTANT)
    List<Report> findByAssignedObserverId(Long observerId);

    // 🔥 Optional (agar name-based bhi rakhna hai fallback ke liye)
    List<Report> findByAssignedObserverIgnoreCase(String assignedObserver);
}