package com.picpic.auth.controller;

import java.io.IOException;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import com.picpic.auth.dto.GuestLoginResultDTO;
import com.picpic.auth.service.SsafyOAuthService;
import com.picpic.common.response.ApiResponse;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/oauth")
@RequiredArgsConstructor
public class SsafyOAuthController {

	private final SsafyOAuthService ssafyOAuthService;

	@GetMapping("/ssafy/callback")
	public void ssafyLogin(@RequestParam String code, HttpServletResponse response) throws IOException {
		GuestLoginResultDTO result = ssafyOAuthService.loginWithSsafy(code);

		ResponseCookie cookie = ResponseCookie.from("access-token", result.accessToken())
			.httpOnly(true)
			.secure(false)
			.path("/")
			.sameSite("None")
			.maxAge(60 * 60 * 24)
			.build();

		response.addHeader("Set-Cookie", cookie.toString());

		// ✅ 프론트로 리다이렉트 (프론트에서 로그인 후 처리 페이지로 이동)
		String redirectUrl = UriComponentsBuilder
			.fromUriString("https://minipia.co.kr/frame") // ✅ 실제 프론트 주소로 변경
			.queryParam("memberId", result.memberId()) // ✅ memberId 전달 (프론트에서 식별에 사용)
			.build()
			.toUriString();

		response.sendRedirect(redirectUrl); // ✅ 리다이렉트 수행

	}

	@PostMapping("/ssafy/refresh")
	public ResponseEntity<ApiResponse<String>> refreshAccessToken(@RequestParam String refreshToken) {
		String newAccessToken = ssafyOAuthService.refreshToken(refreshToken);
		return ResponseEntity.ok(ApiResponse.success(newAccessToken));
	}
}
