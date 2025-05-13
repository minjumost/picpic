package com.picpic.service;

import org.springframework.stereotype.Service;

import com.picpic.common.exception.ApiException;
import com.picpic.common.exception.ErrorCode;
import com.picpic.entity.Collage;
import com.picpic.entity.Session;
import com.picpic.repository.CollageRepository;
import com.picpic.repository.SessionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CollageService {

	private final CollageRepository collageRepository;
	private final SessionRepository sessionRepository;

	public void createCollage(Long sessionId, String collageImageUrl) {
		Session session = sessionRepository.findBySessionId(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		Collage collage = Collage.builder()
			.session(session)
			.collageImageUrl(collageImageUrl).build();

		collageRepository.save(collage);

	}
}
