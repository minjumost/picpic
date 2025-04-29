package net.minipia.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import net.minipia.apiPayload.ApiResponseDTO;
import net.minipia.dto.CreateRoomResponseDTO;
import net.minipia.service.RoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class RoomController {

	private final RoomService roomService;

	@PostMapping("/api/v1/room")
	public ApiResponseDTO<CreateRoomResponseDTO> createRoom() {
		CreateRoomResponseDTO res = roomService.createRoom();
		return ApiResponseDTO.onSuccess(res);
	}
}
