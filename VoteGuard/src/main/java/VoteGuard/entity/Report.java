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

    // ================= OBSERVER =================

    @Column(name = "assigned_observer")
    private String assignedObserver;

    @Column(name = "assigned_observer_id")
    private Long assignedObserverId;

    // ================= ANALYST =================

    @Column(name = "analyst_reviewed")
    private Boolean analystReviewed = false;

    @Column(name = "analyst_priority")
    private String analystPriority;

    @Column(name = "analyst_tag")
    private String analystTag;

    @Column(name = "analyst_comment")
    private String analystComment;

    @Column(name = "analyst_reviewed_at")
    private LocalDateTime analystReviewedAt;

    // ================= USER =================

    private String category;

    @Column(name = "user_id")
    private Long userId;

    private String email;

    @Column(name = "user_name")
    private String userName;

    private String location;

    private LocalDateTime date = LocalDateTime.now();

    // ================= ADMIN =================

    @Column(name = "admin_comment")
    private String adminComment;

    // ================= OBSERVER ACTION =================

    @Column(name = "observer_action_by")
    private String observerActionBy;

    @Column(name = "observer_note")
    private String observerNote;

    @Column(name = "observer_action_at")
    private LocalDateTime observerActionAt;

    // ================= GETTERS & SETTERS =================

    public Long getId() { return id; }

    // -------- BASIC --------

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) {
        this.status = (status == null || status.isEmpty()) ? "Pending" : status;
    }

    // -------- OBSERVER --------

    public String getAssignedObserver() { return assignedObserver; }
    public void setAssignedObserver(String assignedObserver) {
        this.assignedObserver = assignedObserver;
    }

    public Long getAssignedObserverId() { return assignedObserverId; }
    public void setAssignedObserverId(Long assignedObserverId) {
        this.assignedObserverId = assignedObserverId;
    }

    // -------- ANALYST--------

    public Boolean isAnalystReviewed() { return analystReviewed; }

    public void setAnalystReviewed(Boolean analystReviewed) {
        this.analystReviewed = analystReviewed;
    }

    public String getAnalystPriority() { return analystPriority; }
    public void setAnalystPriority(String analystPriority) {
        this.analystPriority = analystPriority;
    }

    public String getAnalystTag() { return analystTag; }
    public void setAnalystTag(String analystTag) {
        this.analystTag = analystTag;
    }

    public String getAnalystComment() { return analystComment; }
    public void setAnalystComment(String analystComment) {
        this.analystComment = analystComment;
    }

    public LocalDateTime getAnalystReviewedAt() { return analystReviewedAt; }
    public void setAnalystReviewedAt(LocalDateTime analystReviewedAt) {
        this.analystReviewedAt = analystReviewedAt;
    }

    // -------- USER --------

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

    // -------- ADMIN --------

    public String getAdminComment() { return adminComment; }
    public void setAdminComment(String adminComment) {
        this.adminComment = adminComment;
    }

    // -------- OBSERVER ACTION --------

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