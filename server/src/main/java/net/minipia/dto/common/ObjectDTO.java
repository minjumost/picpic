package net.minipia.dto.common;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;

@Builder
public record ObjectDTO(Long id, Byte type, String imageUrl, Integer width, Integer height, LocalDateTime createdAt, LocalDateTime updatedAt) {
}
