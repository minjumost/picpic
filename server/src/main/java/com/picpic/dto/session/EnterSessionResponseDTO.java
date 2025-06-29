package com.picpic.dto.session;

import java.util.List;

import lombok.Builder;

@Builder
public record EnterSessionResponseDTO(
	String type,
	Long sessionId,
	String status,
	List<ParticipantListDTO> participants
) {
	@Builder
	public record ParticipantListDTO(
		Long memberId,
		String nickname,
		String profileImageUrl,
		String color,
		Boolean isOwner
	) {
	}
}
