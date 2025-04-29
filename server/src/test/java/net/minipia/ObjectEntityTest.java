package net.minipia;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.transaction.annotation.Transactional;

import net.minipia.entity.Object;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@DataJpaTest
@Transactional
@Import(ObjectEntityTest.AuditingConfig.class) // Auditing 활성화
class ObjectEntityTest {

	@TestConfiguration
	@EnableJpaAuditing
	static class AuditingConfig {
	}

	@PersistenceContext
	EntityManager em;

	@Test
	void 오브젝트_엔티티_직접_저장_조회() {
		// given
		Object object = Object.builder()
			.type(Byte.valueOf("1"))
			.width(20)
			.height(20)
			.imageUrl("https://example.com")
			.build();

		// when
		em.persist(object);
		em.flush();
		em.clear();

		// then
		Object found = em.find(Object.class, object.getId());

		assertThat(found.getType()).isEqualTo(object.getType());
		assertThat(found.getWidth()).isEqualTo(object.getWidth());
		assertThat(found.getHeight()).isEqualTo(object.getHeight());
		assertThat(found.getCreatedAt()).isNotNull(); // 이제 createdAt 자동 채워짐
	}
}
