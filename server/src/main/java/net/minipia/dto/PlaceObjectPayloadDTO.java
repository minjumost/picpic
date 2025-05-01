package net.minipia.dto;

import lombok.Builder;

@Builder
public record PlaceObjectPayloadDTO(
	Long roomObjectId,
	int posX,
	int posY,
	Byte type,
	Long objectId,
	int width,
	int height,
	String imageUrl
) {
}
