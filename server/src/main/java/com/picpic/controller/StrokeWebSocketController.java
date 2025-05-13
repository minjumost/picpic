package com.picpic.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.picpic.dto.stroke.StrokeStartRequestDTO;
import com.picpic.dto.stroke.StrokeStartResponseDTO;
import com.picpic.service.StrokeService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class StrokeWebSocketController {

	private final StrokeService strokeService;
	private final SimpMessagingTemplate messagingTemplate;

	@MessageMapping("stroke/start")
	public void strokeStart(Principal principal, StrokeStartRequestDTO strokeStartRequestDTO) {
		Long memberId = Long.parseLong(principal.getName());
		StrokeStartResponseDTO res = strokeService.startStroke(memberId, strokeStartRequestDTO.sessionId());
		messagingTemplate.convertAndSend("/broadcast/" + strokeStartRequestDTO.sessionCode(), res);
	}
}
