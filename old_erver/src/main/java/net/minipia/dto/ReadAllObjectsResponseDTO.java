package net.minipia.dto;

import java.util.List;

import net.minipia.dto.common.ObjectDTO;

import lombok.Builder;

@Builder
public record ReadAllObjectsResponseDTO(List<ObjectDTO> tiles, List<ObjectDTO> objects, List<ObjectDTO> walls) {
}
