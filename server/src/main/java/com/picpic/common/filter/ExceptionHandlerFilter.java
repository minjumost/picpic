package com.picpic.common.filter;

import java.io.IOException;

import org.springframework.web.filter.OncePerRequestFilter;

import com.picpic.common.exception.ApiException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ExceptionHandlerFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {

		try {
			System.out.println(1);
			filterChain.doFilter(request, response);
		} catch (ApiException e) {

			response.setCharacterEncoding("UTF-8");
			response.setContentType("application/json; charset=UTF-8");
			response.setStatus(e.getErrorCode().getStatus().value());
			response.getWriter().write("""
				{
				  "success": false,
				  "code": %s,
				  "message": "%s",
				}
				""".formatted(e.getErrorCode().getCode(), e.getErrorCode().getMessage()));
		}
	}
}
