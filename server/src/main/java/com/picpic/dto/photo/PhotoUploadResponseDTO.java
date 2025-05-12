package com.picpic.dto.photo;

public record PhotoUploadResponseDTO(
	String type,
	String sessionCode,
	Integer slotIndex,
	Long memberId,
	String url
) {
}
