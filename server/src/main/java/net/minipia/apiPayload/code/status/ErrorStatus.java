package net.minipia.apiPayload.code.status;

import org.springframework.http.HttpStatus;

import net.minipia.apiPayload.code.BaseErrorCode;
import net.minipia.apiPayload.code.ErrorReasonDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorStatus implements BaseErrorCode {
	INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON5001", "서버 에러, 관리자에게 문의 바랍니다."),
	INVALID_ROOM_CODE(HttpStatus.NOT_FOUND, "ROOM4001", "잘못된 방 코드입니다."),
	BAD_REQUEST(HttpStatus.BAD_REQUEST, "COMMON4001", "잘못된 요청입니다."),
	INVALID_REQUEST_BODY(HttpStatus.BAD_REQUEST, "COMMON4002", "요청 본문이 유효하지 않습니다."),
	MALFORMED_JSON(HttpStatus.BAD_REQUEST, "COMMON4003", "JSON 형식이 올바르지 않습니다."),
	METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "COMMON4004", "요청 메서드가 유효하지 않습니다."),
	RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMON4005", "요청한 URL을 찾을 수 없습니다.");
	private final HttpStatus httpStatus;
	private final String code;
	private final String message;

	@Override
	public ErrorReasonDTO getReason() {
		return ErrorReasonDTO.builder()
			.message(message)
			.code(code)
			.isSuccess(false)
			.build();
	}

	@Override
	public ErrorReasonDTO getReasonHttpStatus() {
		return ErrorReasonDTO.builder()
			.message(message)
			.code(code)
			.isSuccess(false)
			.httpStatus(httpStatus)
			.build();
	}
}