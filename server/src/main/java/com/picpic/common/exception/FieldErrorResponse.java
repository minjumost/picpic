package com.picpic.common.exception;

import lombok.Builder;

@Builder
public record FieldErrorResponse(
	String field,
	Object rejectedValue,
	String reason
) {
}
