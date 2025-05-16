package com.picpic.config;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WebSocketContext {

	private final RedisTemplate<String, Object> redisTemplate;
	private static final String PREFIX = "ws:session:";

	public void register(String stompSessionId, Long memberId, Long sessionId) {
		String key = PREFIX + stompSessionId;
		Map<String, Object> value = Map.of(
			"memberId", memberId,
			"sessionId", sessionId
		);
		redisTemplate.opsForHash().putAll(key, value);
		redisTemplate.expire(key, Duration.ofMinutes(30)); // TTL 30분
	}

	public Optional<SessionContextEntry> remove(String stompSessionId) {
		String key = PREFIX + stompSessionId;
		Map<Object, Object> value = redisTemplate.opsForHash().entries(key);

		redisTemplate.delete(key); // 제거

		if (value.isEmpty())
			return Optional.empty();

		Long memberId = Long.valueOf(value.get("memberId").toString());
		Long sessionId = Long.valueOf(value.get("sessionId").toString());
		return Optional.of(new SessionContextEntry(memberId, sessionId));
	}

	public Optional<SessionContextEntry> get(String stompSessionId) {
		String key = PREFIX + stompSessionId;
		Map<Object, Object> value = redisTemplate.opsForHash().entries(key);

		if (value.isEmpty())
			return Optional.empty();

		Long memberId = Long.valueOf(value.get("memberId").toString());
		Long sessionId = Long.valueOf(value.get("sessionId").toString());
		return Optional.of(new SessionContextEntry(memberId, sessionId));
	}

	public record SessionContextEntry(Long memberId, Long sessionId) {
	}
}
