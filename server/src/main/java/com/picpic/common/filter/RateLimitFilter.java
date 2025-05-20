package com.picpic.common.filter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

import org.springframework.web.filter.OncePerRequestFilter;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import com.picpic.auth.JwtTokenProvider;
import com.picpic.common.exception.ApiException;
import com.picpic.common.exception.ErrorCode;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;

	private final LoadingCache<String, Bucket> ipBuckets = Caffeine.newBuilder()
		.expireAfterAccess(10, TimeUnit.MINUTES)
		.maximumSize(10_000)
		.build(this::createLoginBucket);

	private final LoadingCache<Long, Bucket> userBuckets = Caffeine.newBuilder()
		.expireAfterAccess(10, TimeUnit.MINUTES)
		.maximumSize(10_000)
		.build(this::createUserBucket);

	@Override
	protected void doFilterInternal(HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {

		String path = request.getRequestURI();

		// 1. 로그인 관련 요청은 IP 기준 제한
		if (path.contains("/auth")) {
			String ip = request.getRemoteAddr();
			Bucket ipBucket = ipBuckets.get(ip);

			if (!ipBucket.tryConsume(1)) {
				throw new ApiException(ErrorCode.AUTH_LIMIT);
			}

			filterChain.doFilter(request, response);
			return;
		}

		if (path.contains("/oauth")) {
			String ip = request.getRemoteAddr();
			Bucket ipBucket = ipBuckets.get(ip);

			if (!ipBucket.tryConsume(1)) {
				throw new ApiException(ErrorCode.AUTH_LIMIT);
			}

			filterChain.doFilter(request, response);
			return;
		}

		// 2. 나머지는 로그인된 사용자 기준 제한
		String token = jwtTokenProvider.resolveToken(request);

		Long memberId = jwtTokenProvider.getMemberId(token);
		Bucket userBucket = userBuckets.get(memberId);

		if (!userBucket.tryConsume(1)) {
			throw new ApiException(ErrorCode.RATE_LIMIT);
		}

		filterChain.doFilter(request, response);
	}

	private Bucket createLoginBucket(String ip) {
		return Bucket.builder()
			.addLimit(Bandwidth.classic(100, Refill.intervally(10, Duration.ofSeconds(1))))
			.build();
	}

	private Bucket createUserBucket(Long memberId) {
		return Bucket.builder()
			.addLimit(Bandwidth.classic(10, Refill.intervally(30, Duration.ofSeconds(1))))
			.build();
	}
}
