package com.campusconnect.backend.service;

import com.campusconnect.backend.entity.Student;
import com.campusconnect.backend.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public Student registerStudent(Student student) {

        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String hashedPassword =
                passwordEncoder.encode(student.getPassword());

        student.setPassword(hashedPassword);

        return studentRepository.save(student);
    }
}