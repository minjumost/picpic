package com.picpic.dto.session;

import lombok.Builder;

@Builder
public record ExitSessionResponseDTO(
	String type,
	Long memberId,
	Boolean isOwner
) {
}
