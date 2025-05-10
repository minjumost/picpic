package com.picpic.service;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.picpic.common.exception.ApiException;
import com.picpic.common.exception.ErrorCode;
import com.picpic.dto.session.CreateSessionRequestDTO;
import com.picpic.dto.session.CreateSessionResponseDTO;
import com.picpic.entity.Background;
import com.picpic.entity.Frame;
import com.picpic.entity.Member;
import com.picpic.entity.Session;
import com.picpic.repository.BackgroundRepository;
import com.picpic.repository.FrameRepository;
import com.picpic.repository.MemberRepository;
import com.picpic.repository.SessionRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SessionService {

	private final MemberRepository memberRepository;
	private final FrameRepository frameRepository;
	private final BackgroundRepository backgroundRepository;
	private final SessionRepository sessionRepository;
	private final PasswordEncoder passwordEncoder;

	public CreateSessionResponseDTO createSession(Long memberId, CreateSessionRequestDTO createSessionRequestDTO) {
		Member host = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER)
		);

		Frame frame = frameRepository.findById(createSessionRequestDTO.frameId()).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_FRAME)
		);

		Background background = backgroundRepository.findById(createSessionRequestDTO.backgroundId()).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_BACKGROUND)
		);

		Session session = Session.builder()
			.sessionCode(UUID.randomUUID().toString().substring(0, 8))
			.member(host)
			.frame(frame)
			.background(background)
			.password(passwordEncoder.encode(createSessionRequestDTO.password()))
			.status(Session.SessionStatus.WAITING)
			.build();

		sessionRepository.save(session);

		return CreateSessionResponseDTO.builder()
			.sessionId(session.getSessionId())
			.sessionCode(session.getSessionCode())
			.build();

	}
}
