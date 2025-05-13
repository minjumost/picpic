package com.picpic.common.filter;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.filter.Filter;
import ch.qos.logback.core.spi.FilterReply;

/**
 * MDC에 requestId가 있는지를 기준으로 로그 라우팅을 수행하는 필터입니다.
 * - requestId가 존재하면 요청 기반 로그로 간주하여 ACCEPT
 * - 존재하지 않으면 내부 로그로 간주하거나 반대 조건으로 설정 가능
 */
public class LogRoutingFilter extends Filter<ILoggingEvent> {

	private boolean acceptIfRequestIdExists = true;

	public void setAcceptIfRequestIdExists(boolean acceptIfRequestIdExists) {
		this.acceptIfRequestIdExists = acceptIfRequestIdExists;
	}

	@Override
	public FilterReply decide(ILoggingEvent event) {
		String requestId = event.getMDCPropertyMap().get("requestId");
		boolean exists = requestId != null && !requestId.isBlank();
		return (exists == acceptIfRequestIdExists) ? FilterReply.ACCEPT : FilterReply.DENY;
	}

}
