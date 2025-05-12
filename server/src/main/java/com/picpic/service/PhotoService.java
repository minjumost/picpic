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

		public PhotoStartResponseDTO startPhoto(Long sessionId,  Long memberId, PhotoStartRequestDTO photoStartRequestDTO) {
			Member member = memberRepository.findById(memberId).orElseThrow(
				() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER)
			);

			Session session = sessionRepository.findBySessionId(sessionId).orElseThrow(
				() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
			);

			//해당 슬롯이 이미 선점이 되어 있으면 에러
			Optional<Photo> existingPhoto = photoRepository.findBySessionIdAndSlotIndex(sessionId, photoStartRequestDTO.slotIndex());
			if (existingPhoto.isPresent()) {
				new ApiException(ErrorCode.ALREADY_USED);
			}

			//해당 슬롯이 비어 있으면 그 슬롯 선점 -> db에 추가
			Photo photo = Photo.builder()
				.session(session)
				.member(member)
				.slotIndex(photoStartRequestDTO.slotIndex())
				.build();

			photoRepository.save(photo);

			return new PhotoStartResponseDTO(
				"photo_start",
				session.getSessionCode(),  // sessionCode가 Session 엔티티에 있어야 합니다
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

			Photo photo = photoRepository.findBySessionIdAndSlotIndex(memberId, photoUploadRequestDTO.slotIndex()).orElseThrow(
				() -> new ApiException(ErrorCode.NOT_FOUND_PHOTO)
			);

			// member와 일치하는지 검증 (보안 차원에서 추천)
			if (!photo.getMember().getMemberId().equals(memberId)) {
				throw new ApiException(ErrorCode.FORBIDDEN_ACCESS);
			}

			// URL 업데이트
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
