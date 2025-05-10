package net.minipia.dto;

public record RegisterObjectResponseDTO(
	Long id,
	String uploadUrl,       // presigned upload url
	String fileUrl          // 최종 이미지 접근 url
) {
}
