package VoteGuard.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "elections") // optional but good practice
public class Election {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String startDate;
    private String endDate;

    private boolean active = false; // default safe value

    // 🔥 candidates list (for frontend)
    @ElementCollection
    @CollectionTable(name = "election_candidates", joinColumns = @JoinColumn(name = "election_id"))
    @Column(name = "candidate_name")
    private List<String> candidates;

    // ================= GETTERS & SETTERS =================

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public List<String> getCandidates() {
        return candidates;
    }

    public void setCandidates(List<String> candidates) {
        this.candidates = candidates;
    }
}