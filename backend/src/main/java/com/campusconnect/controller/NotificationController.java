package com.campusconnect.backend.controller;

import com.campusconnect.backend.entity.Notification;
import com.campusconnect.backend.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/test")
    public Notification testNotification(
            @RequestParam Long studentId) {

        return notificationService.createNotification(
                studentId,
                "Test notification - CampusConnect"
        );
    }

    @GetMapping("/student/{studentId}")
    public List<Notification> getNotifications(
            @PathVariable Long studentId) {

        return notificationService.getNotifications(studentId);
    }

    @DeleteMapping("/student/{studentId}")
    public void clearNotifications(
            @PathVariable Long studentId) {

        notificationService.clearNotifications(studentId);
    }
}