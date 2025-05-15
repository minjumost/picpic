package com.picpic.dto.session;

import lombok.Builder;

@Builder
public record GetSessionFrameResponseDTO(
	Long frameId,
	String frameImageUrl,
	Integer slotCount
) {
}
