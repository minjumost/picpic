package com.picpic.dto.session;

public record StartSessionRequestDTO(
	Long sessionId,
	String sessionCode
) {
}
