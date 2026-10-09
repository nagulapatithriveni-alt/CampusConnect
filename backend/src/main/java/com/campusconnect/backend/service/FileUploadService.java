package com.campusconnect.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileUploadService {

    private final Path uploadPath;

    public FileUploadService(
            @Value("${file.upload-dir}") String uploadDir) {

        this.uploadPath = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(this.uploadPath);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not create upload directory", e);
        }
    }

    public String saveFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Please select a file");
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null ||
                originalFileName.isBlank()) {
            throw new RuntimeException("Invalid file name");
        }

        String fileName =
                UUID.randomUUID() + "_" + originalFileName;

        try {
            Path targetPath =
                    this.uploadPath.resolve(fileName)
                            .normalize();

            if (!targetPath.startsWith(this.uploadPath)) {
                throw new RuntimeException("Invalid file path");
            }

            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return fileName;

        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not save file", e);
        }
    }
}