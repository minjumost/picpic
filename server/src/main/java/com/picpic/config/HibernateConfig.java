package com.picpic.config;

import org.hibernate.cfg.AvailableSettings;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
public class HibernateConfig {

	private final QueryInspector queryInspector;

	@Bean
	public HibernatePropertiesCustomizer hibernatePropertiesCustomizer() {
		return hibernateProperties -> {
			hibernateProperties.put(AvailableSettings.STATEMENT_INSPECTOR, queryInspector);
		};
	}
}
