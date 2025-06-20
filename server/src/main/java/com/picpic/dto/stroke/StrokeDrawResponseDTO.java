package com.picpic.dto.stroke;

import java.util.List;
import com.picpic.entity.Stroke.Tool;

public record StrokeDrawResponseDTO(
	String type,
	String color,
	Integer lineWidth,
	List<Point> points,
	Tool tool
) {
	public record Point(
		int x,
		int y
	) {}
}

