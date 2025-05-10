package com.picpic.api.v1.auth.controller;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picpic.auth.service.AuthService;
import com.picpic.common.response.ApiResponse;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/guest")
	public ResponseEntity<ApiResponse<Void>> guestLogin(HttpServletResponse response) {
		String accessToken = authService.loginAsGuest();

		ResponseCookie cookie = ResponseCookie.from("access-token", accessToken)
			.httpOnly(true)
			.secure(false) // 개발 중일 경우 false
			.path("/")
			.sameSite("Lax")
			.maxAge(60 * 60 * 24)
			.build();

		response.addHeader("Set-Cookie", cookie.toString());

		return ResponseEntity.ok(ApiResponse.success());
	}
}
