package com.picpic.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.picpic.common.response.ApiResponse;
import com.picpic.dto.S3ImageUploadResponseDTO;
import com.picpic.service.S3Service;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/presigned-url")
public class S3Controller {

	private final S3Service s3Service;

	@GetMapping
	public ApiResponse<S3ImageUploadResponseDTO> getPresignedUrl(
		@RequestParam String type,
		@RequestParam String fileName,
		@RequestParam String contentType
	) {
		return ApiResponse.success(s3Service.generatePresignedUrl(type, fileName, contentType));
	}
}
