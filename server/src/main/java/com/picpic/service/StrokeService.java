package com.picpic.service;

import org.springframework.stereotype.Service;

import com.picpic.common.exception.ApiException;
import com.picpic.common.exception.ErrorCode;
import com.picpic.dto.stroke.StrokeStartResponseDTO;
import com.picpic.entity.Member;
import com.picpic.entity.Session;
import com.picpic.repository.MemberRepository;
import com.picpic.repository.SessionRepository;
import com.picpic.repository.StrokeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StrokeService {

	private final StrokeRepository strokeRepository;
	private final SessionRepository sessionRepository;
	private final MemberRepository memberRepository;

	public StrokeStartResponseDTO startStroke(Long memberId, Long sessionId) {
		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER)
		);

		Session session = sessionRepository.findBySessionId(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		return new StrokeStartResponseDTO(
			"stroke_start"
		);
	}
}
