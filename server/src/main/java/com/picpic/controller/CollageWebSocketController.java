package com.picpic.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.picpic.dto.collage.CollageWebSocketRequestDTO;
import com.picpic.dto.collage.CollageWebSocketResponseDTO;
import com.picpic.service.CollageService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class CollageWebSocketController {

	private final SimpMessagingTemplate messagingTemplate;
	private final CollageService collageService;

	@MessageMapping("collage/start")
	public void startCollage(Principal principal, CollageWebSocketRequestDTO collageWebSocketRequestDTO) {
		Long memberId = Long.parseLong(principal.getName());
		Long sessionId = collageWebSocketRequestDTO.sessionId();
		CollageWebSocketResponseDTO res = collageService.startCollage(memberId, sessionId);
		messagingTemplate.convertAndSend("/broadcast/" + collageWebSocketRequestDTO.sessionCode(), res);

	}
}
