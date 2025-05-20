package com.picpic.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picpic.common.response.ApiResponse;
import com.picpic.dto.collage.CollageRequestDTO;
import com.picpic.dto.collage.GetCollageResponseDTO;
import com.picpic.service.CollageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CollageController {

	private final CollageService collageService;

	@PostMapping("/collage")
	public ResponseEntity<ApiResponse<Void>> createCollage(
		@AuthenticationPrincipal Long memberId,
		@RequestBody CollageRequestDTO collageRequestDTO) {

		collageService.createCollage(
			memberId,
			collageRequestDTO.sessionId(),
			collageRequestDTO.collageImageUrl()
		);

		return ResponseEntity.ok(ApiResponse.success());
	}

	@GetMapping("/collages/{sessionId}")
	public ResponseEntity<ApiResponse<GetCollageResponseDTO>> getCollage(
		@AuthenticationPrincipal Long memberId,
		@PathVariable Long sessionId) {

		GetCollageResponseDTO collage = collageService.getCollages(memberId, sessionId);

		return ResponseEntity.ok(ApiResponse.success(collage));
	}

	@PostMapping("/collages/update")
	public ResponseEntity<ApiResponse<Void>> updateCollage(
		@AuthenticationPrincipal Long memberId,
		@RequestBody CollageRequestDTO collageRequestDTO) {

		collageService.updateCollages(memberId, collageRequestDTO.sessionId(),
			collageRequestDTO.collageImageUrl());

		return ResponseEntity.ok(ApiResponse.success());
	}
}
