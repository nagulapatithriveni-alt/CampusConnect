package com.campusconnect.backend.controller;

import com.campusconnect.backend.entity.Student;
import com.campusconnect.backend.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        Student student = authService.login(email, password);

        if (student == null) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("message", "Invalid email or password"));
        }

        return ResponseEntity.ok(
                Map.of(
                        "id", student.getId(),
                        "name", student.getName(),
                        "email", student.getEmail(),
                        "phone", student.getPhone()
                )
        );
    }
}