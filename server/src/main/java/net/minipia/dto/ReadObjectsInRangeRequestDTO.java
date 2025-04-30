package net.minipia.dto;

import lombok.Builder;

@Builder
public record ReadObjectsInRangeRequestDTO(Integer startX, Integer startY, Integer endX, Integer endY) {
}
