package com.picpic.dto.session;

import lombok.Builder;

@Builder
public record EnterSessionResponseDTO(
	String type,
	Long memberId,
	String nickname,
	String profileImageUrl,
	String color
) {
}
