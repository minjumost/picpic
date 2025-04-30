package net.minipia.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import net.minipia.apiPayload.ApiResponseDTO;
import net.minipia.dto.CreateRoomResponseDTO;
import net.minipia.dto.ReadAllObjectsResponseDTO;
import net.minipia.dto.ReadObjectsInRangeRequestDTO;
import net.minipia.dto.ReadObjectsInRangeResponseDTO;
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

	@PostMapping("/api/v1/room/{code}/objects")
	public ApiResponseDTO<List<ReadObjectsInRangeResponseDTO>> readObjectsInRange(@PathVariable String code, @RequestBody ReadObjectsInRangeRequestDTO req) {
		List<ReadObjectsInRangeResponseDTO> res = roomService.readObjectsInRange(code, req);
		return ApiResponseDTO.onSuccess(res);
	}
}
