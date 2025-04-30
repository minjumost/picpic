package net.minipia.dto;

import lombok.Builder;

@Builder
public record PlaceObjectResponseDTO(
	String type,
	PlaceObjectPayloadDTO payload
) {
}

