package net.minipia.dto;

import lombok.Builder;

@Builder
public record ReadObjectsInRangeResponseDTO(Long id, Byte type, String imageUrl, Integer width, Integer height, Integer posX, Integer posY) {
}
