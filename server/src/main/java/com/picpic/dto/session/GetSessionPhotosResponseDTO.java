package com.picpic.dto.session;

import lombok.Builder;

@Builder
public record GetSessionPhotosResponseDTO(
	Integer slotIndex,
	String photoImageUrl
) {
}
