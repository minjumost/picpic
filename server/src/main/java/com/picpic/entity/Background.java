package com.picpic.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "background")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Background {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "background_id")
	private Long backgroundId;

	@Column(nullable = false, length = 20)
	private String name;

	@Column(name = "background_image_url", nullable = false)
	private String backgroundImageUrl;

	@CreatedDate
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;
}
