package com.campusconnect.backend.service;

import com.campusconnect.backend.entity.Notification;
import com.campusconnect.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(
            Long studentId,
            String message) {

        Notification notification = new Notification();

        notification.setStudentId(studentId);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        return notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(
            Long studentId) {

        return notificationRepository
                .findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    @Transactional
    public void clearNotifications(Long studentId) {

        notificationRepository.deleteByStudentId(studentId);
    }
}