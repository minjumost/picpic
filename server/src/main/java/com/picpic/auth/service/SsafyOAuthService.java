package com.picpic.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.picpic.auth.JwtTokenProvider;
import com.picpic.auth.dto.GuestLoginResultDTO;
import com.picpic.auth.dto.SsafyTokenResponse;
import com.picpic.auth.dto.SsafyUserInfoResponse;
import com.picpic.entity.Member;
import com.picpic.entity.Nickname;
import com.picpic.entity.Profile;
import com.picpic.repository.MemberRepository;
import com.picpic.repository.NicknameRepository;
import com.picpic.repository.ProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SsafyOAuthService {

	@Value("${ssafy.client-id}")
	private String clientId;

	@Value("${ssafy.client-secret}")
	private String clientSecret;

	@Value("${ssafy.redirect-uri}")
	private String redirectUri;

	@Value("${ssafy.token-uri}")
	private String tokenUri;

	@Value("${ssafy.user-info-uri}")
	private String userInfoUri;

	private final MemberRepository memberRepository;
	private final JwtTokenProvider jwtTokenProvider;
	private final RestTemplate restTemplate = new RestTemplate();
	private final ProfileRepository profileRepository;
	private final NicknameRepository nicknameRepository;

	public GuestLoginResultDTO loginWithSsafy(String code) {
		// Step 1: 토큰 발급
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
		body.add("grant_type", "authorization_code");
		body.add("client_id", clientId);
		body.add("client_secret", clientSecret);
		body.add("redirect_uri", redirectUri);
		body.add("code", code);

		HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(body, headers);
		ResponseEntity<SsafyTokenResponse> tokenResponse = restTemplate.postForEntity(tokenUri, tokenRequest,
			SsafyTokenResponse.class);

		String accessToken = tokenResponse.getBody().accessToken();

		// Step 2: 사용자 정보 조회
		HttpHeaders userInfoHeaders = new HttpHeaders();
		userInfoHeaders.setBearerAuth(accessToken);
		HttpEntity<Void> userInfoRequest = new HttpEntity<>(userInfoHeaders);

		ResponseEntity<SsafyUserInfoResponse> userInfoResponse = restTemplate.exchange(
			userInfoUri, HttpMethod.GET, userInfoRequest, SsafyUserInfoResponse.class
		);

		String ssafyId = userInfoResponse.getBody().userId();
		String email = userInfoResponse.getBody().email();
		// String name = userInfoResponse.getBody().getName();

		Profile profile = profileRepository.findRandom();
		Nickname nickname = nicknameRepository.findRandom();

		// Step 3: 사용자 저장 또는 로그인 처리
		Member member = memberRepository.findBySsafyUserId(ssafyId)
			.orElseGet(() -> {
				Member newMember = Member.builder()
					.nickname(nickname.getAdjective() + " " + nickname.getNoun())
					.color(profile.getColor())
					.ssafyUserId(ssafyId)
					.email(email)
					.profileImageUrl(profile.getProfileImageUrl())
					.role(Member.Role.SSAFY)
					.build();
				return memberRepository.save(newMember);
			});

		String jwt = jwtTokenProvider.generateToken(member.getMemberId(), member.getRole());
		return new GuestLoginResultDTO(member.getMemberId(), jwt);
	}

	public String refreshToken(String refreshToken) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
		body.add("grant_type", "refresh_token");
		body.add("client_id", clientId);
		body.add("client_secret", clientSecret);
		body.add("refresh_token", refreshToken);

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
		ResponseEntity<SsafyTokenResponse> response = restTemplate.postForEntity(tokenUri, request,
			SsafyTokenResponse.class);

		return response.getBody().accessToken();
	}
}
