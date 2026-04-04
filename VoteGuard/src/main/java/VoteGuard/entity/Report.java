package VoteGuard.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "report")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    private String status = "Pending";

    // OLD (for display)
    @Column(name = "assigned_observer")
    private String assignedObserver;

    // NEW (IMPORTANT 🔥)
    @Column(name = "assigned_observer_id")
    private Long assignedObserverId;

    private String category;

    @Column(name = "user_id")
    private Long userId;

    private String email;

    @Column(name = "user_name")
    private String userName;

    private String location;

    private LocalDateTime date = LocalDateTime.now();

    @Column(name = "admin_comment")
    private String adminComment;

    @Column(name = "observer_action_by")
    private String observerActionBy;

    @Column(name = "observer_note")
    private String observerNote;

    @Column(name = "observer_action_at")
    private LocalDateTime observerActionAt;

    // ================= GETTERS & SETTERS =================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) {
        this.status = (status == null || status.isEmpty()) ? "Pending" : status;
    }

    public String getAssignedObserver() { return assignedObserver; }
    public void setAssignedObserver(String assignedObserver) {
        this.assignedObserver = assignedObserver;
    }

    public Long getAssignedObserverId() { return assignedObserverId; }
    public void setAssignedObserverId(Long assignedObserverId) {
        this.assignedObserverId = assignedObserverId;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) {
        this.email = (email == null) ? "" : email.toLowerCase();
    }

    public String getUserName() { return userName; }
    public void setUserName(String userName) {
        this.userName = (userName == null) ? "Citizen" : userName;
    }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public String getAdminComment() { return adminComment; }
    public void setAdminComment(String adminComment) { this.adminComment = adminComment; }

    public String getObserverActionBy() { return observerActionBy; }
    public void setObserverActionBy(String observerActionBy) {
        this.observerActionBy = observerActionBy;
    }

    public String getObserverNote() { return observerNote; }
    public void setObserverNote(String observerNote) {
        this.observerNote = observerNote;
    }

    public LocalDateTime getObserverActionAt() { return observerActionAt; }
    public void setObserverActionAt(LocalDateTime observerActionAt) {
        this.observerActionAt = observerActionAt;
    }
}