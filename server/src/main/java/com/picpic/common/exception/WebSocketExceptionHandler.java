package com.picpic.common.exception;

import java.security.Principal;

import org.slf4j.MDC;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;

import com.picpic.common.response.ApiResponse;

import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class WebSocketExceptionHandler {

	@MessageExceptionHandler(ApiException.class)
	@SendToUser("/private/error")
	public ApiResponse<Void> handleApiException(ApiException e, Principal principal) {
		if (principal != null) {
			MDC.put("memberId", principal.getName());
		} else {
			MDC.put("memberId", "anonymous");
		}
		
		log.warn(e.getMessage(), e);

		return ApiResponse.error(e.getErrorCode());
	}

	@MessageExceptionHandler(Exception.class)
	@SendToUser("/private/error")
	public ApiResponse<Void> handleException(Exception e) {
		return ApiResponse.error(ErrorCode.INTERNAL_ERROR);
	}
}
