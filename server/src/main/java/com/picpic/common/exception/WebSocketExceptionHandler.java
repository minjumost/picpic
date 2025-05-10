package com.picpic.common.exception;

import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.picpic.common.response.ApiResponse;

@Controller
public class WebSocketExceptionHandler {

	@MessageExceptionHandler(ApiException.class)
	@SendToUser("/private")
	public ApiResponse<Void> handleApiException(ApiException e) {
		return ApiResponse.error(e.getErrorCode());
	}

	@MessageExceptionHandler(Exception.class)
	@SendToUser("/private")
	public ApiResponse<Void> handleException(Exception e) {
		return ApiResponse.error(ErrorCode.INTERNAL_ERROR);
	}
}
