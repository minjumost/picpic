package com.picpic.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picpic.common.response.ApiResponse;
import com.picpic.dto.photo.PhotoRequsetDTO;
import com.picpic.service.PhotoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PhotoController {

	private final PhotoService photoService;

	@PostMapping("/edited")
	public ResponseEntity<ApiResponse<Void>> edited(@RequestBody PhotoRequsetDTO photoRequsetDTO) {
		photoService.saveEditedPhoto(photoRequsetDTO.sessionId(), photoRequsetDTO.slotIndex(),
			photoRequsetDTO.editedImageUrl());
		return ResponseEntity.ok(ApiResponse.success());
	}
}
