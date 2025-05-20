package com.picpic.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.picpic.common.exception.ApiException;
import com.picpic.common.exception.ErrorCode;
import com.picpic.dto.collage.CollageWebSocketResponseDTO;
import com.picpic.dto.collage.GetCollageResponseDTO;
import com.picpic.entity.Collage;
import com.picpic.entity.Member;
import com.picpic.entity.Session;
import com.picpic.repository.CollageRepository;
import com.picpic.repository.MemberRepository;
import com.picpic.repository.ParticipantRepository;
import com.picpic.repository.PhotoRepository;
import com.picpic.repository.SessionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CollageService {

	private final CollageRepository collageRepository;
	private final SessionRepository sessionRepository;
	private final PhotoRepository photoRepository;
	private final MemberRepository memberRepository;
	private final ParticipantRepository participantRepository;

	@Transactional
	public void createCollage(Long memberId, Long sessionId, String collageImageUrl) {
		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.FORBIDDEN_ACCESS)
		);

		Session session = sessionRepository.findBySessionId(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		Boolean isParticipant = participantRepository.existsBySessionAndMember(session, member);

		if (!isParticipant) {
			throw new ApiException(ErrorCode.FORBIDDEN_ACCESS);
		}

		Optional<Collage> optionalCollage = collageRepository.findBySession(session);

		if (optionalCollage.isPresent()) {
			// 이미 존재하면 업데이트
			Collage collage = optionalCollage.get();
			collage.setCollageImageUrl(collageImageUrl);
		} else {
			// 없으면 새로 생성
			Collage collage = Collage.builder()
				.session(session)
				.collageImageUrl(collageImageUrl)
				.build();
			collageRepository.save(collage);
		}

	}

	@Transactional
	public GetCollageResponseDTO getCollages(Long memberId, Long sessionId) {
		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.FORBIDDEN_ACCESS)
		);

		Session session = sessionRepository.findBySessionId(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		Boolean isParticipant = participantRepository.existsBySessionAndMember(session, member);

		if (!isParticipant) {
			throw new ApiException(ErrorCode.FORBIDDEN_ACCESS);
		}

		Collage collage = collageRepository.findBySession(session).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_COLLAGE)
		);

		GetCollageResponseDTO res = new GetCollageResponseDTO(
			collage.getCollageImageUrl()
		);

		return res;
	}

	@Transactional
	public void updateCollages(Long memberId, Long sessionId, String collageImageUrl) {
		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.FORBIDDEN_ACCESS)
		);
		
		Session session = sessionRepository.findBySessionId(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		Collage collage = collageRepository.findBySession(session).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_COLLAGE)
		);

		Boolean isParticipant = participantRepository.existsBySessionAndMember(session, member);

		if (!isParticipant) {
			throw new ApiException(ErrorCode.FORBIDDEN_ACCESS);
		}

		collage.setCollageImageUrl(collageImageUrl);

	}

	@Transactional
	public CollageWebSocketResponseDTO startCollage(Long memberId, Long sessionId) {
		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER)
		);

		Session session = sessionRepository.findBySessionId(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		session.collage();

		CollageWebSocketResponseDTO res = new CollageWebSocketResponseDTO("collage_start");
		log.info("콜라주 시작");

		return res;
	}
}
