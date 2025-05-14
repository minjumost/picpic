package com.picpic.dto.photo;

import lombok.Builder;

@Builder
public record PhotoUploadRequestDTO(
	Long sessionId,
	String sessionCode,
	Integer slotIndex,
	String url
) {
}
