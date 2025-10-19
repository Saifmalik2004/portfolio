package com.saif.portfolio.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.saif.portfolio.dto.ImageUploadResponse;

public interface CloudinaryService {

    /**
     * Upload one or more files to the given folder (e.g. "projects", "blogs", "certificates").
     * If a single file is provided, it will return a list with one element.
     * Returns list of ImageUploadResponse containing publicId and URL.
     */
    List<ImageUploadResponse> uploadFiles(MultipartFile[] files, String folder);
    ImageUploadResponse uploadFile(MultipartFile file, String folder);
    /**
     * Delete an image by its publicId.
     */
    void deleteFile(String publicId);
}
