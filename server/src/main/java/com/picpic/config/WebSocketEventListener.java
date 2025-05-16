package com.picpic.config;

import java.security.Principal;

import org.slf4j.MDC;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import com.picpic.dto.session.ExitSessionResponseDTO;
import com.picpic.entity.Member;
import com.picpic.entity.Session;
import com.picpic.repository.MemberRepository;
import com.picpic.repository.ParticipantRepository;
import com.picpic.repository.SessionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

	private final SimpMessagingTemplate messagingTemplate;
	private final ParticipantRepository participantRepository;
	private final WebSocketContext webSocketContext;
	private final MemberRepository memberRepository;
	private final SessionRepository sessionRepository;

	@EventListener
	public void handleWebSocketConnectListener(SessionConnectEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		Principal user = accessor.getUser();

		if (user != null) {
			Long memberId = Long.parseLong(user.getName());
			MDC.put("memberId", memberId.toString());
			log.info("WebSocket 연결됨");
		}

	}

	@EventListener
	public void handleWebSocketConnectedListener(SessionConnectedEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		log.info("STOMP 연결 완료");
	}

	@EventListener
	public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
		String stompSessionId = StompHeaderAccessor.wrap(event.getMessage()).getSessionId();

		webSocketContext.remove(stompSessionId).ifPresent(entry -> {
			Long memberId = entry.memberId();
			Long sessionId = entry.sessionId();

			try {
				MDC.put("memberId", memberId.toString());
				MDC.put("sessionId", sessionId.toString());

				Member member = memberRepository.findById(memberId).orElse(null);
				Session session = sessionRepository.findById(sessionId).orElse(null);

				if (member != null && session != null) {
					participantRepository.deleteByMemberAndSession(member, session);

					boolean isOwner = session.getMember().getMemberId().equals(memberId);

					messagingTemplate.convertAndSend(
						"/broadcast/" + session.getSessionCode(),
						new ExitSessionResponseDTO("session_exit", memberId, isOwner)
					);

					log.info("세션 퇴장");
				}
			} finally {
				MDC.clear();
			}
		});
		log.info("웹소켓 연결 종료");
	}

	@EventListener
	public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		log.info("구독 요청");
	}

	@EventListener
	public void handleWebSocketUnsubscribeListener(SessionUnsubscribeEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		log.info("구독 취소");
	}

}
