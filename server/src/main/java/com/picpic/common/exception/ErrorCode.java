package com.picpic.common.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public enum ErrorCode {

	// 🔐 인증/인가
	UNAUTHORIZED(1001, HttpStatus.UNAUTHORIZED, "인증이 필요합니다."),
	FORBIDDEN(1002, HttpStatus.FORBIDDEN, "권한이 없습니다."),
	EXPIRED_TOKEN(1003, HttpStatus.UNAUTHORIZED, "토큰이 만료됐습니다."),
	UNAVAILABLE_TOKEN(1004, HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),

	// 🔍 리소스 없음
	NOT_FOUND(3000, HttpStatus.NOT_FOUND, "요청하신 리소스를 찾을 수 없습니다."),

	// ❌ 잘못된 요청
	BAD_REQUEST(4000, HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
	INVALID_INPUT_VALUE(4001, HttpStatus.BAD_REQUEST, "입력값이 올바르지 않습니다."),

	// ⚙️ 서버 오류
	INTERNAL_ERROR(5000, HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류입니다.");

	private final int code;
	private final HttpStatus status;
	private final String message;

	ErrorCode(int code, HttpStatus status, String message) {
		this.code = code;
		this.status = status;
		this.message = message;
	}
}
