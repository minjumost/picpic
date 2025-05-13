package com.picpic.dto.photo;

public record PhotoRequsetDTO(
	Long sessionId,
	Integer slotIndex,
	String editedImageUrl
) {
}
