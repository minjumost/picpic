package com.picpic.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.picpic.dto.photo.PhotoStartRequestDTO;
import com.picpic.dto.photo.PhotoStartResponseDTO;
import com.picpic.dto.photo.PhotoUploadRequestDTO;
import com.picpic.dto.photo.PhotoUploadResponseDTO;
import com.picpic.service.PhotoService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class PhotoWebSocketController {

	private final PhotoService photoService;
	private final SimpMessagingTemplate messagingTemplate;

	@MessageMapping("photo/start")
	public void startPhoto(Principal principal, PhotoStartRequestDTO photoStartRequestDTO) {
		Long memberId = Long.parseLong(principal.getName());
		Long sessionId = photoStartRequestDTO.sessionId();
		PhotoStartResponseDTO res = photoService.startPhoto(sessionId, memberId, photoStartRequestDTO);
		messagingTemplate.convertAndSend("/broadcast/" + photoStartRequestDTO.sessionCode(), res);

	}

	@MessageMapping("photo/upload")
	public void uploadPhoto(Principal principal, PhotoUploadRequestDTO photoUploadRequestDTO) {
		Long memberId = Long.parseLong(principal.getName());
		Long sessionId = photoUploadRequestDTO.sessionId();
		PhotoUploadResponseDTO res = photoService.uploadPhoto(sessionId, memberId, photoUploadRequestDTO);
		messagingTemplate.convertAndSend("/broadcast/" + photoUploadRequestDTO.sessionCode(), res);

	}

	@MessageMapping("photo/end")
	public void endPhoto(Principal principal) {

	}
}
