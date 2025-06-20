package com.picpic.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picpic.common.response.ApiResponse;
import com.picpic.dto.session.CanEnterSessionRequestDTO;
import com.picpic.dto.session.CreateSessionRequestDTO;
import com.picpic.dto.session.CreateSessionResponseDTO;
import com.picpic.dto.session.GetSessionFrameResponseDTO;
import com.picpic.dto.session.GetSessionPhotosResponseDTO;
import com.picpic.service.SessionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/session")
@RequiredArgsConstructor
public class SessionController {

	private final SessionService sessionService;

	@PostMapping
	public ResponseEntity<ApiResponse<CreateSessionResponseDTO>> createSession(
		@AuthenticationPrincipal Long memberId,
		@RequestBody @Valid CreateSessionRequestDTO createSessionRequestDTO) {
		CreateSessionResponseDTO res = sessionService.createSession(memberId, createSessionRequestDTO);
		return ResponseEntity.ok(ApiResponse.success(res));
	}

	@GetMapping("/{sessionId}/frame")
	public ResponseEntity<ApiResponse<GetSessionFrameResponseDTO>> getSessionFrame(
		@AuthenticationPrincipal Long memberId,
		@PathVariable Long sessionId
	) {
		GetSessionFrameResponseDTO res = sessionService.getSessionFrame(memberId, sessionId);
		return ResponseEntity.ok(ApiResponse.success(res));
	}

	@GetMapping("/{sessionId}/photos")
	public ResponseEntity<ApiResponse<List<GetSessionPhotosResponseDTO>>> getSessionPhotos(
		@AuthenticationPrincipal Long memberId,
		@PathVariable Long sessionId
	) {
		List<GetSessionPhotosResponseDTO> res = sessionService.getSessionPhotos(memberId, sessionId);
		return ResponseEntity.ok(ApiResponse.success(res));
	}

	@PutMapping("/{sessionCode}")
	public ResponseEntity<ApiResponse<Boolean>> enterSession(
		@AuthenticationPrincipal Long memberId,
		@PathVariable String sessionCode,
		@RequestBody CanEnterSessionRequestDTO canEnterSessionRequestDTO
	) {

		Boolean res = sessionService.canEnterSession(memberId, sessionCode, canEnterSessionRequestDTO.password());
		return ResponseEntity.ok(ApiResponse.success(res));
	}

}
