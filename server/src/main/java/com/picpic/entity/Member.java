package com.picpic.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
@Table(name = "member")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Member {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "member_id")
	private Long memberId;

	@Column(nullable = false, length = 20)
	private String nickname;

	@Column(name = "profile_image_url", nullable = false)
	private String profileImageUrl;

	@Column(nullable = false, length = 7)
	private String color;

	@Column(unique = true, length = 100)
	private String email;

	@Column(name = "ssafy_user_id", unique = true, length = 50)
	private String ssafyUserId;

	@Column(nullable = false)
	private Role role;

	@CreationTimestamp
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;

	@Getter
	public enum Role {
		ADMIN(0),
		GUEST(1),
		KAKAO(2),
		SSAFY(3);

		private final int code;

		Role(int code) {
			this.code = code;
		}

	}
}
