package com.picpic.controller;

import java.security.Principal;

import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.picpic.config.WebSocketContext;
import com.picpic.dto.session.EnterSessionRequestDTO;
import com.picpic.dto.session.EnterSessionResponseDTO;
import com.picpic.dto.session.StartSessionRequestDTO;
import com.picpic.dto.session.StartSessionResponseDTO;
import com.picpic.service.SessionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
public class SessionWebSocketController {

	private final SessionService sessionService;
	private final SimpMessagingTemplate messagingTemplate;
	private final WebSocketContext webSocketContext;

	@MessageMapping("/session/enter")
	public void enterSession(Message<?> message, Principal principal, EnterSessionRequestDTO enterSessionRequestDTO) {
		Long memberId = Long.parseLong(principal.getName());
		EnterSessionResponseDTO res = sessionService.enterSession(memberId, enterSessionRequestDTO);

		// redis 입장정보 기록
		String stompSessionId = StompHeaderAccessor.wrap(message).getSessionId();
		Long sessionId = res.sessionId();
		webSocketContext.register(stompSessionId, memberId, sessionId);

		messagingTemplate.convertAndSend("/broadcast/" + enterSessionRequestDTO.sessionCode(), res);
	}

	@MessageMapping("/session/start")
	public void startSession(Principal principal, StartSessionRequestDTO startSessionRequestDTO) {
		Long memberId = Long.parseLong(principal.getName());
		StartSessionResponseDTO res = sessionService.startSession(memberId, startSessionRequestDTO);
		messagingTemplate.convertAndSend("/broadcast/" + startSessionRequestDTO.sessionCode(), res);
	}
}
