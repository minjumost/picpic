package com.picpic.dto.collage;

public record CollageWebSocketRequestDTO(
	Long sessionId,
	String sessionCode
) {
}
