package com.picpic.dto.photo;

import java.util.List;

public record PhotoUploadResponseDTO(
	String type,
	List<PhotoInfoDTO> photoList
) {
}
