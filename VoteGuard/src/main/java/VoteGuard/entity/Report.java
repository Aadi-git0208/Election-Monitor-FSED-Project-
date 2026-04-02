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

    @Column(name = "assigned_observer")
    private String assignedObserver;

    private String category;

    @Column(name = "user_id")
    private Long userId;

    private String email;

    @Column(name = "user_name")
    private String userName;

    private String location;
    private String image;

    private LocalDateTime date = LocalDateTime.now(); // 🔥 auto date

    @Column(name = "admin_comment")
    private String adminComment;

    @Column(name = "observer_action_by")
    private String observerActionBy;

    @Column(name = "observer_note")
    private String observerNote;

    @Column(name = "observer_action_at")
    private LocalDateTime observerActionAt;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    // 🔥 default status
    public void setStatus(String status) {
        this.status = (status == null || status.isEmpty())
                ? "Pending"
                : status;
    }

    public String getAssignedObserver() {
        return assignedObserver;
    }

    public void setAssignedObserver(String assignedObserver) {
        this.assignedObserver = assignedObserver;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    // 🔥 email normalize
    public void setEmail(String email) {
        this.email = email.toLowerCase();
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getImage() {
        return image;
    }

    // 🔥 default image
    public void setImage(String image) {
        this.image = (image == null || image.isEmpty())
                ? "/no-image.png"
                : image;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getAdminComment() {
        return adminComment;
    }

    public void setAdminComment(String adminComment) {
        this.adminComment = adminComment;
    }

    public String getObserverActionBy() {
        return observerActionBy;
    }

    public void setObserverActionBy(String observerActionBy) {
        this.observerActionBy = observerActionBy;
    }

    public String getObserverNote() {
        return observerNote;
    }

    public void setObserverNote(String observerNote) {
        this.observerNote = observerNote;
    }

    public LocalDateTime getObserverActionAt() {
        return observerActionAt;
    }

    public void setObserverActionAt(LocalDateTime observerActionAt) {
        this.observerActionAt = observerActionAt;
    }
}