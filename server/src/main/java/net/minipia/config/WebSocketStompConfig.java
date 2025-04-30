package net.minipia.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketStompConfig implements WebSocketMessageBrokerConfigurer {

	/*
	클라이언트가 WebSocket 서버에 연결할 때 사용할 엔드포인트를 등록
	/rooms 이라는 URL로 클라이언트가 WebSocket 연결을 시작
	이 엔드포인트를 통해 STOMP 프로토콜을 사용해 통신할 준비
	 */
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/rooms");
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		// 서버 → 클라이언트 브로드캐스트
		registry.enableSimpleBroker("/topic");
		// 클라이언트 → 서버로 요청
		registry.setApplicationDestinationPrefixes("/app");
	}
}
