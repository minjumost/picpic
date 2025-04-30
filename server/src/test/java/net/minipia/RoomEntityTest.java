package net.minipia;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import net.minipia.entity.Room;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@DataJpaTest
@Transactional
@ActiveProfiles(profiles = "test")
@Import(RoomEntityTest.AuditingConfig.class) // Auditing 활성화
class RoomEntityTest {

	@TestConfiguration
	@EnableJpaAuditing
	static class AuditingConfig {
	}

	@PersistenceContext
	EntityManager em;

	@Test
	void 방_엔티티_직접_저장_조회() {
		// given
		Room room = Room.builder()
			.code("123456")
			.build();

		// when
		em.persist(room);
		em.flush();
		em.clear();

		// then
		Room found = em.find(Room.class, room.getId());

		assertThat(found).isNotNull();
		assertThat(found.getCreatedAt()).isNotNull();
		assertThat(found.getUpdatedAt()).isNotNull();
		assertThat(found.getDeletedAt()).isNull();
	}
}
