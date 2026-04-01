package VoteGuard.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "reports") // optional but good practice
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    private String status = "Pending"; // default safe

    private String assignedObserver;
    private String category;

    // 🔥 CITIZEN SIDE
    private Long userId;
    private String email;
    private String userName;

    private String location;
    private String image;

    private String date;

    // 🔥 ADMIN RESPONSE
    private String adminComment;

    // 🔥 OBSERVER ACTION
    private String observerActionBy;
    private String observerNote;
    private String observerActionAt;

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

    public void setStatus(String status) {
        // 🔥 normalize (optional safe)
        this.status = status;
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

    public void setEmail(String email) {
        this.email = email;
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

    public void setImage(String image) {
        this.image = image;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
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

    public String getObserverActionAt() {
        return observerActionAt;
    }

    public void setObserverActionAt(String observerActionAt) {
        this.observerActionAt = observerActionAt;
    }
}