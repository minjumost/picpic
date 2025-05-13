package com.picpic.common.filter;

import java.io.IOException;
import java.security.Principal;
import java.util.UUID;

import org.slf4j.MDC;
import org.springframework.web.filter.OncePerRequestFilter;

import com.picpic.config.QueryInspector;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LogFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {

		long start = System.currentTimeMillis();

		try {
			HttpServletRequest httpRequest = (HttpServletRequest)request;

			// ✅ 고유 요청 ID
			MDC.put("requestId", UUID.randomUUID().toString());

			// ✅ 사용자 ID
			String memberId = "anonymous";
			Principal principal = httpRequest.getUserPrincipal();
			if (principal != null) {
				memberId = principal.getName();
			}
			MDC.put("memberId", memberId);

			// ✅ 요청 정보
			MDC.put("remoteAddr", httpRequest.getRemoteAddr());
			MDC.put("method", httpRequest.getMethod());
			MDC.put("uri", httpRequest.getRequestURI());

			// ✅ 추가 정보: User-Agent, Referer
			MDC.put("userAgent", httpRequest.getHeader("User-Agent"));
			MDC.put("referer", httpRequest.getHeader("Referer"));

			filterChain.doFilter(request, response);
		} finally {

			long duration = System.currentTimeMillis() - start;
			int queryCount = QueryInspector.getQueryCount();

			boolean slow = duration > 500;
			boolean chatty = queryCount > 10;

			if (slow && chatty) {
				log.warn("요청 느림 - {}ms  쿼리 많음 - {}개", duration, queryCount);
			} else if (slow) {
				log.warn("요청 느림 - {}ms", duration);
			} else if (chatty) {
				log.warn("쿼리 많음 - {}개", queryCount);
			}

			MDC.clear();
			QueryInspector.clear();
		}

	}

}


