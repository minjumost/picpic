package com.picpic.dto.stroke;

import java.time.Instant;

public record StrokeStartResponseDTO(
	String type,
	Instant startTime,
	Integer duration
) {
}
