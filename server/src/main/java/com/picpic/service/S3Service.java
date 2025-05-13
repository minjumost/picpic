package com.picpic.service;

import java.net.URL;
import java.time.Duration;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.picpic.config.S3Properties;
import com.picpic.dto.S3ImageUploadResponseDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

	private final S3Properties s3Properties;

	public S3ImageUploadResponseDTO generatePresignedUrl(String type, String fileName, String contentType) {
		String key = type + "/" + UUID.randomUUID() + "_" + fileName;

		S3Presigner s3Presigner = S3Presigner.builder()
			.region(Region.of(s3Properties.getRegion()))
			.credentialsProvider(StaticCredentialsProvider.create(
				AwsBasicCredentials.create(s3Properties.getAccessKey(), s3Properties.getSecretKey())))
			.build();

		PutObjectRequest putObjectRequest = PutObjectRequest.builder()
			.bucket(s3Properties.getBucket())
			.key(key)
			.contentType(contentType)
			.build();

		PutObjectPresignRequest putObjectPresignRequest = PutObjectPresignRequest.builder()
			.putObjectRequest(putObjectRequest)
			.signatureDuration(Duration.ofMinutes(10))
			.build();

		URL presignedUrl = s3Presigner.presignPutObject(putObjectPresignRequest).url();

		String fileUrl = "https://" + s3Properties.getBucket() +
			".s3." + s3Properties.getRegion() +
			".amazonaws.com/" + key;

		S3ImageUploadResponseDTO res = S3ImageUploadResponseDTO.builder()
			.presignedUrl(presignedUrl.toString())
			.imageUrl(fileUrl)
			.build();

		log.info("presignedUrl 발급 완료");

		return res;
	}
}
