package com.saif.portfolio.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.saif.portfolio.dto.ImageUploadResponse;
import com.saif.portfolio.service.CloudinaryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    private String baseFolder = "portfolio"; // optional default

    @Override
    public ImageUploadResponse uploadFile(MultipartFile file, String folder) {
        String targetFolder = buildFolderPath(folder);
        String uniqueFilename = UUID.randomUUID().toString();

        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", targetFolder,
                            "public_id", uniqueFilename,
                            "resource_type", "image",
                            "overwrite", false,
                            "use_filename", true,
                            "unique_filename", false
                    )
            );

            String publicId = (String) result.get("public_id");
            String format = (String) result.get("format");

            String url = cloudinary.url()
                    .resourceType("image")
                    .transformation(new Transformation().fetchFormat("auto").quality("auto"))
                    .generate(publicId + "." + format);

            return new ImageUploadResponse(publicId, url);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
        }
    }

    @Override
    public List<ImageUploadResponse> uploadFiles(MultipartFile[] files, String folder) {
        List<ImageUploadResponse> responses = new ArrayList<>();
        if (files == null || files.length == 0) return responses;

        for (MultipartFile f : files) {
            if (f == null || f.isEmpty()) continue;
            responses.add(uploadFile(f, folder));
        }
        return responses;
    }

    @Override
    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + publicId, e);
        }
    }

    private String buildFolderPath(String folder) {
        if (folder == null || folder.isBlank()) return baseFolder;
        String cleaned = folder.trim().replaceAll("^/+", "").replaceAll("/+$", "");
        return baseFolder + "/" + cleaned;
    }
}
