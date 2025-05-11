package com.picpic.dto;

import lombok.Builder;

@Builder
public record S3ImageUploadResponseDTO(
	String presignedUrl,
	String imageUrl
) {
}
