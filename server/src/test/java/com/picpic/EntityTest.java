package com.picpic;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.picpic.entity.Member;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@DataJpaTest
@Transactional
@ActiveProfiles("test")
public class EntityTest {

	@PersistenceContext
	EntityManager em;

	@Test
	void 멤버_엔티티_저장_조회_테스트() {
		Member member = Member.builder()
			.nickname("테스트 유저")
			.color("#ffffff")
			.profileImageUrl("http://example.com")
			.role(Member.Role.GUEST)
			.build();

		em.persist(member);
		em.flush();
		em.clear();

		Member found = em.find(Member.class, member.getMemberId());

		assertThat(found).isNotNull();
		assertThat(found.getNickname()).isEqualTo(member.getNickname());

	}
}
