package com.picpic.dto.photo;

import lombok.Builder;

@Builder
public record PhotoUploadRequestDTO(
Long memberId,
Long sessionId,
Integer slotIndex,
String url
) {
}
