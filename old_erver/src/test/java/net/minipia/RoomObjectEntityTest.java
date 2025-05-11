package net.minipia;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import net.minipia.entity.Object;
import net.minipia.entity.Room;
import net.minipia.entity.RoomObject;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@DataJpaTest
@Transactional
@ActiveProfiles(profiles = "test")
@Import(RoomObjectEntityTest.AuditingConfig.class) // Auditing 활성화
class RoomObjectEntityTest {

	@TestConfiguration
	@EnableJpaAuditing
	static class AuditingConfig {
	}

	@PersistenceContext
	EntityManager em;

	@Test
	void 방오브젝트_엔티티_직접_저장_조회() {
		// given
		Room room = Room.builder().code("123456").build();
		Object object = Object.builder()
			.type(Byte.valueOf("1"))
			.width(10)
			.height(10)
			.imageUrl("https://example.com/object.png")
			.build();

		em.persist(room);
		em.persist(object);
		em.flush();

		RoomObject roomObject = RoomObject.builder()
			.room(room)
			.object(object)
			.posX(5)
			.posY(5)
			.build();

		// when
		em.persist(roomObject);
		em.flush();
		em.clear();

		// then
		RoomObject found = em.find(RoomObject.class, roomObject.getId());

		assertThat(found).isNotNull();
		assertThat(found.getRoom().getId()).isEqualTo(room.getId());
		assertThat(found.getObject().getId()).isEqualTo(object.getId());
		assertThat(found.getPosX()).isEqualTo(5);
		assertThat(found.getPosY()).isEqualTo(5);
		assertThat(found.getCreatedAt()).isNotNull();
	}
}
