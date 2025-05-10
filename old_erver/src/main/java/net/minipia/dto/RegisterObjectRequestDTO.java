package net.minipia.dto;

public record RegisterObjectRequestDTO(
	byte type,              // 바이트 타입
	String fileName,
	String contentType,
	int width,              // 가구 너비
	int height              // 가구 높이
) {
}
