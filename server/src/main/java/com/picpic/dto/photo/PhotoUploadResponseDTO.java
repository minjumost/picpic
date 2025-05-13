package com.picpic.dto.photo;

public record PhotoUploadResponseDTO(
	String type,
	Integer slotIndex,
	String url
) {
}
