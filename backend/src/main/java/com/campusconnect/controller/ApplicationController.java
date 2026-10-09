package com.campusconnect.backend.controller;

import com.campusconnect.backend.entity.Application;
import com.campusconnect.backend.service.ApplicationService;
import com.campusconnect.backend.service.FileUploadService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private FileUploadService fileUploadService;


    // ==========================================
    // CREATE APPLICATION + UPLOAD RESUME
    // ==========================================

    @PostMapping(consumes = "multipart/form-data")
    public Application createApplication(

            @RequestParam Long studentId,
            @RequestParam Long jobId,
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam MultipartFile resume) {

        String savedFileName =
                fileUploadService.saveFile(resume);

        Application application = new Application();

        application.setStudentId(studentId);
        application.setJobId(jobId);
        application.setName(name);
        application.setEmail(email);
        application.setPhone(phone);
        application.setResume(savedFileName);

        return applicationService.saveApplication(application);
    }


    // ==========================================
    // GET ALL APPLICATIONS
    // ==========================================

    @GetMapping
    public List<Application> getAllApplications() {

        return applicationService.getAllApplications();
    }


    // ==========================================
    // GET APPLICATION BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(
            @PathVariable Long id) {

        Optional<Application> application =
                applicationService.getApplicationById(id);

        if (application.isPresent()) {
            return ResponseEntity.ok(application.get());
        }

        return ResponseEntity.notFound().build();
    }


    // ==========================================
    // GET APPLICATIONS BY STUDENT
    // ==========================================

    @GetMapping("/student/{studentId}")
    public List<Application> getApplicationsByStudentId(
            @PathVariable Long studentId) {

        return applicationService
                .getApplicationsByStudentId(studentId);
    }


    // ==========================================
    // UPDATE APPLICATION STATUS
    // ==========================================

    @PutMapping("/{id}/status")
    public Application updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return applicationService.updateStatus(id, status);
    }


    // ==========================================
    // DOWNLOAD RESUME
    // ==========================================

    @GetMapping("/{id}/resume")
    public ResponseEntity<Resource> downloadResume(
            @PathVariable Long id) {

        Optional<Application> application =
                applicationService.getApplicationById(id);

        if (application.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String fileName =
                application.get().getResume();

        try {

            Path uploadDirectory =
                    Paths.get("uploads")
                            .toAbsolutePath()
                            .normalize();

            Path filePath =
                    uploadDirectory
                            .resolve(fileName)
                            .normalize();

            // Security check
            if (!filePath.startsWith(uploadDirectory)) {
                return ResponseEntity.badRequest().build();
            }

            Resource resource =
                    new UrlResource(filePath.toUri());

            if (!resource.exists() ||
                    !resource.isReadable()) {

                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(
                            MediaType.APPLICATION_OCTET_STREAM
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" +
                            fileName +
                            "\""
                    )
                    .body(resource);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }
}