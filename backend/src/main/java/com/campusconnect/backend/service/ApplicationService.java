package com.campusconnect.backend.service;

import com.campusconnect.backend.entity.Application;
import com.campusconnect.backend.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private NotificationService notificationService;

    // Save a new application
    public Application saveApplication(Application application) {

        application.setAppliedDate(LocalDateTime.now());

        if (application.getStatus() == null ||
                application.getStatus().isEmpty()) {

            application.setStatus("Applied");
        }

        return applicationRepository.save(application);
    }

    // Get all applications
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    // Get application by ID
    public Optional<Application> getApplicationById(Long id) {
        return applicationRepository.findById(id);
    }

    // Get applications by student ID
    public List<Application> getApplicationsByStudentId(Long studentId) {

        return applicationRepository.findAll()
                .stream()
                .filter(application ->
                        application.getStudentId().equals(studentId))
                .toList();
    }

    // Update application status + create notification
    public Application updateStatus(Long id, String status) {

        Application application = applicationRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));

        application.setStatus(status);

        Application savedApplication =
                applicationRepository.save(application);

        // Create notification for the student
        String message =
                "Your job application status has been updated to: "
                        + status;

        notificationService.createNotification(
                application.getStudentId(),
                message
        );

        return savedApplication;
    }
}