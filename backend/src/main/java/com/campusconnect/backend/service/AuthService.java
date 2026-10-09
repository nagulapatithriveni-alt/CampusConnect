package com.campusconnect.backend.service;

import com.campusconnect.backend.entity.Student;
import com.campusconnect.backend.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private StudentRepository studentRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public Student login(String email, String password) {

        Student student =
                studentRepository.findByEmail(email)
                        .orElse(null);

        if (student != null &&
                passwordEncoder.matches(
                        password,
                        student.getPassword())) {

            return student;
        }

        return null;
    }
}