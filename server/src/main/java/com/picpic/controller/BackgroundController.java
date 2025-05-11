package com.picpic.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picpic.common.response.ApiResponse;
import com.picpic.dto.background.GetBackgroundListResponseDTO;
import com.picpic.service.BackgroundService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BackgroundController {

	private final BackgroundService backgroundService;

	@GetMapping("/backgrounds")
	public ResponseEntity<ApiResponse<List<GetBackgroundListResponseDTO>>> getBackgroundList() {
		List<GetBackgroundListResponseDTO> backgroundList = backgroundService.getBackgroundList();
		return ResponseEntity.ok(ApiResponse.success(backgroundList));
	}
}
