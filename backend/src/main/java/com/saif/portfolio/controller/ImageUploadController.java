package com.saif.portfolio.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.saif.portfolio.dto.ImageUploadResponse;
import com.saif.portfolio.payload.ApiResponse;
import com.saif.portfolio.service.CloudinaryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageUploadController {

    private final CloudinaryService cloudinaryService;

    // Upload multiple files
    @PostMapping("/upload/{subFolder}")
    public ResponseEntity<ApiResponse<List<ImageUploadResponse>>> uploadMultiple(
            @PathVariable String subFolder,
            @RequestParam("files") MultipartFile[] files) {

        if (!subFolder.equals("projects") && !subFolder.equals("blogs") && !subFolder.equals("certificates")) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(400, "Invalid folder. Must be 'projects', 'blogs', or 'certificates'", null));
        }

        List<ImageUploadResponse> uploaded = cloudinaryService.uploadFiles(files, subFolder);
        return ResponseEntity.ok(new ApiResponse<>(200, "Images uploaded successfully", uploaded));
    }

    // Upload single file
    @PostMapping("/upload-single/{subFolder}")
    public ResponseEntity<ApiResponse<ImageUploadResponse>> uploadSingle(
            @PathVariable String subFolder,
            @RequestParam("file") MultipartFile file) {

        if (!subFolder.equals("projects") && !subFolder.equals("blogs") && !subFolder.equals("certificates")) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(400, "Invalid folder. Must be 'projects', 'blogs', or 'certificates'", null));
        }

        ImageUploadResponse uploaded = cloudinaryService.uploadFile(file, subFolder);
        return ResponseEntity.ok(new ApiResponse<>(200, "Image uploaded successfully", uploaded));
    }

    // Delete image
    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<Void>> deleteImage(@RequestParam("publicId") String publicId) {
        cloudinaryService.deleteFile(publicId);
        return ResponseEntity.ok(new ApiResponse<>(204, "Image deleted successfully", null));
    }
}
