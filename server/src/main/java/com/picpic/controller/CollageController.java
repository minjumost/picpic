package com.picpic.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picpic.common.response.ApiResponse;
import com.picpic.dto.collage.CollageRequestDTO;
import com.picpic.dto.collage.GetCollageListResponseDTO;
import com.picpic.service.CollageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CollageController {

	private final CollageService collageService;

	@PostMapping("/collage")
	public ResponseEntity<ApiResponse<Void>> createCollage(
		@RequestBody CollageRequestDTO collageRequestDTO) {

		collageService.createCollage(
			collageRequestDTO.sessionId(),
			collageRequestDTO.collageImageUrl()
		);

		return ResponseEntity.ok(ApiResponse.success());
	}

	@GetMapping("/collages/{sessionId}")
	public ResponseEntity<ApiResponse<List<GetCollageListResponseDTO>>> getCollage(
		@PathVariable Long sessionId) {

		List<GetCollageListResponseDTO> collageList = collageService.getCollages(sessionId);

		return ResponseEntity.ok(ApiResponse.success(collageList));
	}
}
