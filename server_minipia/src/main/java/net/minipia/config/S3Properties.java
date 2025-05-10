package net.minipia.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "aws.s3")
@Getter
@Setter
public class S3Properties {
	private String bucket;
	private String region;
	private String accessKey;
	private String secretKey;
}

