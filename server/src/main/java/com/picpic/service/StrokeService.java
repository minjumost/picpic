package com.picpic.service;

import java.time.Instant;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.picpic.common.exception.ApiException;
import com.picpic.common.exception.ErrorCode;
import com.picpic.dto.collage.CollageWebSocketResponseDTO;
import com.picpic.dto.stroke.StrokeDrawRequestDTO;
import com.picpic.dto.stroke.StrokeDrawResponseDTO;
import com.picpic.dto.stroke.StrokeReadyResponseDTO;
import com.picpic.dto.stroke.StrokeStartResponseDTO;
import com.picpic.entity.Collage;
import com.picpic.entity.Member;
import com.picpic.entity.Session;
import com.picpic.entity.Stroke;
import com.picpic.repository.CollageRepository;
import com.picpic.repository.MemberRepository;
import com.picpic.repository.SessionRepository;
import com.picpic.repository.StrokeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class StrokeService {

	private final StrokeRepository strokeRepository;
	private final SessionRepository sessionRepository;
	private final MemberRepository memberRepository;
	private final ObjectMapper objectMapper;
	private final CollageRepository collageRepository;

	private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	private final SimpMessagingTemplate messagingTemplate;
	private final CollageService collageService;

	@Transactional
	public StrokeStartResponseDTO startStroke(Long memberId, Long sessionId) {
		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER)
		);

		Session session = sessionRepository.findBySessionId(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		session.draw();
		Instant now = Instant.now();

		String sessionCode = session.getSessionCode();
		Long ownerId = session.getMember().getMemberId();

		StrokeStartResponseDTO res = new StrokeStartResponseDTO("stroke_start", now, 60 * 60);

		log.info("그리기모드 시작");

		// 60초 후 자동 모드 전환 예약
		scheduler.schedule(() -> {
			CollageWebSocketResponseDTO response = collageService.startCollage(ownerId, sessionId);
			messagingTemplate.convertAndSend("/broadcast/" + sessionCode, response);
			log.info("그리기 모드 자동 종료");
		}, 60 * 60, TimeUnit.SECONDS);

		return res;
	}

	@Transactional
	public StrokeDrawResponseDTO stroke(Long memberId, StrokeDrawRequestDTO strokeDrawRequestDTO) {
		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER)
		);

		Session session = sessionRepository.findBySessionId(strokeDrawRequestDTO.sessionId()).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		Collage collage = collageRepository.findBySession(session).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_COLLAGE)
		);

		String pointsJson;
		try {
			pointsJson = objectMapper.writeValueAsString(strokeDrawRequestDTO.points());
		} catch (JsonProcessingException e) {
			throw new ApiException(ErrorCode.INVALID_JSON_FORMAT);
		}

		Stroke stroke = Stroke.builder()
			.member(member)
			.collage(collage)
			.tool(strokeDrawRequestDTO.tool())
			.color(strokeDrawRequestDTO.color())
			.lineWidth(strokeDrawRequestDTO.lineWidth())
			.pointsJson(pointsJson)
			.build();

		strokeRepository.save(stroke);

		StrokeDrawResponseDTO res = new StrokeDrawResponseDTO(
			"stroke",
			strokeDrawRequestDTO.color(),
			strokeDrawRequestDTO.lineWidth(),
			strokeDrawRequestDTO.points().stream()
				.map(p -> new StrokeDrawResponseDTO.Point(p.x(), p.y()))
				.toList(),
			strokeDrawRequestDTO.tool()
		);

		log.info("Stroke 저장 완료");

		return res;
	}

	public StrokeReadyResponseDTO ready(Long memberId, Long sessionId) {
		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER)
		);

		Session session = sessionRepository.findBySessionId(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		StrokeReadyResponseDTO res = new StrokeReadyResponseDTO("stroke_ready");

		log.info("Stroke 대기 완료");

		return res;
	}

}
