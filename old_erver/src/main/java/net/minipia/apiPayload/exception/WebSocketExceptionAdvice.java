package net.minipia.apiPayload.exception;

import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import net.minipia.apiPayload.ApiResponseDTO;
import net.minipia.apiPayload.code.status.ErrorStatus;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class WebSocketExceptionAdvice {

	@MessageExceptionHandler(GeneralException.class)
	@SendToUser("/queue/errors")
	public ApiResponseDTO<?> handleGeneralException(GeneralException e) {
		log.error("[WS 예외 발생] code={} message={}", e.getErrorReasonHttpStatus().getCode(), e.getMessage(), e);
		return ApiResponseDTO.onFailure(
			e.getErrorReasonHttpStatus().getCode(),
			e.getErrorReasonHttpStatus().getMessage(),
			null
		);
	}

	@MessageExceptionHandler(Exception.class)
	@SendToUser("/queue/errors")
	public ApiResponseDTO<?> handleAll(Exception e) {
		log.error("[WS 알 수 없는 예외] message={}", e.getMessage(), e);
		return ApiResponseDTO.onFailure(
			ErrorStatus.INTERNAL_SERVER_ERROR.getCode(),
			"웹소켓 처리 중 서버 오류가 발생했습니다.",
			null
		);
	}
}
