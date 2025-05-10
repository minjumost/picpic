package com.picpic.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "stroke")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Stroke {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "stroke_id")
	private Long strokeId;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "photo_id", nullable = false)
	private Photo photo;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "participant_id", nullable = false)
	private Participant participant;

	@Column(nullable = false)
	private Tool tool;

	@Column(nullable = false, length = 7)
	private String color;

	@Column(name = "points_json", nullable = false, columnDefinition = "JSON")
	private String pointsJson;

	@CreationTimestamp
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;

	@Getter
	enum Tool {
		ERASER(0),
		PEN(1);

		private final int value;

		Tool(int value) {
			this.value = value;
		}
	}
}
