package com.picpic.config;

import org.slf4j.MDC;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class WebSocketEventListener {

	@EventListener
	public void handleWebSocketConnectListener(SessionConnectEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		MDC.put("sessionId", accessor.getSessionId());
		log.info("🟢 WebSocket 연결됨.");
	}

	@EventListener
	public void handleWebSocketConnectedListener(SessionConnectedEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		MDC.put("sessionId", accessor.getSessionId());
		log.info("🟢 STOMP 연결 완료.", accessor.getSessionId());
	}

	@EventListener
	public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		log.info("🔴 WebSocket 연결 끊김. 세션 ID: {}", accessor.getSessionId());
	}

	@EventListener
	public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		log.info("📩 구독 요청. 세션 ID: {}, destination: {}", accessor.getSessionId(), accessor.getDestination());
	}

	@EventListener
	public void handleWebSocketUnsubscribeListener(SessionUnsubscribeEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		log.info("❌ 구독 취소. 세션 ID: {}, destination: {}", accessor.getSessionId(), accessor.getDestination());
	}
}
