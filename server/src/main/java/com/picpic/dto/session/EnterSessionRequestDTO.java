package com.picpic.dto.session;

public record EnterSessionRequestDTO(
	String sessionCode,
	String password
) {
}
