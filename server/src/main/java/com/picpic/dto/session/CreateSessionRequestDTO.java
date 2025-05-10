package com.picpic.dto.session;

import jakarta.validation.constraints.NotNull;

public record CreateSessionRequestDTO(
	@NotNull(message = "널일 수 없습니다.")
	Long frameId,

	@NotNull(message = "널일 수 없습니다.")
	Long backgroundId,
	String password
) {

}
