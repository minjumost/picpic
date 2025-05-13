package com.picpic.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class WebSocketMessageInterceptor implements ChannelInterceptor {

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
		StompCommand command = accessor.getCommand();
		String destination = accessor.getDestination();
		String sessionId = accessor.getSessionId();

		if (command != null && command.equals(StompCommand.SEND)) {
			// 클라이언트가 보낸 메시지
			log.info("📥 [RECEIVED] from client - [sessionId={}] [destination={}] payload={}", sessionId, destination,
				message.getPayload());
		}

		return message;
	}

	@Override
	public void afterSendCompletion(Message<?> message, MessageChannel channel, boolean sent, Exception ex) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
		StompCommand command = accessor.getCommand();
		String destination = accessor.getDestination();
		String sessionId = accessor.getSessionId();

		log.info("📤 [SENT] to client - [sessionId={}] [destination={}] payload={}", sessionId, destination,
			message.getPayload());

	}
}
