package VoteGuard.repository;

import VoteGuard.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    // ================= CITIZEN =================
    List<Report> findByEmail(String email);

    // ================= OBSERVER =================
    List<Report> findByAssignedObserverId(Long observerId);
    List<Report> findByAssignedObserverIgnoreCase(String assignedObserver);

    // ================= ANALYST (🔥 NEW) =================

    List<Report> findByStatus(String status);

    List<Report> findByCategory(String category);

    List<Report> findByLocation(String location);

    List<Report> findByAnalystReviewed(Boolean reviewed);

    List<Report> findByAnalystPriority(String priority);

    List<Report> findByAnalystTag(String tag);

    List<Report> findByDateBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

    List<Report> findByStatusAndCategory(String status, String category);

    List<Report> findByStatusAndLocation(String status, String location);

    List<Report> findByStatusIn(List<String> statuses);
}