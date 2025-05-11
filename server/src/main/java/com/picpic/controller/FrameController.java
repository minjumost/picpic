package com.picpic.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picpic.common.response.ApiResponse;
import com.picpic.dto.frame.GetFrameListResponseDTO;
import com.picpic.service.FrameService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class FrameController {

	private final FrameService frameService;

	@GetMapping("/frames")
	public ResponseEntity<ApiResponse<List<GetFrameListResponseDTO>>> getFrames() {
		List<GetFrameListResponseDTO> frameList = frameService.getFrameList();
		return ResponseEntity.ok(ApiResponse.success(frameList));
	}
}

