package com.picpic.dto.frame;

import lombok.Builder;

@Builder
public record GetFrameListResponseDTO(
	Long frameId,
	String name,
	Integer slotCount,
	String frameImageUrl
) {
}
