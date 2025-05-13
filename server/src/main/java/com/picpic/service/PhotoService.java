package com.picpic.service;

import java.util.Optional;

import org.slf4j.MDC;
import org.springframework.stereotype.Service;

import com.picpic.common.exception.ApiException;
import com.picpic.common.exception.ErrorCode;
import com.picpic.dto.photo.PhotoStartRequestDTO;
import com.picpic.dto.photo.PhotoStartResponseDTO;
import com.picpic.dto.photo.PhotoUploadRequestDTO;
import com.picpic.dto.photo.PhotoUploadResponseDTO;
import com.picpic.entity.Member;
import com.picpic.entity.Photo;
import com.picpic.entity.Session;
import com.picpic.repository.MemberRepository;
import com.picpic.repository.PhotoRepository;
import com.picpic.repository.SessionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PhotoService {

	private final PhotoRepository photoRepository;
	private final SessionRepository sessionRepository;
	private final MemberRepository memberRepository;

	public PhotoStartResponseDTO startPhoto(Long sessionId, Long memberId, PhotoStartRequestDTO photoStartRequestDTO) {
		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER)
		);

		Session session = sessionRepository.findBySessionId(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		Optional<Photo> existingPhoto = photoRepository.findBySessionAndSlotIndex(session,
			photoStartRequestDTO.slotIndex());
		if (existingPhoto.isPresent()) {
			new ApiException(ErrorCode.ALREADY_USED);
		}

		Photo photo = Photo.builder()
			.session(session)
			.member(member)
			.slotIndex(photoStartRequestDTO.slotIndex())
			.build();

		photoRepository.save(photo);

		PhotoStartResponseDTO res = new PhotoStartResponseDTO(
			"photo_start",
			photo.getSlotIndex(),
			member.getMemberId()
		);

		MDC.put("sessionId", sessionId.toString());
		log.info("사진 모드 시작");

		return res;
	}

	public PhotoUploadResponseDTO uploadPhoto(Long sessionId, Long memberId,
		PhotoUploadRequestDTO photoUploadRequestDTO) {

		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER)
		);

		Session session = sessionRepository.findBySessionId(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		Photo photo = photoRepository.findBySessionAndSlotIndex(session, photoUploadRequestDTO.slotIndex())
			.orElseThrow(
				() -> new ApiException(ErrorCode.NOT_FOUND_PHOTO)
			);

		if (!photo.getMember().getMemberId().equals(memberId)) {
			throw new ApiException(ErrorCode.FORBIDDEN_ACCESS);
		}

		photo.setPhotoImageUrl(photoUploadRequestDTO.url());

		PhotoUploadResponseDTO res = new PhotoUploadResponseDTO(
			"photo_upload",
			photo.getSlotIndex(),
			photoUploadRequestDTO.url()
		);

		MDC.put("sessionId", sessionId.toString());
		log.info("사진 업로드 완료");

		return res;
	}
}
