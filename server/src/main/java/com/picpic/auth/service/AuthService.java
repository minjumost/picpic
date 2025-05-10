package com.picpic.auth.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.picpic.auth.JwtTokenProvider;
import com.picpic.entity.Member;
import com.picpic.entity.Nickname;
import com.picpic.entity.Profile;
import com.picpic.repository.MemberRepository;
import com.picpic.repository.NicknameRepository;
import com.picpic.repository.ProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

	private final MemberRepository memberRepository;
	private final ProfileRepository profileRepository;
	private final NicknameRepository nicknameRepository;
	private final JwtTokenProvider jwtTokenProvider;

	public String loginAsGuest() {

		Profile profile = profileRepository.findRandom();
		Nickname nickname = nicknameRepository.findRandom();

		Member guest = Member.builder()
			.nickname(nickname.getAdjective() + " " + nickname.getNoun())
			.color(profile.getColor())
			.role(Member.Role.GUEST)
			.profileImageUrl(profile.getProfileImageUrl())
			.build();

		memberRepository.save(guest);

		return jwtTokenProvider.generateToken(guest.getMemberId(), guest.getRole());
	}

}
