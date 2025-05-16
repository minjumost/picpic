package com.picpic.dto.session;

public record ExitSessionRequestDTO(
	Long sessionId,
	String sessionCode
) {
}
