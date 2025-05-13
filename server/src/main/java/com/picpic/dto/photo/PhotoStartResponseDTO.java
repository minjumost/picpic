package com.picpic.dto.photo;

public record PhotoStartResponseDTO(
	String type,
	Integer slotIndex,
	Long memberId
) {
}
