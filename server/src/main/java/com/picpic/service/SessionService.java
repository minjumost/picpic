package com.picpic.service;

import java.util.List;
import java.util.UUID;

import org.slf4j.MDC;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.picpic.common.exception.ApiException;
import com.picpic.common.exception.ErrorCode;
import com.picpic.dto.session.CreateSessionRequestDTO;
import com.picpic.dto.session.CreateSessionResponseDTO;
import com.picpic.dto.session.EnterSessionRequestDTO;
import com.picpic.dto.session.EnterSessionResponseDTO;
import com.picpic.dto.session.ExitSessionRequestDTO;
import com.picpic.dto.session.ExitSessionResponseDTO;
import com.picpic.dto.session.GetSessionFrameResponseDTO;
import com.picpic.dto.session.GetSessionPhotosResponseDTO;
import com.picpic.dto.session.StartSessionRequestDTO;
import com.picpic.dto.session.StartSessionResponseDTO;
import com.picpic.entity.Background;
import com.picpic.entity.Frame;
import com.picpic.entity.Member;
import com.picpic.entity.Participant;
import com.picpic.entity.Photo;
import com.picpic.entity.Session;
import com.picpic.repository.BackgroundRepository;
import com.picpic.repository.FrameRepository;
import com.picpic.repository.MemberRepository;
import com.picpic.repository.ParticipantRepository;
import com.picpic.repository.PhotoRepository;
import com.picpic.repository.SessionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class SessionService {

	private final MemberRepository memberRepository;
	private final FrameRepository frameRepository;
	private final BackgroundRepository backgroundRepository;
	private final SessionRepository sessionRepository;
	private final ParticipantRepository participantRepository;
	private final PasswordEncoder passwordEncoder;
	private final PhotoRepository photoRepository;

	@Transactional
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

		CreateSessionResponseDTO res = CreateSessionResponseDTO.builder()
			.sessionId(session.getSessionId())
			.sessionCode(session.getSessionCode())
			.build();

		MDC.put("sessionId", session.getSessionId().toString());
		MDC.put("memberId", memberId.toString());
		log.info("세션 만들기 성공");

		return res;

	}

	@Transactional
	public EnterSessionResponseDTO enterSession(Long memberId, EnterSessionRequestDTO enterSessionRequestDTO) {

		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER)
		);

		Session session = sessionRepository.findBySessionCode(enterSessionRequestDTO.sessionCode()).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		if (session.getStatus() != Session.SessionStatus.WAITING) {
			throw new ApiException(ErrorCode.ALREADY_STARTED);
		}

		if (
			Long.compare(session.getMember().getMemberId(), member.getMemberId()) != 0
				&& session.getPassword() != null) {

			if (!passwordEncoder.matches(enterSessionRequestDTO.password(), session.getPassword())) {
				throw new ApiException(ErrorCode.INCORRECT_PASSWORD);
			}
		}

		List<Participant> participants = participantRepository.findManyBySession(session);

		if (participants.size() >= 6) {
			throw new ApiException(ErrorCode.SESSION_FULL);
		}

		participants.stream().forEach(participant -> {
			if (Long.compare(participant.getMember().getMemberId(), member.getMemberId()) == 0) {
				throw new ApiException(ErrorCode.ALREADY_ENTERED);
			}
		});

		Participant participant = Participant.builder()
			.session(session)
			.member(member)
			.build();

		participantRepository.save(participant);

		participants.add(participant);

		EnterSessionResponseDTO res = EnterSessionResponseDTO.builder()
			.type("session_enter")
			.status(session.getStatus().toString())
			.sessionId(session.getSessionId())
			.participants(
				participants.stream()
					.map(p -> {
						return EnterSessionResponseDTO.ParticipantListDTO.builder()
							.memeberId(p.getMember().getMemberId())
							.nickname(p.getMember().getNickname())
							.color(p.getMember().getColor())
							.profileImageUrl(p.getMember().getProfileImageUrl())
							.isOwner(session.getMember().getMemberId().equals(p.getMember().getMemberId()))
							.isMe(p.getMember().getMemberId().equals(member.getMemberId()))
							.build();
					})
					.toList()
			)
			.build();

		MDC.put("sessionId", session.getSessionId().toString());
		MDC.put("memberId", member.getMemberId().toString());
		log.info("세션 입장 성공");
		return res;
	}

	@Transactional
	public StartSessionResponseDTO startSession(Long memberId, StartSessionRequestDTO startSessionRequestDTO) {

		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER)
		);

		Session session = sessionRepository.findById(startSessionRequestDTO.sessionId()).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		if (session.getStatus() != Session.SessionStatus.WAITING) {
			throw new ApiException(ErrorCode.ALREADY_STARTED);
		}

		if (Long.compare(session.getMember().getMemberId(), member.getMemberId()) != 0) {
			throw new ApiException(ErrorCode.OWNER_CAN_START);
		}

		session.start();
		sessionRepository.save(session);

		StartSessionResponseDTO res = StartSessionResponseDTO.builder()
			.type("session_start")
			.build();

		MDC.put("sessionId", session.getSessionId().toString());
		MDC.put("memerId", member.getMemberId().toString());
		log.info("세션 시작 성공");
		return res;
	}

	@Transactional
	public GetSessionFrameResponseDTO getSessionFrame(Long memberId, Long sessionId) {
		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER)
		);

		Session session = sessionRepository.findById(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		Boolean isParticipant = participantRepository.existsBySessionAndMember(session, member);

		if (!isParticipant) {
			throw new ApiException(ErrorCode.FORBIDDEN_ACCESS);
		}

		Frame frame = session.getFrame();

		GetSessionFrameResponseDTO res = GetSessionFrameResponseDTO.builder()
			.frameId(frame.getFrameId())
			.frameImageUrl(frame.getFrameImageUrl())
			.slotCount(frame.getSlotCount())
			.build();

		log.info("세션 프레임 정보 반환");

		return res;

	}

	public List<GetSessionPhotosResponseDTO> getSessionPhotos(Long memberId, Long sessionId) {
		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER)
		);

		Session session = sessionRepository.findById(sessionId).orElseThrow(
			() -> new ApiException(ErrorCode.NOT_FOUND_SESSION)
		);

		Boolean isParticipant = participantRepository.existsBySessionAndMember(session, member);

		if (!isParticipant) {
			throw new ApiException(ErrorCode.FORBIDDEN_ACCESS);
		}

		List<Photo> photoList = photoRepository.findManyBySession(session);

		List<GetSessionPhotosResponseDTO> res = photoList.stream()
			.map(photo -> {
				return GetSessionPhotosResponseDTO.builder()
					.slotIndex(photo.getSlotIndex())
					.photoImageUrl(photo.getPhotoImageUrl())
					.build();
			}).toList();

		log.info("세션 사진 목록 반환");

		return res;
	}

	@Transactional
	public ExitSessionResponseDTO exitSession(Long memberId, ExitSessionRequestDTO exitSessionRequestDTO) {
		Long sessionId = exitSessionRequestDTO.sessionId();
		
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_MEMBER));

		Session session = sessionRepository.findById(sessionId)
			.orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_SESSION));

		Participant participant = participantRepository.findBySessionAndMember(session, member)
			.orElseThrow(() -> new ApiException(ErrorCode.NOT_PARTICIPANT));

		participantRepository.delete(participant);

		MDC.put("sessionId", session.getSessionId().toString());

		ExitSessionResponseDTO res = ExitSessionResponseDTO.builder()
			.type("session_exit")
			.memberId(memberId)
			.isOwner(Long.compare(session.getMember().getMemberId(), memberId) == 0)
			.build();

		MDC.put("sessionId", session.getSessionId().toString());
		MDC.put("memberId", memberId.toString());
		log.info("세션 나가기 성공");

		return res;
	}

}
