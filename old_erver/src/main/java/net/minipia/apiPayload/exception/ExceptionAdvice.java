package net.minipia.apiPayload.exception;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import net.minipia.apiPayload.ApiResponseDTO;
import net.minipia.apiPayload.code.ErrorReasonDTO;
import net.minipia.apiPayload.code.status.ErrorStatus;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class ExceptionAdvice extends ResponseEntityExceptionHandler {

	/**
	 * 공통 에러 응답 생성 메서드
	 */
	private ResponseEntity<Object> buildErrorResponse(Exception e, ErrorReasonDTO errorReason, WebRequest request,
		Object errorDetail) {
		log.error("[예외 발생] code={} message={} detail={}", errorReason.getCode(), errorReason.getMessage(), errorDetail,
			e);

		ApiResponseDTO<Object> body = ApiResponseDTO.onFailure(
			errorReason.getCode(),
			errorReason.getMessage(),
			errorDetail
		);

		return super.handleExceptionInternal(e, body, HttpHeaders.EMPTY, errorReason.getHttpStatus(), request);
	}

	/**
	 * MethodArgumentNotValidException 처리 (RequestBody 유효성 검증 실패)
	 */
	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(
		MethodArgumentNotValidException e, HttpHeaders headers, HttpStatusCode status, WebRequest request) {

		Map<String, String> errors = new LinkedHashMap<>();

		e.getBindingResult().getFieldErrors().forEach(fieldError -> {
			String fieldName = fieldError.getField();
			String errorMessage = Optional.ofNullable(fieldError.getDefaultMessage()).orElse("");
			errors.merge(fieldName, errorMessage,
				(existing, newMsg) -> existing + ", " + newMsg);
		});

		return buildErrorResponse(e, ErrorStatus.INVALID_REQUEST_BODY.getReasonHttpStatus(), request, errors);
	}

	@Override
	protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
		HttpHeaders headers, HttpStatusCode status, WebRequest request) {
		return buildErrorResponse(ex, ErrorStatus.MALFORMED_JSON.getReasonHttpStatus(), request, null);
	}

	@Override
	protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex,
		HttpHeaders headers, HttpStatusCode status, WebRequest request) {
		return buildErrorResponse(ex, ErrorStatus.METHOD_NOT_ALLOWED.getReasonHttpStatus(), request, null);
	}

	@Override
	protected ResponseEntity<Object> handleNoResourceFoundException(NoResourceFoundException ex, HttpHeaders headers,
		HttpStatusCode status, WebRequest request) {
		return buildErrorResponse(ex, ErrorStatus.RESOURCE_NOT_FOUND.getReasonHttpStatus(), request, null);
	}

	/**
	 * 커스텀 예외 처리
	 */
	@ExceptionHandler(GeneralException.class)
	public ResponseEntity<Object> handleGeneralException(GeneralException e, WebRequest request) {
		return buildErrorResponse(e, e.getErrorReasonHttpStatus(), request, null);
	}

	/**
	 * 그 외 모든 예외 처리
	 */

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Object> handleUnknownException(Exception e, WebRequest request) {
		return buildErrorResponse(e, ErrorStatus.INTERNAL_SERVER_ERROR.getReasonHttpStatus(), request, null);
	}

}
