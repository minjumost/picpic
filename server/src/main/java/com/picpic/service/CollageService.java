package com.picpic.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.picpic.common.exception.ApiException;
import com.picpic.common.exception.ErrorCode;
import com.picpic.dto.collage.GetCollageListResponseDTO;
import com.picpic.entity.Collage;
import com.picpic.entity.Photo;
import com.picpic.entity.Session;
import com.picpic.repository.CollageRepository;
import com.picpic.repository.PhotoRepository;
import com.picpic.repository.SessionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CollageService {

	private final CollageRepository collageRepository;
	private final SessionRepository sessionRepository;
	private final PhotoRepository photoRepository;

	public void createCollage(Long sessionId, String collageImageUrl) {
		Session session = sessionRepository.findBySessionId(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		Collage collage = Collage.builder()
			.session(session)
			.collageImageUrl(collageImageUrl).build();

		collageRepository.save(collage);

	}

	public List<GetCollageListResponseDTO> getCollages(Long sessionId) {
		Session session = sessionRepository.findBySessionId(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		List<Photo> photos = photoRepository.findAllBySession(session);

		return photos.stream()
			.map(photo -> new GetCollageListResponseDTO(
				photo.getSlotIndex(),
				photo.getEditedImageUrl()
			))
			.collect(Collectors.toList());
	}
}
