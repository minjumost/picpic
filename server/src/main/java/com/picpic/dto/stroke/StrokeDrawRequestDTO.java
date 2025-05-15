package com.picpic.dto.stroke;

import java.util.List;

import com.picpic.entity.Stroke.Tool;

public record StrokeDrawRequestDTO(
	Long sessionId,
	String sessionCode,
	Long collageId,
	String color,
	Integer lineWidth,
	List<Point> points,
	Tool tool
) {
	public record Point(
		int x,
		int y
	) {
	}
}
