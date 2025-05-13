package com.picpic.dto.photo;

import lombok.Builder;

@Builder
public record PhotoStartRequestDTO(
	Long sessionId,
	String sessionCode,
	Integer slotIndex
) {
}
