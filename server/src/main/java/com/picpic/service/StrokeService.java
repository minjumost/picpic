package com.picpic.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.picpic.common.exception.ApiException;
import com.picpic.common.exception.ErrorCode;
import com.picpic.dto.stroke.StrokeDrawRequestDTO;
import com.picpic.dto.stroke.StrokeDrawResponseDTO;
import com.picpic.dto.stroke.StrokeStartResponseDTO;
import com.picpic.entity.Member;
import com.picpic.entity.Photo;
import com.picpic.entity.Session;
import com.picpic.entity.Stroke;
import com.picpic.repository.MemberRepository;
import com.picpic.repository.PhotoRepository;
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
	private final PhotoRepository photoRepository;
	private final ObjectMapper objectMapper;

	@Transactional
	public StrokeStartResponseDTO startStroke(Long memberId, Long sessionId) {
		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER)
		);

		Session session = sessionRepository.findBySessionId(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		session.draw();

		StrokeStartResponseDTO res = new StrokeStartResponseDTO("stroke_start");

		log.info("그리기모드 시작");

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

		Photo photo = photoRepository.findByphotoId(strokeDrawRequestDTO.photoId()).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_PHOTO)
		);

		String pointsJson;
		try {
			pointsJson = objectMapper.writeValueAsString(strokeDrawRequestDTO.points());
		} catch (JsonProcessingException e) {
			throw new ApiException(ErrorCode.INVALID_JSON_FORMAT);
		}

		Stroke stroke = Stroke.builder()
			.member(member)
			.photo(photo)
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
}
