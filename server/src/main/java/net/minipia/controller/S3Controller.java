package net.minipia.controller;

import lombok.RequiredArgsConstructor;

import net.minipia.apiPayload.ApiResponseDTO;
import net.minipia.dto.RegisterObjectRequestDTO;
import net.minipia.dto.RegisterObjectResponseDTO;
import net.minipia.service.S3Service;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/s3")
public class S3Controller {

	private final S3Service s3Service;

	@PostMapping("/upload")
	public ApiResponseDTO<RegisterObjectResponseDTO> uploadAndRegister(@RequestBody RegisterObjectRequestDTO request) {
		RegisterObjectResponseDTO response = s3Service.registerObjectAndGetUploadUrl(
			request.type(), request.fileName(), request.contentType(), request.width(), request.height()
		);
		return ApiResponseDTO.onSuccess(response);
	}
}

