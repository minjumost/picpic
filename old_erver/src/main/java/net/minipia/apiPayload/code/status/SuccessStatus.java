package net.minipia.apiPayload.code.status;

import org.springframework.http.HttpStatus;

import net.minipia.apiPayload.code.BaseErrorCode;
import net.minipia.apiPayload.code.BaseSuccessCode;
import net.minipia.apiPayload.code.ErrorReasonDTO;
import net.minipia.apiPayload.code.SuccessReasonDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SuccessStatus implements BaseSuccessCode {
	OK(HttpStatus.OK, "COMMON2000", "성공입니다"),
	;

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
	@Override
	public SuccessReasonDTO getReason() {
		return SuccessReasonDTO.builder()
			.message(message)
			.code(code)
			.isSuccess(true)
			.build();
	}

	@Override
	public SuccessReasonDTO getReasonHttpStatus() {
		return SuccessReasonDTO.builder()
			.message(message)
			.code(code)
			.isSuccess(true)
			.httpStatus(httpStatus)
			.build();
	}
}