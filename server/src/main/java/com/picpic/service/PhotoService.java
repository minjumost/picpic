package com.picpic.service;

import java.util.Optional;

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

@Service
@RequiredArgsConstructor
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

		return new PhotoStartResponseDTO(
			"photo_start",
			session.getSessionCode(),
			photo.getSlotIndex(),
			member.getMemberId()
		);
	}

		public PhotoUploadResponseDTO uploadPhoto(Long sessionId, Long memberId, PhotoUploadRequestDTO photoUploadRequestDTO) {

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

		return new PhotoUploadResponseDTO(
			"photo_upload",
			session.getSessionCode(),
			photo.getSlotIndex(),
			memberId,
			photoUploadRequestDTO.url()
		);
	}
}
