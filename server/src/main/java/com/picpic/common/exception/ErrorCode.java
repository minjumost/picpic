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
	FORBIDDEN_ACCESS(1005, HttpStatus.FORBIDDEN, "사진 업로드 권한이 없습니다."),

	// 🔍 리소스 없음
	NOT_FOUND(3000, HttpStatus.NOT_FOUND, "요청하신 리소스를 찾을 수 없습니다."),
	NOT_FOUND_MEMBER(3001, HttpStatus.NOT_FOUND, "요청하신 유저를 찾을 수 없습니다."),
	NOT_FOUND_FRAME(3002, HttpStatus.NOT_FOUND, "요청하신 프레임을 찾을 수 없습니다."),
	NOT_FOUND_BACKGROUND(3003, HttpStatus.NOT_FOUND, "요청하신 배경을 찾을 수 없습니다."),
	NOT_FOUND_SESSION(3004, HttpStatus.NOT_FOUND, "요청하신 세션을 찾을 수 없습니다."),
	NOT_FOUND_PHOTO(3005, HttpStatus.BAD_REQUEST, "요청하신 사진을 찾을 수 없습니다."),
	NOT_FOUND_COLLAGE(3006, HttpStatus.BAD_REQUEST, "요청하신 콜라주를 찾을 수 없습니다."),
	// ❌ 잘못된 요청
	BAD_REQUEST(4000, HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
	INVALID_INPUT_VALUE(4001, HttpStatus.BAD_REQUEST, "입력값이 올바르지 않습니다."),
	INCORRECT_PASSWORD(4002, HttpStatus.BAD_REQUEST, "비밀번호가 다릅니다."),
	FINISHED_SESSION(4003, HttpStatus.BAD_REQUEST, "종료된 세션입니다."),
	ALREADY_ENTERED(4004, HttpStatus.BAD_REQUEST, "이미 참여중입니다."),
	SESSION_FULL(4005, HttpStatus.BAD_REQUEST, "최대 인원에 도달하였습니다."),
	ALREADY_STARTED(4006, HttpStatus.BAD_REQUEST, "이미 시작된 세션입니다."),
	OWNER_CAN_START(4007, HttpStatus.BAD_REQUEST, "방장만 시작할 수 있습니다."),
	ALREADY_USED(4008, HttpStatus.BAD_REQUEST, "이미 선택된 슬롯입니다."),
	INVALID_JSON_FORMAT(4009, HttpStatus.BAD_REQUEST, "잘못된 JSON형식 입니다."),
	NOT_PARTICIPANT(4010, HttpStatus.BAD_REQUEST, "참여자가 아닙니다."),

	// ⚙️ 서버 오류
	INTERNAL_ERROR(5000, HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류입니다."),

	// 처리 제한
	AUTH_LIMIT(6001, HttpStatus.TOO_MANY_REQUESTS, "같은 ip에서 1분에 5번만 요청할 수 있습니다."),
	RATE_LIMIT(6002, HttpStatus.TOO_MANY_REQUESTS, "1초에 10번만 요청을 보낼 수 있습니다.");

	private final int code;
	private final HttpStatus status;
	private final String message;

	ErrorCode(int code, HttpStatus status, String message) {
		this.code = code;
		this.status = status;
		this.message = message;
	}
}
