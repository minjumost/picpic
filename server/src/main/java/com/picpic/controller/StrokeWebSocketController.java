package com.picpic.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.picpic.dto.stroke.StrokeDrawRequestDTO;
import com.picpic.dto.stroke.StrokeDrawResponseDTO;
import com.picpic.dto.stroke.StrokeReadyRequestDTO;
import com.picpic.dto.stroke.StrokeReadyResponseDTO;
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

	@MessageMapping("stroke")
	public void stroke(Principal principal, StrokeDrawRequestDTO strokeDrawRequestDTO) {
		Long memberId = Long.parseLong(principal.getName());
		StrokeDrawResponseDTO res = strokeService.stroke(memberId, strokeDrawRequestDTO);
		messagingTemplate.convertAndSend("/broadcast/" + strokeDrawRequestDTO.sessionCode(), res);
	}

	@MessageMapping("stroke/ready")
	public void strokeReady(Principal principal, StrokeReadyRequestDTO strokeReadyRequestDTO) {
		Long memberId = Long.parseLong(principal.getName());
		StrokeReadyResponseDTO res = strokeService.ready(memberId, strokeReadyRequestDTO.sessionId());
		messagingTemplate.convertAndSend("/broadcast/" + strokeReadyRequestDTO.sessionCode(), res);
	}
}
