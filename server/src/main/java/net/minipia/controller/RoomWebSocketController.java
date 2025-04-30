package net.minipia.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import net.minipia.dto.PlaceObjectRequestDTO;
import net.minipia.dto.RoomEnterMessage;
import net.minipia.service.RoomService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class RoomWebSocketController {
	private final RoomService roomService;
	private final SimpMessagingTemplate simpMessagingTemplate;

	@MessageMapping("/room/enter")
	public void enterRoom(RoomEnterMessage roomEnterMessage) {
		roomService.enterRoom(roomEnterMessage.code());
	}

	@MessageMapping("/room/object/place")
	public void placeObject(PlaceObjectRequestDTO placeObjectRequestDTO) {
		roomService.placeObject(placeObjectRequestDTO);
	}
}
