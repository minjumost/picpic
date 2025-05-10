package com.picpic.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.picpic.common.exception.ErrorCode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ApiResponse<T> {
	private final boolean success;
	private final int code;
	private final String message;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private final T result;

	public static <T> ApiResponse<T> success(T result) {
		return ApiResponse.<T>builder()
			.success(true)
			.code(200)
			.message("요청이 성공적으로 처리되었습니다.")
			.result(result)
			.build();
	}

	public static ApiResponse<Void> success() {
		return ApiResponse.<Void>builder()
			.success(true)
			.code(200)
			.message("요청이 성공적으로 처리되었습니다.")
			.result(null)
			.build();
	}

	public static ApiResponse<Void> error(ErrorCode errorCode) {
		return ApiResponse.<Void>builder()
			.success(false)
			.code(errorCode.getCode())
			.message(errorCode.getMessage())
			.result(null)
			.build();
	}

	public static <T> ApiResponse<T> error(ErrorCode errorCode, T result) {
		return ApiResponse.<T>builder()
			.success(false)
			.code(errorCode.getCode())
			.message(errorCode.getMessage())
			.result(result)
			.build();
	}
}
