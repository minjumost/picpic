package com.picpic.config;

import org.hibernate.resource.jdbc.spi.StatementInspector;
import org.springframework.stereotype.Component;

@Component
public class QueryInspector implements StatementInspector {

	private static final ThreadLocal<Integer> queryCount = ThreadLocal.withInitial(() -> 0);

	@Override
	public String inspect(String sql) {
		queryCount.set(queryCount.get() + 1);
		return sql;
	}

	public static int getQueryCount() {
		return queryCount.get();
	}

	public static void clear() {
		queryCount.remove();
	}
}
