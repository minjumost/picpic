package net.minipia.dto;

import lombok.Builder;

@Builder
public record RemoveObjectPayloadDTO(
	Long roomObjectId
) {
}
