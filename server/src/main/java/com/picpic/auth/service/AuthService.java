package com.picpic.auth.service;

import java.util.List;

import org.slf4j.MDC;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.picpic.auth.GuestLoginResultDTO;
import com.picpic.auth.JwtTokenProvider;
import com.picpic.entity.Member;
import com.picpic.entity.Nickname;
import com.picpic.entity.Profile;
import com.picpic.repository.MemberRepository;
import com.picpic.repository.NicknameRepository;
import com.picpic.repository.ProfileRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class AuthService {

	private final MemberRepository memberRepository;
	private final ProfileRepository profileRepository;
	private final NicknameRepository nicknameRepository;
	private final JwtTokenProvider jwtTokenProvider;

	public GuestLoginResultDTO loginAsGuest() {
		Profile profile = profileRepository.findRandom();
		Nickname nickname = nicknameRepository.findRandom();

		Member guest = Member.builder()
			.nickname(nickname.getAdjective() + " " + nickname.getNoun())
			.color(profile.getColor())
			.role(Member.Role.GUEST)
			.profileImageUrl(profile.getProfileImageUrl())
			.build();

		memberRepository.save(guest);

		UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
			new UsernamePasswordAuthenticationToken(
				guest.getMemberId(), null,
				List.of(() -> guest.getRole().name()));

		MDC.put("memberId", guest.getMemberId().toString());

		log.info("게스트 로그인 완료");

		String token = jwtTokenProvider.generateToken(guest.getMemberId(), guest.getRole());

		return new GuestLoginResultDTO(guest.getMemberId(), token);
	}

}
