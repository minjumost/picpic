package com.picpic.dto.background;

import lombok.Builder;

@Builder
public record GetBackgroundListResponseDTO(
	Long backgroundId,
	String name,
	String backgroundImageUrl
) {
}
