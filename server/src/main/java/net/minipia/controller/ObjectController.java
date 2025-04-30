package net.minipia.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import net.minipia.apiPayload.ApiResponseDTO;
import net.minipia.dto.ReadAllObjectsResponseDTO;
import net.minipia.service.ObjectService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ObjectController {
	private final ObjectService objectService;

	@GetMapping("/api/v1/objects")
	public ApiResponseDTO<ReadAllObjectsResponseDTO> readALlObjects() {
		ReadAllObjectsResponseDTO res = objectService.readAllObjects();
		return ApiResponseDTO.onSuccess(res);
	}
}
