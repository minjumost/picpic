package net.minipia.dto;

import lombok.Builder;

@Builder
public record RemoveObjectResponseDTO(
	String type,
	RemoveObjectPayloadDTO payload
) {
}

