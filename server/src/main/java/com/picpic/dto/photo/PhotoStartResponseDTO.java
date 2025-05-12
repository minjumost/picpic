package com.picpic.dto.photo;

public record PhotoStartResponseDTO(
	String type,
	String sessionCode,
	Integer slotIndex,
	Long memberId
) {
}
