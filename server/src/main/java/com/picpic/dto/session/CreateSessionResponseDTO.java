package com.picpic.dto.session;

import lombok.Builder;

@Builder
public record CreateSessionResponseDTO(
	Long sessionId,
	String sessionCode
) {
}
