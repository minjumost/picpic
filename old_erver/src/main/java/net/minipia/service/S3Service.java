package net.minipia.service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URL;
import java.time.Duration;
import java.util.UUID;

import net.minipia.config.S3Properties;
import net.minipia.dto.RegisterObjectResponseDTO;
import net.minipia.repository.ObjectRepository;

@Service
@RequiredArgsConstructor
public class S3Service {

	private final S3Properties s3Properties;
	private final ObjectRepository objectRepository; // ✅ 수정됨

	public RegisterObjectResponseDTO registerObjectAndGetUploadUrl(
		byte type, String fileName, String contentType, int width, int height) {

		String key = type + "/" + UUID.randomUUID() + "_" + fileName;

		S3Presigner presigner = S3Presigner.builder()
			.region(Region.of(s3Properties.getRegion()))
			.credentialsProvider(StaticCredentialsProvider.create(
				AwsBasicCredentials.create(s3Properties.getAccessKey(), s3Properties.getSecretKey())))
			.build();

		PutObjectRequest putObjectRequest = PutObjectRequest.builder()
			.bucket(s3Properties.getBucket())
			.key(key)
			.contentType(contentType)
			.build();

		PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
			.putObjectRequest(putObjectRequest)
			.signatureDuration(Duration.ofMinutes(10))
			.build();

		URL uploadUrl = presigner.presignPutObject(presignRequest).url();

		String fileUrl = "https://" + s3Properties.getBucket() + ".s3." +
			s3Properties.getRegion() + ".amazonaws.com/" + key;

		// ✅ 올바른 리포지토리 사용
		net.minipia.entity.Object object = net.minipia.entity.Object.builder()
			.type(type)
			.imageUrl(fileUrl)
			.width(width)
			.height(height)
			.build();

		objectRepository.save(object);

		return new RegisterObjectResponseDTO(object.getId(), uploadUrl.toString(), fileUrl);
	}
}


